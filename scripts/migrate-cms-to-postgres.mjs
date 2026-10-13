import { getDatabase } from './postgres-config.mjs';

const source = process.env.SOURCE_SITE_URL?.replace(/\/$/, '');
if (!source) {
  throw new Error(
    'SOURCE_SITE_URL is required, for example https://kalpra-academy.vercel.app.',
  );
}

const response = await fetch(`${source}/api/content`);
if (!response.ok) {
  throw new Error(`Unable to read source CMS content (${response.status}).`);
}

const content = await response.json();
const sql = getDatabase();

try {
  await sql`
    insert into cms_entries (key, value, updated_at)
    values ('site_content', ${sql.json(content)}, now())
    on conflict (key) do update
    set value = excluded.value, updated_at = excluded.updated_at
  `;
  console.log('CMS content was migrated to PostgreSQL.');
} finally {
  await sql.end();
}
