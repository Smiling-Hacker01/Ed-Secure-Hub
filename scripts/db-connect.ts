import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Simple .env reader
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const val = values.join('=').trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://edsecure_admin:EdSecure_Postgres_Password_2026@localhost:5432/edsecure_db?sslmode=disable';

console.log('----------------------------------------------------');
console.log('EdSecure Hub - Database Connection Diagnostic Tool');
console.log('----------------------------------------------------');
console.log(`Connecting to: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);

const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 5000,
});

async function main() {
  try {
    const client = await pool.connect();
    console.log('✅ Connection to PostgreSQL succeeded!');

    const dbRes = await client.query('SELECT current_database() as db, version() as ver');
    console.log(`📦 Database: ${dbRes.rows[0].db}`);
    console.log(`⚙️  Version:  ${dbRes.rows[0].ver.split(' on ')[0]}`);

    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n📋 Found ${tablesRes.rows.length} public tables:`);
    for (const row of tablesRes.rows) {
      console.log(`   - ${row.table_name}`);
    }

    if (tablesRes.rows.length === 0) {
      console.log('\n⚠️ No tables found. Initializing schema from database/schema.sql...');
      const schemaSql = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf-8');
      await client.query(schemaSql);
      console.log('✅ database/schema.sql applied.');

      if (fs.existsSync(path.join(process.cwd(), 'database/seeds.sql'))) {
        console.log('🌱 Applying database/seeds.sql...');
        const seedsSql = fs.readFileSync(path.join(process.cwd(), 'database/seeds.sql'), 'utf-8');
        await client.query(seedsSql);
        console.log('✅ Seeds successfully applied.');
      }
    } else {
      // Show record counts
      try {
        const userCount = await client.query('SELECT count(*) FROM users');
        const complaintCount = await client.query('SELECT count(*) FROM complaints');
        console.log(`\n📊 Record counts in database:`);
        console.log(`   - Users:      ${userCount.rows[0].count}`);
        console.log(`   - Complaints: ${complaintCount.rows[0].count}`);
      } catch {}
    }

    client.release();
    await pool.end();
    console.log('\n✨ Database diagnostic complete. Everything is operational.');
  } catch (err: unknown) {
    console.error('\n❌ Could not connect to PostgreSQL:');
    console.error(`   ${err instanceof Error ? err.message : String(err)}`);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('   1. Check if the Docker container is running: `docker ps`');
    console.log('   2. Start it using: `docker compose up -d postgres`');
    console.log('   3. If port 5432 is already used by another project, use port 5433.');
    await pool.end();
  }
}

main();
