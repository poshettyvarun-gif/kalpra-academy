import { getUploadRoot } from '@/lib/media-storage';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

export const dynamic = 'force-dynamic';

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (
    !path.length ||
    path.some((part) => !/^[a-zA-Z0-9._-]+$/.test(part) || part.startsWith('.'))
  ) {
    return new Response('Not found', { status: 404 });
  }

  const extension = extname(path.at(-1) || '').toLowerCase();
  const contentType = contentTypes[extension];
  if (!contentType) return new Response('Not found', { status: 404 });

  try {
    const file = await readFile(join(getUploadRoot(), ...path));
    return new Response(file, {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=31536000, immutable',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
