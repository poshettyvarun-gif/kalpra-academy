import { isAdminRequest, isSameOrigin } from '@/lib/admin-auth';
import { allowedImageTypes, getUploadRoot } from '@/lib/media-storage';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOrigin(request) || !(await isAdminRequest(request))) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json(
      { error: 'Choose an image to upload.' },
      { status: 400 },
    );
  }
  const extension = allowedImageTypes.get(file.type);
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
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const directory = join(getUploadRoot(), 'cms');
  try {
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, filename),
      Buffer.from(await file.arrayBuffer()),
      {
        flag: 'wx',
      },
    );
  } catch (error) {
    return Response.json(
      {
        error: `Upload failed: ${error instanceof Error ? error.message : 'storage error'}`,
      },
      { status: 500 },
    );
  }
  return Response.json({ url: `/media/cms/${filename}` });
}
