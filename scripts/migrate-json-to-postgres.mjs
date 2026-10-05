#!/usr/bin/env node
/** Import the existing local JSON store into PostgreSQL without overwriting rows. */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required.');
  process.exit(1);
}

const dataPath = path.resolve(process.cwd(), '.data', 'edsecure_store.json');
if (!fs.existsSync(dataPath)) {
  console.error('No .data/edsecure_store.json was found; there is nothing to migrate.');
  process.exit(1);
}

let connectionString = process.env.DATABASE_URL;
const ca = process.env.DATABASE_SSL_CA_BASE64;
const ssl = ca ? { ca: Buffer.from(ca, 'base64').toString('utf8'), rejectUnauthorized: true } : undefined;
if (ssl) {
  const url = new URL(connectionString);
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) url.searchParams.delete(key);
  connectionString = url.toString();
}

const store = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const pool = new Pool({ connectionString, ssl, max: 1 });
const client = await pool.connect();

const tables = {
  users: ['id', 'email', 'password_hash', 'full_name', 'phone', 'role', 'badge_number', 'department', 'is_active', 'mfa_enabled', 'mfa_secret', 'last_login_at', 'created_at', 'updated_at'],
  complaints: ['id', 'reference_id', 'user_id', 'tracking_pin_hash', 'incident_type', 'incident_date', 'platform_service', 'description', 'financial_loss', 'currency', 'suspect_contact', 'suspect_identifier', 'victim_name', 'victim_email', 'victim_phone', 'victim_state', 'victim_city', 'is_anonymous', 'status', 'priority', 'assigned_to', 'assigned_officer_name', 'assigned_at', 'resolution_summary', 'closed_at', 'created_at', 'updated_at'],
  evidence: ['id', 'complaint_id', 'file_name', 'original_name', 'mime_type', 'size_bytes', 'storage_path', 'sha256_hash', 'uploaded_by', 'notes', 'is_verified', 'signed_url', 'file_data', 'created_at'],
  complaint_status_history: ['id', 'complaint_id', 'previous_status', 'new_status', 'changed_by', 'changed_by_name', 'change_reason', 'is_public', 'created_at'],
  internal_notes: ['id', 'complaint_id', 'author_id', 'author_name', 'author_badge', 'note', 'visibility', 'created_at'],
  audit_events: ['id', 'entity_type', 'entity_id', 'actor_id', 'actor_name', 'actor_role', 'action', 'old_state', 'new_state', 'ip_address', 'user_agent', 'created_at'],
  blog_posts: ['id', 'slug', 'title', 'summary', 'content', 'category', 'author_name', 'author_role', 'reading_time_minutes', 'tags', 'is_featured', 'view_count', 'published_at', 'created_at'],
  cyber_stations: ['id', 'station_name', 'jurisdiction', 'state', 'address', 'helpline', 'officer_in_charge', 'latitude', 'longitude', 'is_24_7'],
  notifications: ['id', 'user_id', 'complaint_id', 'title', 'message', 'type', 'is_read', 'created_at'],
};

