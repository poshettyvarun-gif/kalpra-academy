import { env } from 'cloudflare:workers';
import {
  defaultCmsContent,
  normalizeCmsContent,
  type CmsContent,
} from './cms-content';

type CmsEnv = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
};

export function getCmsEnv(): CmsEnv {
  return env as unknown as CmsEnv;
}

export async function getCmsContent(): Promise<CmsContent> {
  const database = getCmsEnv().DB;
  if (!database) return defaultCmsContent;
  try {
    const row = await database
      .prepare('SELECT value FROM cms_entries WHERE key = ?')
      .bind('site_content')
      .first<{ value: string }>();
    return row ? normalizeCmsContent(JSON.parse(row.value)) : defaultCmsContent;
  } catch {
    return defaultCmsContent;
  }
}

export async function saveCmsContent(content: CmsContent) {
  const database = getCmsEnv().DB;
  if (!database) throw new Error('CMS database is unavailable.');
  await database
    .prepare(
      `INSERT INTO cms_entries (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .bind(
      'site_content',
      JSON.stringify(normalizeCmsContent(content)),
      Date.now(),
    )
    .run();
}

export async function recentFailedLogins(fingerprint: string) {
  const database = getCmsEnv().DB;
  if (!database) return 0;
  const cutoff = Date.now() - 15 * 60 * 1000;
  const row = await database
    .prepare(
      `SELECT COUNT(*) AS count FROM login_attempts
       WHERE fingerprint = ? AND attempted_at > ? AND succeeded = 0`,
    )
    .bind(fingerprint, cutoff)
    .first<{ count: number }>();
  return Number(row?.count || 0);
}

export async function recordLogin(fingerprint: string, succeeded: boolean) {
  const database = getCmsEnv().DB;
  if (!database) return;
  await database.batch([
    database
      .prepare(
        'INSERT INTO login_attempts (fingerprint, attempted_at, succeeded) VALUES (?, ?, ?)',
      )
      .bind(fingerprint, Date.now(), succeeded ? 1 : 0),
    database
      .prepare('DELETE FROM login_attempts WHERE attempted_at < ?')
      .bind(Date.now() - 24 * 60 * 60 * 1000),
  ]);
}
