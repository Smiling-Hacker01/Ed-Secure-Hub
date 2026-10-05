import { User, Complaint, EvidenceItem, ComplaintStatusHistory, InternalNote, AuditEvent, BlogPost, CyberStation } from './types';
import bcrypt from 'bcryptjs';

// Precomputed password hash for default test accounts: 'CyberSecure@2026'
// NOTE: Real officer/director accounts are managed via the admin API or
// directly seeded into the live .data store — never hardcode real credentials here.
export const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('CyberSecure@2026', 10);

export const SEED_USERS: User[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'admin@edsecure.gov',
    password_hash: DEFAULT_PASSWORD_HASH,
    full_name: 'Special Director Anjali Mehra, IPS',
    phone: '+91 11 2309 2831',
    role: 'ADMIN',
    badge_number: 'DIR-901',
    department: 'Cybercrime Directorate Command, MHA',
    is_active: true,
    mfa_enabled: true,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    email: 'officer@cybercell.gov',
    password_hash: DEFAULT_PASSWORD_HASH,
    full_name: 'Inspector Rajiv Shankar',
    phone: '+91 11 2309 7462',
    role: 'AUTHORITY',
    badge_number: 'CC-4092',
    department: 'Financial Cyber Fraud Division',
    is_active: true,
    mfa_enabled: true,
    created_at: '2026-02-15T09:30:00Z',
    updated_at: '2026-02-15T09:30:00Z',
  },
  {
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    email: 'analyst@cybercell.gov',
    password_hash: DEFAULT_PASSWORD_HASH,
    full_name: 'Sub-Inspector Priya Nambiar',
    phone: '+91 11 2309 9941',
    role: 'AUTHORITY',
    badge_number: 'CC-5120',
    department: 'Identity Theft & Digital Forensics Unit',
    is_active: true,
    mfa_enabled: false,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    email: 'victim@example.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    full_name: 'Arjun Kapoor',
    phone: '+91 98765 43210',
    role: 'USER',
    is_active: true,
    created_at: '2026-09-01T14:20:00Z',
    updated_at: '2026-09-01T14:20:00Z',
  },
  {
    id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    email: 'citizen@example.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    full_name: 'Sneha Iyer',
    phone: '+91 87654 32109',
    role: 'USER',
    is_active: true,
    created_at: '2026-09-12T11:45:00Z',
    updated_at: '2026-09-12T11:45:00Z',
  },
  // NOTE: Real officer/director accounts (Vishal, Raghvendra) are NOT seeded here.
  // They live only in .data/edsecure_store.json (gitignored) or the production DB.
  // To re-create them, run: npm run setup:officers
];

