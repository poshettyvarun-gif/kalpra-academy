import 'server-only';
import {
  defaultCmsContent,
  normalizeCmsContent,
  type CmsContent,
} from './cms-content';
import { getSupabaseAdmin } from './supabase-admin';

export async function getCmsContent(): Promise<CmsContent> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultCmsContent;
  const { data, error } = await supabase
    .from('cms_entries')
    .select('value')
    .eq('key', 'site_content')
    .maybeSingle();
  if (error) {
    console.error('Unable to load CMS content:', error.message);
    return defaultCmsContent;
  }
  return data ? normalizeCmsContent(data.value) : defaultCmsContent;
}

export async function saveCmsContent(content: CmsContent) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('cms_entries').upsert(
    {
      key: 'site_content',
      value: normalizeCmsContent(content),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' },
  );
  if (error) throw new Error(`Unable to save CMS content: ${error.message}`);
}

export async function recentFailedLogins(fingerprint: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('fingerprint', fingerprint)
    .eq('succeeded', false)
    .gt('attempted_at', cutoff);
  if (error) return 0;
  return count || 0;
}

export async function recordLogin(fingerprint: string, succeeded: boolean) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from('login_attempts').insert({ fingerprint, succeeded });
  await supabase
    .from('login_attempts')
    .delete()
    .lt('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
}
