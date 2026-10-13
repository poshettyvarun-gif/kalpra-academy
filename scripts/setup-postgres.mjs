import { readFile } from 'node:fs/promises';
import { getDatabase } from './postgres-config.mjs';

const sql = getDatabase();

try {
  const migration = await readFile(
    new URL('../postgres/migrations/001_cms.sql', import.meta.url),
    'utf8',
  );
  await sql.unsafe(migration);
  console.log('PostgreSQL CMS tables are ready.');
} finally {
  await sql.end();
}