export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    reference_id: 'ED-2026-84920',
    user_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    tracking_pin_hash: bcrypt.hashSync('8492', 10),
    raw_pin: '8492',
    incident_type: 'Financial Fraud',
    incident_date: '2026-09-28T14:30:00Z',
    platform_service: 'Telegram / CryptoDex Pro App',
    description: 'Victim was invited to a Telegram investment group promising 25% weekly yield on algorithmic stablecoin arbitrage. Transferred ₹3,75,000 across two NEFT transactions. When trying to withdraw funds, platform demanded an additional ₹1,00,000 "clearance fee" and locked account access.',
    financial_loss: 375000.00,
    currency: 'INR',
    suspect_contact: '+91 98001 55019 / support@cryptodex-portal.org',
    suspect_identifier: 'Wallet 0x71C...b9F / Telegram @ChiefTraderRajan',
    victim_name: 'Arjun Kapoor',
    victim_email: 'victim@example.com',
    victim_phone: '+91 98765 43210',
    victim_state: 'Maharashtra',
    victim_city: 'Pune',
    is_anonymous: false,
    status: 'INVESTIGATION',
    priority: 'HIGH',
    assigned_to: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    assigned_officer_name: 'Inspector Rajiv Shankar',
    assigned_at: '2026-09-29T09:15:00Z',
    created_at: '2026-09-28T16:00:00Z',
    updated_at: '2026-09-30T10:20:00Z',
  },
  {
    id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    reference_id: 'ED-2026-31092',
    user_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    tracking_pin_hash: bcrypt.hashSync('3109', 10),
    raw_pin: '3109',
    incident_type: 'Identity Theft',
    incident_date: '2026-09-30T11:00:00Z',
    platform_service: 'Airtel Mobile / Google Workspace',
    description: 'Unauthorized SIM swap executed on primary Airtel mobile number at approximately 10:45 AM. Perpetrators initiated password resets across Gmail, net banking, and accessed cloud drive containing Aadhaar-linked documents. Telecom operator confirmed unauthorized port-out request made in Bengaluru.',
    financial_loss: 0.00,
    currency: 'INR',
    suspect_contact: 'Unknown (Cell tower transfer recorded in Bengaluru)',
    suspect_identifier: 'SIM Port Authorization ID 883921-AT',
    victim_name: 'Sneha Iyer',
    victim_email: 'citizen@example.com',
    victim_phone: '+91 87654 32109',
    victim_state: 'Karnataka',
    victim_city: 'Bengaluru',
    is_anonymous: false,
    status: 'ASSIGNED',
    priority: 'CRITICAL',
    assigned_to: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    assigned_officer_name: 'Sub-Inspector Priya Nambiar',
    assigned_at: '2026-09-30T13:00:00Z',
    created_at: '2026-09-30T11:30:00Z',
    updated_at: '2026-09-30T13:00:00Z',
  },
  {
    id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    reference_id: 'ED-2026-11847',
    user_id: null,
    tracking_pin_hash: bcrypt.hashSync('1184', 10),
    raw_pin: '1184',
    incident_type: 'Phishing',
    incident_date: '2026-10-01T08:45:00Z',
    platform_service: 'SMS / Fake SBI Banking Gateway',
    description: 'Received SMS spoofing SBI Fraud Prevention stating: "Suspicious ₹7,000 transaction flagged. Verify at https://sbi-security-verify.net/auth". Entered debit card details and OTP before recognizing misspelled URL. Immediately froze card with branch manager.',
    financial_loss: 23000.00,
    currency: 'INR',
    suspect_contact: '+91 91770 55032',
    suspect_identifier: 'Domain: sbi-security-verify.net (Registered via GoDaddy India)',
    victim_name: 'Anonymous Citizen',
    victim_email: 'secure-report@citizen.org',
    victim_phone: '+91 00000 00000',
    victim_state: 'Uttar Pradesh',
    victim_city: 'Lucknow',
    is_anonymous: true,
    status: 'SUBMITTED',
    priority: 'MEDIUM',
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-10-01T09:00:00Z',
  },
  {
    id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    reference_id: 'ED-2026-90451',
    user_id: null,
    tracking_pin_hash: bcrypt.hashSync('9045', 10),
    raw_pin: '9045',
    incident_type: 'Online Harassment & Doxxing',
    incident_date: '2026-09-25T19:00:00Z',
    platform_service: 'Instagram / Discord',
    description: 'Perpetrator created multiple impersonation profiles posting complainant personal address, workplace in Connaught Place, and fabricated private conversations. Demanding ₹80,000 ransom via Paytm to cease targeted harassment campaigns.',
    financial_loss: 0.00,
    currency: 'INR',
    suspect_contact: 'Discord tag @shadow_leaks#9901',
    suspect_identifier: 'IG: @dox_expose_2026',
    victim_name: 'Kavitha Rajan',
    victim_email: 'kavitha.rajan@example.com',
    victim_phone: '+91 94455 89100',
    victim_state: 'Delhi',
    victim_city: 'New Delhi',
    is_anonymous: false,
    status: 'ACTION_TAKEN',
    priority: 'HIGH',
    assigned_to: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    assigned_officer_name: 'Inspector Rajiv Shankar',
    assigned_at: '2026-09-26T10:00:00Z',
    created_at: '2026-09-25T20:30:00Z',
    updated_at: '2026-09-27T16:00:00Z',
  },
  {
    id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    reference_id: 'ED-2026-72810',
    user_id: null,
    tracking_pin_hash: bcrypt.hashSync('7281', 10),
    raw_pin: '7281',
    incident_type: 'UPI / Wire Fraud',
    incident_date: '2026-09-20T12:00:00Z',
    platform_service: 'OLX / Fake Buyer QR Code Scam',
    description: 'Selling home electronics on OLX. Fraudster posed as buyer, agreed to full price without negotiation, and sent a collect-money QR code claiming seller must scan it to receive payment. Victim scanned QR in PhonePe app and lost ₹54,000 via reverse payment mechanism.',
    financial_loss: 54000.00,
    currency: 'INR',
    suspect_contact: '+91 78190 99210',
    suspect_identifier: 'UPI VPA: merchant-refund-node@icici',
    victim_name: 'Suresh Pandey',
    victim_email: 'suresh.pandey@example.com',
    victim_phone: '+91 91233 44556',
    victim_state: 'Gujarat',
    victim_city: 'Surat',
    is_anonymous: false,
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assigned_to: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    assigned_officer_name: 'Inspector Rajiv Shankar',
    assigned_at: '2026-09-20T14:00:00Z',
    resolution_summary: 'Liaised with beneficiary payment gateway nodal officer at ICICI Bank. Beneficiary mule wallet frozen. ₹54,000 recovered and returned to victim account via chargeback reversal on Sep 24.',
    closed_at: '2026-09-24T15:30:00Z',
    created_at: '2026-09-20T12:45:00Z',
    updated_at: '2026-09-24T15:30:00Z',
  },
];

