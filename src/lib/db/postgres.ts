import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function getPostgresPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!pool) {
    const ca = process.env.DATABASE_SSL_CA_BASE64;
    let connectionString = url;
    const ssl = ca
      ? { ca: Buffer.from(ca, 'base64').toString('utf8'), rejectUnauthorized: true }
      : undefined;

    // When an explicit CA is provided, avoid connection-string SSL settings
    // replacing the TLS options supplied above.
    if (ssl) {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.delete('sslmode');
      parsedUrl.searchParams.delete('sslrootcert');
      parsedUrl.searchParams.delete('sslcert');
      parsedUrl.searchParams.delete('sslkey');
      connectionString = parsedUrl.toString();
    }

    pool = new Pool({
      connectionString,
      ssl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on PostgreSQL pool client:', err);
    });
  }

  return pool;
}

export async function queryPostgres<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T> | null> {
  const p = getPostgresPool();
  if (!p) return null;

  const client = await p.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

export async function withPostgresTransaction<T>(
  work: (client: PoolClient) => Promise<T>
): Promise<T> {
  const p = getPostgresPool();
  if (!p) throw new Error('DATABASE_URL is required for PostgreSQL transactions.');

  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function testPostgresConnection(): Promise<{
  ok: boolean;
  database?: string;
  timestamp?: string;
  tableCount?: number;
  message: string;
}> {
  const p = getPostgresPool();
  if (!p) {
    return {
      ok: false,
      message: 'DATABASE_URL is not configured in .env or environment variables.',
    };
  }

  try {
    const client = await p.connect();
    try {
      const dbInfo = await client.query(
        'SELECT current_database() as db_name, NOW() as current_time'
      );
      const tables = await client.query(
        "SELECT count(*) as count FROM information_schema.tables WHERE table_schema = 'public'"
      );

      return {
        ok: true,
        database: dbInfo.rows[0]?.db_name,
        timestamp: dbInfo.rows[0]?.current_time,
        tableCount: parseInt(tables.rows[0]?.count || '0', 10),
        message: `Successfully connected to PostgreSQL database '${dbInfo.rows[0]?.db_name}'. Found ${tables.rows[0]?.count} tables.`,
      };
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    return {
      ok: false,
      message: `Failed to connect to PostgreSQL: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
