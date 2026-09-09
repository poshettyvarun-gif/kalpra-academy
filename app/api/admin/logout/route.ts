import { adminCookieName, isSameOrigin } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  return Response.json(
    { ok: true },
    {
      headers: {
        'set-cookie': `${adminCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      },
    },
  );
}