export const SEED_EVIDENCE: EvidenceItem[] = [
  {
    id: 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    file_name: 'evidence_telegram_chat_export.pdf',
    original_name: 'Telegram_Investment_Chat_Logs.pdf',
    mime_type: 'application/pdf',
    size_bytes: 2458900,
    storage_path: '/secure-vault/evidence/01eebc99/Telegram_Investment_Chat_Logs.pdf',
    sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    notes: 'Full unedited chat logs demonstrating promise of guaranteed returns and admin extortion.',
    is_verified: true,
    created_at: '2026-09-28T16:05:00Z',
  },
  {
    id: 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    file_name: 'bank_wire_transfer_receipt.png',
    original_name: 'Chase_Wire_Receipt_4500.png',
    mime_type: 'image/png',
    size_bytes: 842100,
    storage_path: '/secure-vault/evidence/01eebc99/Chase_Wire_Receipt_4500.png',
    sha256_hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    notes: 'Official bank statement showing wire transfer routing number and beneficiary name.',
    is_verified: true,
    created_at: '2026-09-28T16:10:00Z',
  },
  {
    id: 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    file_name: 'carrier_porting_alert_screenshot.jpg',
    original_name: 'Carrier_Unauthorized_Port_Alert.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 612400,
    storage_path: '/secure-vault/evidence/01eebc99/Carrier_Unauthorized_Port_Alert.jpg',
    sha256_hash: '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
    notes: 'SMS notice from telecom confirming SIM card replacement executed without owner consent.',
    is_verified: true,
    created_at: '2026-09-30T11:32:00Z',
  },
];

export const SEED_STATUS_HISTORY: ComplaintStatusHistory[] = [
  {
    id: 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    previous_status: undefined,
    new_status: 'SUBMITTED',
    changed_by_name: 'Citizen Self-Report Portal',
    change_reason: 'Initial digital complaint successfully lodged with encrypted evidence payload.',
    is_public: true,
    created_at: '2026-09-28T16:00:00Z',
  },
  {
    id: 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    previous_status: 'SUBMITTED',
    new_status: 'UNDER_REVIEW',
    changed_by_name: 'Triage Desk AI & Duty Officer',
    change_reason: 'Automated threat scoring classified incident as High Priority Financial Scam.',
    is_public: true,
    created_at: '2026-09-28T16:15:00Z',
  },
  {
    id: 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    previous_status: 'UNDER_REVIEW',
    new_status: 'ASSIGNED',
    changed_by_name: 'Special Director Anjali Mehra, IPS',
    changed_by_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    change_reason: 'Assigned to Inspector Rajiv Shankar (Financial Cyber Fraud Division).',
    is_public: true,
    created_at: '2026-09-29T09:15:00Z',
  },
  {
    id: 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    previous_status: 'ASSIGNED',
    new_status: 'INVESTIGATION',
    changed_by_name: 'Inspector Rajiv Shankar',
    changed_by_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    change_reason: 'Formal freeze order sent to ICICI Bank payment gateway. Blockchain wallet tracing active via I4C coordination.',
    is_public: true,
    created_at: '2026-09-30T10:20:00Z',
  },
  {
    id: 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    previous_status: undefined,
    new_status: 'SUBMITTED',
    changed_by_name: 'Citizen Self-Report Portal',
    change_reason: 'Critical identity theft incident lodged.',
    is_public: true,
    created_at: '2026-09-30T11:30:00Z',
  },
  {
    id: 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    previous_status: 'SUBMITTED',
    new_status: 'ASSIGNED',
    changed_by_name: 'Triage System',
    change_reason: 'Automated high-velocity assignment to Digital Forensics Unit.',
    is_public: true,
    created_at: '2026-09-30T13:00:00Z',
  },
];