const nullable = (value) => value === undefined ? null : value;
const asBuffer = (value) => {
  if (Buffer.isBuffer(value)) return value;
  if (value?.type === 'Buffer' && Array.isArray(value.data)) return Buffer.from(value.data);
  return null;
};
const userIdMap = new Map();
const complaintIdMap = new Map();
const historyIdMap = new Map();
const noteIdMap = new Map();
const normalize = {
  users: (r) => ({ ...r, id: userIdMap.get(r.id) || r.id, email: r.email.toLowerCase(), phone: nullable(r.phone), badge_number: nullable(r.badge_number), department: nullable(r.department), mfa_enabled: Boolean(r.mfa_enabled) }),
  complaints: (r) => ({ ...r, user_id: userIdMap.get(r.user_id) || null, assigned_to: userIdMap.get(r.assigned_to) || null, assigned_officer_name: nullable(r.assigned_officer_name), assigned_at: nullable(r.assigned_at), resolution_summary: nullable(r.resolution_summary), closed_at: nullable(r.closed_at), suspect_contact: nullable(r.suspect_contact), suspect_identifier: nullable(r.suspect_identifier), victim_state: nullable(r.victim_state), victim_city: nullable(r.victim_city) }),
  evidence: (r) => ({ ...r, complaint_id: complaintIdMap.get(r.complaint_id) || r.complaint_id, uploaded_by: userIdMap.get(r.uploaded_by) || null, notes: nullable(r.notes), signed_url: nullable(r.signed_url), file_data: asBuffer(r.file_data) }),
  complaint_status_history: (r) => ({ id: historyIdMap.get(r.id) || r.id, complaint_id: complaintIdMap.get(r.complaint_id) || r.complaint_id, previous_status: nullable(r.previous_status), new_status: r.new_status, changed_by: userIdMap.get(r.changed_by_id) || null, changed_by_name: nullable(r.changed_by_name), change_reason: nullable(r.change_reason), is_public: r.is_public, created_at: r.created_at }),
  internal_notes: (r) => ({ ...r, id: noteIdMap.get(r.id) || r.id, complaint_id: complaintIdMap.get(r.complaint_id) || r.complaint_id, author_id: userIdMap.get(r.author_id) || null, author_name: nullable(r.author_name), author_badge: nullable(r.author_badge) }),
  audit_events: (r) => ({ ...r, entity_id: r.entity_type === 'COMPLAINT' ? (complaintIdMap.get(r.entity_id) || r.entity_id) : r.entity_id, actor_id: userIdMap.get(r.actor_id) || null, actor_name: nullable(r.actor_name), actor_role: nullable(r.actor_role), old_state: r.old_state ?? null, new_state: r.new_state ?? null, ip_address: nullable(r.ip_address), user_agent: nullable(r.user_agent) }),
  blog_posts: (r) => ({ ...r, tags: r.tags || [] }),
  cyber_stations: (r) => r,
  notifications: (r) => ({ ...r, user_id: userIdMap.get(r.user_id) || null, complaint_id: r.complaint_id ? (complaintIdMap.get(r.complaint_id) || r.complaint_id) : null }),
};
const sources = {
  users: store.users || [], complaints: store.complaints || [], evidence: store.evidence || [],
  complaint_status_history: store.statusHistory || [], internal_notes: store.internalNotes || [],
  audit_events: store.auditEvents || [], blog_posts: store.blogPosts || [],
  cyber_stations: store.cyberStations || [], notifications: store.notifications || [],
};

async function insertRows(table, rows) {
  const columns = tables[table];
  for (const source of rows) {
    const row = normalize[table](source);
    if ((table === 'internal_notes' && !row.author_id) ||
        (table === 'notifications' && !row.user_id)) continue;
    const values = columns.map((column) => nullable(row[column]));
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    await client.query(
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
      values
    );
  }
}

try {
  await client.query('BEGIN');
  const currentUsers = await client.query('SELECT id, email FROM users');
  const currentUsersByEmail = new Map(currentUsers.rows.map((row) => [String(row.email).toLowerCase(), String(row.id)]));
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  for (const user of sources.users) {
    userIdMap.set(user.id, currentUsersByEmail.get(String(user.email).toLowerCase()) || (uuidPattern.test(user.id) ? user.id : crypto.randomUUID()));
  }
  for (const row of sources.complaint_status_history) {
    if (!uuidPattern.test(row.id)) historyIdMap.set(row.id, crypto.randomUUID());
  }
  for (const row of sources.internal_notes) {
    if (!uuidPattern.test(row.id)) noteIdMap.set(row.id, crypto.randomUUID());
  }
  await insertRows('users', sources.users);
  const users = await client.query('SELECT id, email FROM users');
  const usersByEmail = new Map(users.rows.map((row) => [String(row.email).toLowerCase(), String(row.id)]));
  for (const user of sources.users) {
    const persistedId = usersByEmail.get(String(user.email).toLowerCase());
    if (persistedId) userIdMap.set(user.id, persistedId);
  }
  await insertRows('complaints', sources.complaints);
  const complaints = await client.query('SELECT id, reference_id FROM complaints');
  const complaintsByReference = new Map(complaints.rows.map((row) => [String(row.reference_id).toUpperCase(), String(row.id)]));
  for (const complaint of sources.complaints) {
    const persistedId = complaintsByReference.get(String(complaint.reference_id).toUpperCase());
    if (persistedId) complaintIdMap.set(complaint.id, persistedId);
  }
  const dependencyOrder = ['evidence', 'complaint_status_history', 'internal_notes', 'audit_events', 'blog_posts', 'cyber_stations', 'notifications'];
  for (const table of dependencyOrder) await insertRows(table, sources[table]);
  await client.query('COMMIT');
  console.log('Local records imported into PostgreSQL. Existing database rows were left unchanged.');
  for (const table of dependencyOrder) console.log(`${table}: ${sources[table].length} local row(s) considered`);
  console.log('Raw tracking PINs are intentionally not migrated; only their hashes are stored.');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
