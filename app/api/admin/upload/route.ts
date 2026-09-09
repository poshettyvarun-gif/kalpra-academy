import { isAdminRequest, isSameOrigin } from '@/lib/admin-auth';
import { getCmsEnv } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
]);

export async function POST(request: Request) {
  if (!isSameOrigin(request) || !(await isAdminRequest(request))) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const bucket = getCmsEnv().MEDIA;
  if (!bucket) {
    return Response.json(
      { error: 'Media storage is unavailable.' },
      { status: 503 },
    );
  }
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json(
      { error: 'Choose an image to upload.' },
      { status: 400 },
    );
  }
  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return Response.json(
      { error: 'Use a JPG, PNG, WebP or AVIF image.' },
      { status: 415 },
    );
  }
  if (file.size > 6 * 1024 * 1024) {
    return Response.json(
      { error: 'Images must be under 6 MB.' },
      { status: 413 },
    );
  }
  const key = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name.slice(0, 180) },
  });
  return Response.json({ url: `/media/${key}` });
}