export const SEED_INTERNAL_NOTES: InternalNote[] = [
  {
    id: 'n1eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    author_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    author_name: 'Inspector Rajiv Shankar',
    author_badge: 'CC-4092',
    note: 'Initial blockchain clustering reveals suspect wallet 0x71C...b9F is connected to an active syndicate operation previously identified in Case #ED-2026-6101. Issued court notice to WazirX exchange compliance cell.',
    visibility: 'INTERNAL',
    created_at: '2026-09-30T11:00:00Z',
  },
  {
    id: 'n1eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    complaint_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    author_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    author_name: 'Special Director Anjali Mehra, IPS',
    author_badge: 'DIR-901',
    note: 'Priority confirmed. Coordinate with Telangana Cyber Cell and RBI nodal officer if funds detected routed through third-party mule accounts registered in HDFC or Paytm Payments Bank.',
    visibility: 'AUTHORITY_ONLY',
    created_at: '2026-09-30T11:45:00Z',
  },
];

export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    entity_type: 'COMPLAINT',
    entity_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    actor_name: 'Public Portal System',
    action: 'COMPLAINT_CREATED',
    new_state: { reference_id: 'ED-2026-84920', status: 'SUBMITTED', priority: 'HIGH' },
    ip_address: '198.51.100.44',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    created_at: '2026-09-28T16:00:00Z',
  },
  {
    id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    entity_type: 'COMPLAINT',
    entity_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    actor_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    actor_name: 'Special Director Anjali Mehra, IPS',
    actor_role: 'ADMIN',
    action: 'CASE_ASSIGNED',
    old_state: { assigned_to: null, status: 'UNDER_REVIEW' },
    new_state: { assigned_to: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', status: 'ASSIGNED' },
    ip_address: '10.240.12.8',
    created_at: '2026-09-29T09:15:00Z',
  },
  {
    id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    entity_type: 'COMPLAINT',
    entity_id: '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    actor_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    actor_name: 'Inspector Rajiv Shankar',
    actor_role: 'AUTHORITY',
    action: 'STATUS_TRANSITION',
    old_state: { status: 'ASSIGNED' },
    new_state: { status: 'INVESTIGATION' },
    ip_address: '10.240.14.22',
    created_at: '2026-09-30T10:20:00Z',
  },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    slug: 'anatomy-of-sim-swap-fraud-prevention',
    title: 'The Anatomy of a SIM Swap: How Attackers Hijack Your Number & How to Defend',
    summary: 'Understand how cybercriminals bypass two-factor authentication via telecom carrier manipulation and step-by-step measures to freeze account takeovers before they strike.',
    content: `
### What is a SIM Swap Attack?

A **SIM swap scam** (also termed SIM splitting or SIM jacking) is an advanced social engineering and credential fraud technique. The adversary collects personal data about a victim through phishing, data breaches, or social media scraping. Armed with this personally identifiable information (PII), the criminal contacts your mobile carrier posing as you.

They fabricate an urgent story—claiming their phone was lost, damaged, or stolen—and request the carrier customer service representative to port the phone number to a new blank SIM card in their physical possession.

### Why Attackers Target SIM Cards

Once your phone number is successfully routed to the attacker's device, your handset instantly drops network service ("No Service" or "Emergency Calls Only"). The criminal now receives all your incoming SMS messages and voice calls, specifically:

1. **One-Time Passcodes (OTP)**: Financial transactions, banking logins, and cloud account password resets.
2. **Account Recovery Tokens**: Password reset triggers on Apple ID, Google Workspace, WhatsApp, and cryptocurrency exchanges.
3. **Impersonation Opportunities**: Sending urgent requests for funds to contacts via messaging apps while the victim is disconnected.

---

### Red Flags & Immediate Warning Signs

- **Sudden and complete loss of cellular connectivity**: In areas with known good coverage, your phone switches to "No Service" or "SOS only".
- **Notification alerts**: Emails from your cellular provider confirming a "SIM change" or "Profile update" you never initiated.
- **Unauthorized password reset emails**: Notifications from financial institutions or email providers that a password reset was requested.

---

### Step-by-Step Defense Protocol

#### 1. Implement Carrier PINs (Port Freeze)
Contact your cellular provider immediately and establish a verbal transfer PIN or "Port-Out Freeze". Carriers will refuse any SIM transfer without this distinct security passphrase.

#### 2. Transition from SMS 2FA to Hardware Security Keys
SMS-based two-factor authentication is fundamentally vulnerable to telecom interception. Switch critical accounts (banking, primary email, password managers) to:
- **FIDO2 / WebAuthn Hardware Keys** (e.g., YubiKey)
- **Time-based Authenticator Apps** (e.g., Aegis, Google Authenticator)

#### 3. Never Share PII Publicly
Do not publish your birthday, mother's maiden name, primary phone number, or pet names on social platforms. Fraudsters utilize this information to satisfy carrier security questions.
    `,
    category: 'Account Security',
    author_name: 'Sub-Inspector Priya Nambiar',
    author_role: 'Digital Forensics & Incident Response',
    reading_time_minutes: 7,
    tags: ['SIM Swap', '2FA', 'Account Takeover', 'Telecom Security'],
    is_featured: true,
    view_count: 3420,
    published_at: '2026-09-24T10:00:00Z',
    created_at: '2026-09-24T10:00:00Z',
  },
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    slug: 'instant-payment-upi-fraud-playbook',
    title: 'Instant Payment & UPI Scams: Recognizing the "Reverse Payment" Trap',
    summary: 'Scammers exploit psychological blind spots and platform UX by requesting money under the guise of refunds or buyer payments. Learn the critical rule of digital payments.',
    content: `
### The Core Rule of Digital Payments

> **GOLDEN RULE: You NEVER need to enter your PIN, scan a QR code, or approve a collect request to RECEIVE money.**

If someone claims they are sending you money, the transaction happens entirely on their end. Any prompt demanding your authorization, biometric fingerprint, or UPI PIN is a withdrawal request.

---

### The Anatomy of Common Payment Traps

#### 1. The "Scan QR to Receive Money" Deception
- **The Setup**: You list an item for sale on an online marketplace (OLX, Facebook Marketplace, Craigslist).
- **The Bait**: A buyer contacts you enthusiastically, agrees to the full price immediately without negotiation, and insists on paying via instant digital transfer.
- **The Trap**: They send a custom QR code claiming: *"Scan this QR in your payment app to credit the amount to your account."*
- **The Reality**: The QR code encodes a merchant payment debit link. Scanning and authenticating debits your account immediately.

#### 2. The Remote Access Support Trap
- Fraudsters masquerade as customer support for your bank or electricity provider.
- They inform you of a pending refund or failed transaction.
- They convince you to download a screen-sharing tool (AnyDesk, TeamViewer QuickSupport) to "help verify the payment".
- Once connected, they watch your keystrokes and siphon two-factor authentication tokens.

---

### What to Do If You Were Targeted

1. **Golden First 2 Hours**: Contact the Cyber Fraud National Helpline immediately (**Call 1930** or use our structured report workflow). Speed is decisive in freezing beneficiary accounts.
2. **Lodge Bank Dispute**: Immediately call your bank's 24/7 fraud dispute hotline to file a chargeback and freeze associated UPI / debit linkages.
3. **Preserve Receipts**: Take clean screenshots showing the Transaction Reference ID (UTR / RRN), sender/receiver handles, and chat timestamps.
    `,
    category: 'Financial Safety',
    author_name: 'Inspector Rajiv Shankar',
    author_role: 'Financial Cyber Fraud Division',
    reading_time_minutes: 5,
    tags: ['Payment Scams', 'UPI Fraud', 'Financial Safety', 'Social Engineering'],
    is_featured: true,
    view_count: 5120,
    published_at: '2026-09-26T14:30:00Z',
    created_at: '2026-09-26T14:30:00Z',
  },
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    slug: 'documenting-evidence-for-cyber-cells',
    title: 'The Citizen\'s Guide to Documenting Admissible Evidence in Cybercrimes',
    summary: 'What screenshots, transaction headers, and log files are required by law enforcement and cyber-cells to freeze stolen funds and track perpetrators.',
    content: `
### Why Evidence Quality Dictates Case Outcomes

In cybercrime investigations, speed and technical integrity determine whether stolen assets can be recovered. When cyber-cell officers receive a complaint, they must legally substantiate freeze requests to banks, telcos, and internet service providers.

Filing an ambiguous complaint stating *"Someone took my money"* without technical identifiers causes delays during the crucial golden window.

---

### Essential Evidence Checklist by Incident Type

#### A. Financial & Banking Fraud
- **Bank Statement**: Official statement or PDF receipt showing Date, Time, Sender Account, Recipient Account/VPA, and Unique Transaction Reference (UTR/RRN).
- **Communication Logs**: Complete chat history exports with the suspect showing phone numbers, handles, and transaction requests.
- **Payment Link/QR**: Screenshots of the exact payment link or QR code sent by the perpetrator.

#### B. Phishing & Spoofed Portals
- **Full URL**: Do not submit just a truncated link. Provide the complete web address (e.g. \`https://fake-login-chase.com/auth?token=...\`).
- **SMS / Email Headers**: Raw email headers (showing the real originating SMTP server and Return-Path) rather than just the visible sender name.
- **Screenshots of Fake Pages**: Captures of the phishing portal with the browser address bar clearly visible.

#### C. Harassment, Blackmail & Doxxing
- **Suspect Profile URLs**: Persistent URLs or Unique IDs of the attacker's profiles rather than just display names (which change frequently).
- **Uncropped Screenshots**: Captures showing timestamps, battery icon, and surrounding chat context. Cropped images are often contested in court proceedings.
- **Original Media**: Preserve original audio messages, videos, or documents without forwarding compression if possible.

---

### Secure Evidence Preservation Best Practices

1. **Do Not Delete Messages**: Even if traumatic or threatening, deleting the thread destroys metadata and digital chain of custody.
2. **Document Suspect Numbers**: Save the international dialing prefix (\`+1\`, \`+91\`, \`+44\`).
3. **Upload to EdSecure Vault**: Upload high-resolution files directly through the [Report Incident](/report) workflow to calculate SHA-256 integrity hashes on ingestion.
    `,
    category: 'Cyber Awareness',
    author_name: 'SP Vikram Rathore, IPS',
    author_role: 'Cybercrime Directorate Command, MHA',
    reading_time_minutes: 6,
    tags: ['Evidence Preservation', 'Legal Chain of Custody', 'Cyber Cell', 'Reporting Guide'],
    is_featured: false,
    view_count: 2840,
    published_at: '2026-09-27T08:15:00Z',
    created_at: '2026-09-27T08:15:00Z',
  },
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    slug: 'fake-customer-support-call-center-tactics',
    title: 'Inside Fake Customer Support Call Centers: How Scripted Scams Work',
    summary: 'Deconstructing search engine ad poisoning, fraudulent toll-free hotlines, and how criminal rings manipulate search algorithms to prey on customers seeking urgent help.',
    content: `
### Search Engine Ad Poisoning

When individuals experience banking glitches, airline rebooking problems, or wallet lockouts, their first reflex is often searching for customer support hotlines on major search engines.

Cybercriminal networks exploit this behavior through **SEO Cloaking & Sponsored Ad Poisoning**. They purchase sponsored advertisements for keywords like *"Airline Toll Free Support"* or *"Crypto Wallet Customer Care Number"*. These deceptive ads appear at the top of search results, routing victims directly to criminal boiler rooms.

---

### The Scripted Manipulation Tactics

#### 1. The Fabricated Urgency
The operator speaks with deliberate authority, informing the caller that their account is under active investigation for money laundering or that funds will be forfeited within 60 minutes unless verified.

#### 2. The Verification Fee
Victims are instructed to make a "temporary refundable transfer" to a "secure testing server" to re-verify account credentials.

#### 3. Remote Tool Installation
Victims are urged to install remote desktop utilities under the pretext of having a technician run network diagnostic scripts.

---

### How to Stay Protected

- Always locate customer contact numbers on the back of your physical payment card or the official registered application.
- Never trust phone numbers displayed in sponsored search ads.
- Legitimate customer service agents will never ask you to install AnyDesk or TeamViewer to process an account inquiry.
    `,
    category: 'Cyber Fraud',
    author_name: 'Inspector Rajiv Shankar',
    author_role: 'Financial Cyber Fraud Division',
    reading_time_minutes: 6,
    tags: ['Customer Support Scams', 'Ad Poisoning', 'Social Engineering', 'Call Centers'],
    is_featured: false,
    view_count: 1980,
    published_at: '2026-09-28T12:00:00Z',
    created_at: '2026-09-28T12:00:00Z',
  },
];

