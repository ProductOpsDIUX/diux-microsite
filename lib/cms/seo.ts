import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import type { PageSeo } from '@/lib/supabase/types';

export async function getPageSeo(path: string): Promise<PageSeo | null> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb.from('page_seo').select('*').eq('path', path).maybeSingle();
    if (error) {
      console.error('page_seo read failed', path, error);
      return null;
    }
    return data ?? null;
  } catch (e) {
    console.error('page_seo fetch skipped', e);
    return null;
  }
}

export async function listPageSeo(): Promise<PageSeo[]> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb.from('page_seo').select('*').order('path');
    if (error) {
      console.error('page_seo list failed', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('page_seo list skipped', e);
    return [];
  }
}

export async function upsertPageSeo(seo: Partial<PageSeo> & { path: string }): Promise<PageSeo> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('page_seo').upsert(seo).select().single();
  if (error) throw error;
  return data;
}
