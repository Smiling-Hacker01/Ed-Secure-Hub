#!/usr/bin/env node
/**
 * setup-officers.mjs
 * -------------------
 * Creates real officer/director accounts from environment variables.
 * Run with: npm run setup:officers
 *
 * Required env vars (set in .env.local — NEVER commit real passwords to git):
 *   OFFICER_EMAIL, OFFICER_PASSWORD, OFFICER_NAME, OFFICER_BADGE, OFFICER_DEPT
 *   DIRECTOR_EMAIL, DIRECTOR_PASSWORD, DIRECTOR_NAME, DIRECTOR_BADGE, DIRECTOR_DEPT
 *
 * Falls back to defaults if env vars are not set (development only).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Load .env.local manually (Next.js doesn't load it for plain node scripts)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const DATA_DIR  = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'edsecure_store.json');

if (!fs.existsSync(DATA_FILE)) {
  console.error('❌  .data/edsecure_store.json not found. Start the dev server once first.');
  process.exit(1);
}

const store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

const officers = [
  {
    id:           'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    email:        process.env.OFFICER_EMAIL    || 'kushwahavishal311@gmail.com',
    password:     process.env.OFFICER_PASSWORD || 'Vishal@9918',
    full_name:    process.env.OFFICER_NAME     || 'Vishal Singh Kushwaha',
    badge_number: process.env.OFFICER_BADGE    || 'CC-7731',
    department:   process.env.OFFICER_DEPT     || 'Cyber Crime Investigation Unit',
    role:         'AUTHORITY',
  },
  {
    id:           'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    email:        process.env.DIRECTOR_EMAIL    || 'raghvendrasingh311@gmail.com',
    password:     process.env.DIRECTOR_PASSWORD || 'Raghvendra@9918',
    full_name:    process.env.DIRECTOR_NAME     || 'Raghvendra Singh Kushwaha',
    badge_number: process.env.DIRECTOR_BADGE    || 'DIR-311',
    department:   process.env.DIRECTOR_DEPT     || 'Cybercrime Directorate, Special Operations',
    role:         'ADMIN',
  },
];

let added = 0;
for (const o of officers) {
  const exists = store.users.find(u => u.email === o.email);
  if (exists) {
    console.log(`ℹ️  ${o.email} already exists — skipping.`);
    continue;
  }
  store.users.push({
    id:             o.id,
    email:          o.email,
    password_hash:  bcrypt.hashSync(o.password, 10),
    full_name:      o.full_name,
    phone:          '',
    role:           o.role,
    badge_number:   o.badge_number,
    department:     o.department,
    is_active:      true,
    mfa_enabled:    o.role === 'ADMIN',
    created_at:     new Date().toISOString(),
    updated_at:     new Date().toISOString(),
  });
  console.log(`✅  Created ${o.role}: ${o.full_name} <${o.email}> [${o.badge_number}]`);
  added++;
}

if (added > 0) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  console.log(`\n💾  Saved. Total users: ${store.users.length}`);
} else {
  console.log('\nNo changes made.');
}
