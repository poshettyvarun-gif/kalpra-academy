import { getCmsContent } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await getCmsContent(), {
    headers: { 'cache-control': 'public, max-age=30' },
  });
}
