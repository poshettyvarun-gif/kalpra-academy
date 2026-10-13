import postgres from 'postgres';

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');
  return postgres(databaseUrl, {
    max: 1,
    connect_timeout: 10,
    ssl: process.env.DATABASE_SSL === 'true' ? 'require' : false,
  });
}
