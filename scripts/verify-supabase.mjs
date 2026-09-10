import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secret) throw new Error('Supabase environment variables are missing.');

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data, error } = await supabase
  .from('cms_entries')
  .select('key, updated_at')
  .eq('key', 'site_content')
  .single();
if (error || !data) throw new Error(`CMS database check failed: ${error?.message || 'missing site_content'}`);

const path = `cms/connection-test-${crypto.randomUUID()}.png`;
const pixel = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAFAgIACwL9WQAAAABJRU5ErkJggg==', 'base64'));
const { error: uploadError } = await supabase.storage
  .from('cms-media')
  .upload(path, pixel, { contentType: 'image/png', upsert: false });
if (uploadError) throw new Error(`Storage upload check failed: ${uploadError.message}`);
const { error: cleanupError } = await supabase.storage.from('cms-media').remove([path]);
if (cleanupError) throw new Error(`Storage cleanup check failed: ${cleanupError.message}`);

const baseUrl = process.env.E2E_BASE_URL;
if (baseUrl) {
  const check = async (pathname, expected = 200, options) => {
    const response = await fetch(new URL(pathname, baseUrl), options);
    if (response.status !== expected) {
      throw new Error(`${pathname} returned ${response.status}; expected ${expected}.`);
    }
    return response;
  };
  const publicContent = await (await check('/api/content')).json();
  if (!Array.isArray(publicContent.courses) || !publicContent.courses.length) {
    throw new Error('The public CMS API did not return courses.');
  }
  await check('/');
  await check('/admin');
  await check(`/${encodeURIComponent(publicContent.courses[0].slug)}`);
  await check('/api/admin/content', 401);

  const username = process.env.ADMIN_USERNAME;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !sessionSecret) throw new Error('Admin environment variables are missing.');
  const payload = `${username}.${Date.now() + 5 * 60 * 1000}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = Array.from(
    new Uint8Array(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)),
    ),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
  const headers = {
    cookie: `kalpra_admin=${encodeURIComponent(`${payload}.${signature}`)}`,
  };
  const adminContent = await (
    await check('/api/admin/content', 200, { headers })
  ).json();
  await check('/api/admin/content', 200, {
    method: 'PUT',
    headers: {
      ...headers,
      origin: new URL(baseUrl).origin,
      'content-type': 'application/json',
    },
    body: JSON.stringify(adminContent),
  });

  const form = new FormData();
  form.set('file', new File([pixel], 'connection-test.png', { type: 'image/png' }));
  const upload = await (
    await check('/api/admin/upload', 200, {
      method: 'POST',
      headers: { ...headers, origin: new URL(baseUrl).origin },
      body: form,
    })
  ).json();
  const marker = '/storage/v1/object/public/cms-media/';
  const uploadedPath = decodeURIComponent(new URL(upload.url).pathname.split(marker)[1] || '');
  if (!uploadedPath) throw new Error('The upload route returned an invalid media URL.');
  const { error: routeCleanupError } = await supabase.storage
    .from('cms-media')
    .remove([uploadedPath]);
  if (routeCleanupError) throw new Error(`Route upload cleanup failed: ${routeCleanupError.message}`);
}

console.log(
  baseUrl
    ? 'Website, CMS API, publishing, access control and image storage passed.'
    : 'Supabase CMS database and image storage are connected.',
);
