import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const source = process.env.CMS_IMPORT_URL || 'https://kalpra-academy.kalpra-vfx.chatgpt.site/api/content';

if (!url || !secret) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.');
const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const response = await fetch(source);
if (!response.ok) throw new Error(`Could not read CMS content from ${source} (${response.status}).`);
const content = await response.json();
const sourceOrigin = new URL(source).origin;

async function migrateMedia(value) {
  if (typeof value !== 'string' || !value.startsWith('/media/')) return value;
  const mediaResponse = await fetch(new URL(value, sourceOrigin));
  if (!mediaResponse.ok) throw new Error(`Could not download ${value}.`);
  const type = mediaResponse.headers.get('content-type') || 'image/jpeg';
  const extension = type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const key = `cms/imported-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('cms-media').upload(key, await mediaResponse.arrayBuffer(), { contentType: type, cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from('cms-media').getPublicUrl(key).data.publicUrl;
}

content.hero.image = await migrateMedia(content.hero.image);
for (const service of content.services || []) service.image = await migrateMedia(service.image);
for (const partner of content.partners || []) partner.image = await migrateMedia(partner.image);
for (const course of content.courses || []) course.image = await migrateMedia(course.image);
content.gallery = await Promise.all((content.gallery || []).map(migrateMedia));

const { error } = await supabase.from('cms_entries').upsert({ key: 'site_content', value: content, updated_at: new Date().toISOString() });
if (error) throw error;
console.log('CMS content and uploaded media were migrated to Supabase.');