export const SEED_CYBER_STATIONS: CyberStation[] = [
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    station_name: 'Special Cell Cyber Crime Police Station (IFSO)',
    jurisdiction: 'Delhi NCR & Interstate Cyber Crime Coordination',
    state: 'Delhi',
    address: 'IFSO Special Cell, Sector 16-C, Dwarka, New Delhi - 110078',
    helpline: '1930 / 011-20892633',
    officer_in_charge: 'DCP Hemant Tiwari, IPS',
    latitude: 28.5921,
    longitude: 77.0460,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    station_name: 'Mumbai Cyber Police Station (BKC)',
    jurisdiction: 'Mumbai Metropolitan Region & Financial Fraud Cell',
    state: 'Maharashtra',
    address: 'Bandra Kurla Complex, Opp. Asian Heart Hospital, Bandra East, Mumbai - 400051',
    helpline: '1930 / 022-26504008',
    officer_in_charge: 'DCP Purushottam Karad, IPS',
    latitude: 19.0662,
    longitude: 72.8687,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    station_name: 'CID Cyber Crime Police Station Bengaluru',
    jurisdiction: 'Bengaluru Urban & Karnataka State IT Corridor',
    state: 'Karnataka',
    address: 'CID HQ, Carlton House, Palace Road, Bengaluru, Karnataka - 560001',
    helpline: '1930 / 080-22094498',
    officer_in_charge: 'SP M. D. Sharath, IPS',
    latitude: 12.9815,
    longitude: 77.5885,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    station_name: 'Cyber Crime Police Station Hyderabad City',
    jurisdiction: 'Hyderabad Metropolitan & Cyberabad IT Cluster',
    state: 'Telangana',
    address: 'Police Commissionerate Complex, Basheerbagh, Hyderabad, Telangana - 500029',
    helpline: '1930 / 040-27852412',
    officer_in_charge: 'DCP D. Kavitha',
    latitude: 17.4022,
    longitude: 78.4767,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    station_name: 'Central Cyber Crime Investigation Cell Chennai',
    jurisdiction: 'Greater Chennai Police Commissionerate',
    state: 'Tamil Nadu',
    address: 'Commissioner Office Complex, EVK Sampath Road, Vepery, Chennai, Tamil Nadu - 600007',
    helpline: '1930 / 044-23452348',
    officer_in_charge: 'ACP S. Balamurugan',
    latitude: 13.0850,
    longitude: 80.2655,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a06',
    station_name: 'Lalbazar Cyber Crime Police Station Kolkata',
    jurisdiction: 'Kolkata Metropolitan Police Area',
    state: 'West Bengal',
    address: '18 Lalbazar Street, Police HQ, Kolkata, West Bengal - 700001',
    helpline: '1930 / 033-22143000',
    officer_in_charge: 'DC Pravin Tripathi, IPS',
    latitude: 22.5732,
    longitude: 88.3533,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a07',
    station_name: 'Ahmedabad City Cyber Crime Police Station',
    jurisdiction: 'Ahmedabad & Gujarat Financial Corridor',
    state: 'Gujarat',
    address: 'Old Police Commissioner Office, Shahibaug, Ahmedabad, Gujarat - 380004',
    helpline: '1930 / 079-25633650',
    officer_in_charge: 'ACP J. M. Yadav',
    latitude: 23.0569,
    longitude: 72.5991,
    is_24_7: true,
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a08',
    station_name: 'Uttar Pradesh Cyber Crime Police Station HQ',
    jurisdiction: 'Lucknow Zone & Uttar Pradesh State Nodal Cell',
    state: 'Uttar Pradesh',
    address: 'Cyber Crime HQ, Signature Building, Gomti Nagar Extension, Lucknow - 226010',
    helpline: '1930 / 0522-2200234',
    officer_in_charge: 'SP Cyber Cell Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    is_24_7: true,
  },
];
