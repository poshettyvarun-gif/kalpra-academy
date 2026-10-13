import 'server-only';
import {
  defaultCmsContent,
  normalizeCmsContent,
  type CmsContent,
} from './cms-content';
import { getPostgres } from './postgres';

export async function getCmsContent(): Promise<CmsContent> {
  const sql = getPostgres();
  if (!sql) return defaultCmsContent;
  try {
    const rows = await sql<{ value: unknown }[]>`
      select value from cms_entries where key = 'site_content' limit 1
    `;
    return rows[0] ? normalizeCmsContent(rows[0].value) : defaultCmsContent;
  } catch (error) {
    console.error(
      'Unable to load CMS content:',
      error instanceof Error ? error.message : error,
    );
    return defaultCmsContent;
  }
}

export async function saveCmsContent(content: CmsContent) {
  const sql = getPostgres();
  if (!sql) throw new Error('PostgreSQL is not configured.');
  const normalized = normalizeCmsContent(content);
  try {
    await sql`
      insert into cms_entries (key, value, updated_at)
      values ('site_content', ${sql.json(normalized)}, now())
      on conflict (key) do update
      set value = excluded.value, updated_at = excluded.updated_at
    `;
  } catch (error) {
    throw new Error(
      `Unable to save CMS content: ${error instanceof Error ? error.message : 'database error'}`,
    );
  }
}

export async function recentFailedLogins(fingerprint: string) {
  const sql = getPostgres();
  if (!sql) return 0;
  try {
    const rows = await sql<{ count: number }[]>`
      select count(*)::int as count
      from login_attempts
      where fingerprint = ${fingerprint}
        and succeeded = false
        and attempted_at > now() - interval '15 minutes'
    `;
    return rows[0]?.count || 0;
  } catch {
    return 0;
  }
}

export async function recordLogin(fingerprint: string, succeeded: boolean) {
  const sql = getPostgres();
  if (!sql) return;
  try {
    await sql`
      insert into login_attempts (fingerprint, succeeded)
      values (${fingerprint}, ${succeeded})
    `;
    await sql`
      delete from login_attempts
      where attempted_at < now() - interval '24 hours'
    `;
  } catch (error) {
    console.error(
      'Unable to record login attempt:',
      error instanceof Error ? error.message : error,
    );
  }
}
