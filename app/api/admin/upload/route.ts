import { isAdminRequest, isSameOrigin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      { error: 'Supabase Storage is not configured.' },
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
  const key = `cms/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('cms-media').upload(key, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return Response.json(
      { error: `Upload failed: ${error.message}` },
      { status: 502 },
    );
  }
  const { data } = supabase.storage.from('cms-media').getPublicUrl(key);
  return Response.json({ url: data.publicUrl });
}
