#!/usr/bin/env node
/**
 * Creates or refreshes authority accounts from environment variables.
 * Set OFFICER_* and DIRECTOR_* values in .env.local before running.
 * Uses DATABASE_URL when set; otherwise it updates the local .data store.
 */

import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    process.env[match[1]] = value;
  }
}

const required = [
  'OFFICER_EMAIL', 'OFFICER_PASSWORD', 'OFFICER_NAME', 'OFFICER_BADGE', 'OFFICER_DEPT',
  'DIRECTOR_EMAIL', 'DIRECTOR_PASSWORD', 'DIRECTOR_NAME', 'DIRECTOR_BADGE', 'DIRECTOR_DEPT',
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required account settings: ${missing.join(', ')}`);
  process.exit(1);
}

const accounts = [
  {
    email: process.env.OFFICER_EMAIL.trim().toLowerCase(),
    password: process.env.OFFICER_PASSWORD,
    full_name: process.env.OFFICER_NAME,
    badge_number: process.env.OFFICER_BADGE,
    department: process.env.OFFICER_DEPT,
    role: 'AUTHORITY',
  },
  {
    email: process.env.DIRECTOR_EMAIL.trim().toLowerCase(),
    password: process.env.DIRECTOR_PASSWORD,
    full_name: process.env.DIRECTOR_NAME,
    badge_number: process.env.DIRECTOR_BADGE,
    department: process.env.DIRECTOR_DEPT,
    role: 'ADMIN',
  },
];

if (process.env.DATABASE_URL) {
  const ca = process.env.DATABASE_SSL_CA_BASE64;
  let connectionString = process.env.DATABASE_URL;
  const ssl = ca
    ? { ca: Buffer.from(ca, 'base64').toString('utf8'), rejectUnauthorized: true }
    : undefined;
  if (ssl) {
    const parsedUrl = new URL(connectionString);
    parsedUrl.searchParams.delete('sslmode');
    parsedUrl.searchParams.delete('sslrootcert');
    parsedUrl.searchParams.delete('sslcert');
    parsedUrl.searchParams.delete('sslkey');
    connectionString = parsedUrl.toString();
  }
  const pool = new Pool({ connectionString, ssl, max: 1 });
  try {
    for (const account of accounts) {
      const passwordHash = await bcrypt.hash(account.password, 10);
      await pool.query(
        `INSERT INTO users (
          email, password_hash, full_name, role, badge_number, department,
          is_active, mfa_enabled
        ) VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7)
        ON CONFLICT (email) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          full_name = EXCLUDED.full_name,
          role = EXCLUDED.role,
          badge_number = EXCLUDED.badge_number,
          department = EXCLUDED.department,
          is_active = TRUE,
          updated_at = CURRENT_TIMESTAMP`,
        [
          account.email,
          passwordHash,
          account.full_name,
          account.role,
          account.badge_number,
          account.department,
          account.role === 'ADMIN',
        ]
      );
      console.log(`Provisioned ${account.role} account ${account.email} in PostgreSQL.`);
    }
  } finally {
    await pool.end();
  }
} else {
  const dataFile = path.resolve(process.cwd(), '.data', 'edsecure_store.json');
  if (!fs.existsSync(dataFile)) {
    console.error('No DATABASE_URL is configured and .data/edsecure_store.json does not exist.');
    process.exit(1);
  }

  const store = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  for (const account of accounts) {
    const existing = store.users.find((user) => user.email.toLowerCase() === account.email);
    const now = new Date().toISOString();
    const user = {
      id: existing?.id || crypto.randomUUID(),
      email: account.email,
      password_hash: await bcrypt.hash(account.password, 10),
      full_name: account.full_name,
      phone: existing?.phone || '',
      role: account.role,
      badge_number: account.badge_number,
      department: account.department,
      is_active: true,
      mfa_enabled: account.role === 'ADMIN',
      created_at: existing?.created_at || now,
      updated_at: now,
    };
    if (existing) Object.assign(existing, user);
    else store.users.push(user);
    console.log(`Provisioned ${account.role} account ${account.email} in local storage.`);
  }
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
}
