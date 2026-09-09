import { isAdminRequest, isSameOrigin } from '@/lib/admin-auth';
import { getCmsContent, saveCmsContent } from '@/lib/cms-server';
import { normalizeCmsContent } from '@/lib/cms-content';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return Response.json(await getCmsContent(), {
    headers: { 'cache-control': 'no-store' },
  });
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request) || !(await isAdminRequest(request))) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Invalid content.' }, { status: 400 });
  }
  const content = normalizeCmsContent(body);
  if (JSON.stringify(content).length > 1_000_000) {
    return Response.json({ error: 'Content is too large.' }, { status: 413 });
  }
  await saveCmsContent(content);
  return Response.json({ ok: true, content });
}
