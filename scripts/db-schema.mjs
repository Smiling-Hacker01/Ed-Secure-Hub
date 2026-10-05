#!/usr/bin/env node
/** Apply the idempotent PostgreSQL schema and compatibility migrations. */
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

let connectionString = process.env.DATABASE_URL;
const ca = process.env.DATABASE_SSL_CA_BASE64;
const ssl = ca ? { ca: Buffer.from(ca, 'base64').toString('utf8'), rejectUnauthorized: true } : undefined;
if (ssl) {
  const url = new URL(connectionString);
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) url.searchParams.delete(key);
  connectionString = url.toString();
}

const sql = fs.readFileSync(path.resolve(process.cwd(), 'database', 'schema.sql'), 'utf8');
const pool = new Pool({ connectionString, ssl, max: 1 });
try {
  await pool.query(sql);
  console.log('PostgreSQL schema applied successfully.');
} finally {
  await pool.end();
}
