import { db } from '../src/lib/db';
import { hashPassword, verifyPassword } from '../src/lib/auth/password';
import { createSessionToken, verifySessionToken } from '../src/lib/auth/session';
import { complaintSubmissionSchema, statusUpdateSchema, trackComplaintSchema } from '../src/lib/validation/schemas';
import { validateEvidenceFile, calculateHash } from '../src/lib/utils/security';
import { eventBus } from '../src/lib/events/event-bus';
import { workerQueue } from '../src/lib/queue/background-worker';
import bcrypt from 'bcryptjs';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================================');
  console.log('  EdSecure Hub - Production Test Suite & Verification');
  console.log('========================================================\n');

  // --- 1. Authentication & Hashing ---
  console.log('\x1b[36m[Suite 1: Cryptographic Authentication & Password Security]\x1b[0m');
  const plainPass = 'CyberSecure@2026';
  const hashed = await hashPassword(plainPass);
  assert(hashed.startsWith('$2a$') || hashed.startsWith('$2b$'), 'Bcrypt password hash format is valid ($2a$ or $2b$)');
  assert(await verifyPassword(plainPass, hashed), 'Correct password successfully verified');
  assert(!(await verifyPassword('WrongPassword', hashed)), 'Incorrect password rejected');

  // --- 2. Session Management ---
  console.log('\n\x1b[36m[Suite 2: JWT Stateless Session Validation]\x1b[0m');
  const token = await createSessionToken({
    userId: 'test-user-123',
    email: 'test@edsecure.gov',
    fullName: 'Test Officer',
    role: 'AUTHORITY',
    badgeNumber: 'CC-999',
  });
  assert(typeof token === 'string' && token.length > 50, 'JWT token created successfully');
  const verified = await verifySessionToken(token);
  assert(verified !== null && verified.userId === 'test-user-123' && verified.role === 'AUTHORITY', 'JWT token decoded and claims verified');
  assert((await verifySessionToken('invalid.token.here')) === null, 'Malformed JWT token safely rejected');

  // --- 3. Input Validation Schemas ---
  console.log('\n\x1b[36m[Suite 3: Zod Schema & Input Sanitization]\x1b[0m');
  const validComplaint = {
    incidentType: 'Financial Fraud',
    incidentDate: '2026-10-02T10:00:00Z',
    platform_service: 'Telegram',
    description: 'Victim was manipulated into transferring $500 via QR code collect request on marketplace.',
    financialLoss: 500,
    currency: 'USD',
    victimName: 'John Doe',
    victimEmail: 'john@example.com',
    victimPhone: '+1 (555) 123-4567',
    isAnonymous: false,
    priority: 'MEDIUM',
  };
  const valResult = complaintSubmissionSchema.safeParse(validComplaint);
  assert(valResult.success, 'Valid complaint passes schema validation');

  const invalidComplaint = {
    ...validComplaint,
    description: 'Too short', // Min 20 chars
  };
  const invalidResult = complaintSubmissionSchema.safeParse(invalidComplaint);
  assert(!invalidResult.success, 'Short description (<20 chars) rejected with validation error');

  // --- 4. Complaint Submission & Reference Generation ---
  console.log('\n\x1b[36m[Suite 4: Complaint Lifecycle & Reference ID Generation]\x1b[0m');
  const rawPin = '9876';
  const pinHash = await bcrypt.hash(rawPin, 10);
  const createdComplaint = await db.createComplaint({
    user_id: null,
    raw_pin: rawPin,
    pin_hash: pinHash,
    tracking_pin_hash: pinHash,
    incident_type: 'Phishing',
    incident_date: '2026-10-02T09:00:00Z',
    platform_service: 'SMS Gateway',
    description: 'Spoofed SMS link impersonated federal revenue service demanding immediate debit card entry.',
    financial_loss: 0,
    currency: 'USD',
    victim_name: 'Test Citizen',
    victim_email: 'testcitizen@example.com',
    victim_phone: '+1 (555) 999-1122',
    is_anonymous: false,
    priority: 'HIGH',
  });

  assert(/^ED-\d{4}-\d{5}$/.test(createdComplaint.reference_id), `Complaint reference ID generated correctly: ${createdComplaint.reference_id}`);
  assert(createdComplaint.status === 'SUBMITTED', 'Initial complaint status defaults to SUBMITTED');

  // --- 5. Complaint Tracking & PIN Verification ---
  console.log('\n\x1b[36m[Suite 5: Public Complaint Tracking & Secret PIN Verification]\x1b[0m');
  const fetchedComplaint = await db.getComplaintByReference(createdComplaint.reference_id);
  assert(fetchedComplaint !== null, 'Complaint successfully retrieved by Reference ID');
  const isPinOk = await bcrypt.compare(rawPin, fetchedComplaint!.tracking_pin_hash);
  assert(isPinOk, 'Tracking PIN correctly validates against hashed secret');
  const isWrongPinOk = await bcrypt.compare('0000', fetchedComplaint!.tracking_pin_hash);
  assert(!isWrongPinOk, 'Incorrect PIN fails authentication check');

  // --- 6. State Transition Verification ---
  console.log('\n\x1b[36m[Suite 6: Valid & Invalid Status Transitions]\x1b[0m');
  const officerUser = (await db.findUserByEmail('officer@cybercell.gov'))!;
  
  // Transition 1: SUBMITTED -> UNDER_REVIEW
  const step1 = await db.updateComplaintStatus({
    complaintId: createdComplaint.id,
    newStatus: 'UNDER_REVIEW',
    changedBy: officerUser,
    reason: 'Initial threat triage initiated by duty officer.',
  });
  assert(step1.complaint.status === 'UNDER_REVIEW', 'Transition SUBMITTED -> UNDER_REVIEW succeeded');

  // Transition 2: UNDER_REVIEW -> ASSIGNED
  const step2 = await db.updateComplaintStatus({
    complaintId: createdComplaint.id,
    newStatus: 'ASSIGNED',
    changedBy: officerUser,
    reason: 'Assigned to Inspector Marcus Thorne for forensic analysis.',
  });
  assert(step2.complaint.status === 'ASSIGNED', 'Transition UNDER_REVIEW -> ASSIGNED succeeded');

  // Timeline verification
  const timeline = await db.getStatusHistory(createdComplaint.id, true);
  assert(timeline.length >= 3, `Immutable timeline tracks history (${timeline.length} milestone records)`);

  // --- 7. Evidence Validation & Hashing ---
  console.log('\n\x1b[36m[Suite 7: Evidence Integrity & SHA-256 Chain of Custody]\x1b[0m');
  const testBuffer = Buffer.from('Official unedited forensic screenshot data');
  const hash = calculateHash(testBuffer);
  assert(hash.length === 64, `SHA-256 hash successfully computed: ${hash.slice(0, 16)}...`);

  const validEvidence = validateEvidenceFile({
    name: 'screenshot.png',
    size: 2 * 1024 * 1024, // 2MB
    type: 'image/png',
  });
  assert(validEvidence.valid, 'PNG evidence file accepted');

  const invalidType = validateEvidenceFile({
    name: 'payload.exe',
    size: 1024,
    type: 'application/x-msdownload',
  });
  assert(!invalidType.valid, 'Executable file format (.exe) strictly rejected');

  const oversizedFile = validateEvidenceFile({
    name: 'giant.pdf',
    size: 25 * 1024 * 1024, // 25MB > 10MB limit
    type: 'application/pdf',
  });
  assert(!oversizedFile.valid, 'Oversized file (>10MB) rejected');

  // --- 8. Event Bus & Worker Queue ---
  console.log('\n\x1b[36m[Suite 8: Domain Event Bus & Background Worker Queue]\x1b[0m');
  let eventReceived = false;
  eventBus.once('ComplaintSubmitted', () => {
    eventReceived = true;
  });
  eventBus.publish({
    type: 'ComplaintSubmitted',
    payload: { complaint: createdComplaint, rawPin: '1234' },
  });
  assert(eventReceived, 'Domain event bus successfully dispatches and executes subscribers');

  const jobId = workerQueue.enqueue({
    type: 'TRIAGE_COMPLAINT_RISK',
    payload: { complaintId: createdComplaint.id },
  });
  assert(typeof jobId === 'string' && jobId.length > 10, `Background job enqueued with ID: ${jobId.slice(0, 8)}...`);

  // --- Summary ---
  console.log('\n========================================================');
  console.log(`  Tests Passed: \x1b[32m${passed}\x1b[0m | Failed: \x1b[31m${failed}\x1b[0m`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((e) => {
  console.error('Test suite uncaught error:', e);
  process.exit(1);
});
