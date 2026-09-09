import {
  adminCookieName,
  createAdminToken,
  isSameOrigin,
  verifyAdminCredentials,
} from '@/lib/admin-auth';
import { recentFailedLogins, recordLogin } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

async function fingerprint(request: Request) {
  const value = `${request.headers.get('cf-connecting-ip') || 'local'}:${request.headers.get('user-agent') || 'unknown'}`;
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  const identity = await fingerprint(request);
  if ((await recentFailedLogins(identity)) >= 5) {
    return Response.json(
      { error: 'Too many attempts. Please try again in 15 minutes.' },
      { status: 429 },
    );
  }
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;
  const username = body?.username?.trim() || '';
  const password = body?.password || '';
  const valid = await verifyAdminCredentials(username, password);
  await recordLogin(identity, valid);
  if (!valid) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return Response.json(
      { error: 'Invalid username or password.' },
      { status: 401 },
    );
  }
  const token = await createAdminToken(username);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return Response.json(
    { ok: true },
    {
      headers: {
        'set-cookie': `${adminCookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure}`,
      },
    },
  );
}
