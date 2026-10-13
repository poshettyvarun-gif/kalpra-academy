import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getDatabase } from './postgres-config.mjs';

const sql = getDatabase();

try {
  const tables = await sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('cms_entries', 'login_attempts')
    order by table_name
  `;
  if (tables.length !== 2) throw new Error('CMS tables are missing.');

  const entries = await sql`
    select key from cms_entries where key = 'site_content'
  `;
  if (entries.length !== 1) throw new Error('CMS content has not been seeded.');

  await access(resolve(process.cwd(), process.env.UPLOAD_DIR || 'var/uploads'));
  console.log('PostgreSQL CMS database and local media storage are ready.');
} finally {
  await sql.end();
}
