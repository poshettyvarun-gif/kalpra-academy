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

console.log('Supabase CMS database and image storage are connected.');
