import 'server-only';
import postgres, { type Sql } from 'postgres';

let client: Sql | null = null;

export function getPostgres() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  client ??= postgres(databaseUrl, {
    max: Number(process.env.DATABASE_POOL_SIZE || 5),
    connect_timeout: 10,
    idle_timeout: 20,
    ssl: process.env.DATABASE_SSL === 'true' ? 'require' : false,
  });

  return client;
}
