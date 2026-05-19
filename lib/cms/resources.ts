import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import { deleteMedia } from '@/lib/cms/storage';
import type { Resource } from '@/lib/supabase/types';

export async function listResources(): Promise<Resource[]> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb
      .from('resources')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('listResources failed', e);
    return [];
  }
}

export async function getResource(id: string): Promise<Resource | null> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb.from('resources').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error('getResource failed', e);
    return null;
  }
}

export async function createResource(input: Partial<Resource>): Promise<Resource> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('resources').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateResource(id: string, input: Partial<Resource>): Promise<Resource> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('resources').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteResource(id: string): Promise<void> {
  const existing = await getResource(id);
  const sb = getServiceClient();
  const { error } = await sb.from('resources').delete().eq('id', id);
  if (error) throw error;
  // Best-effort: clean up the uploaded file if there was one.
  if (existing?.file_path) {
    try { await deleteMedia(existing.file_path); } catch (e) { console.warn('orphan file cleanup failed', e); }
  }
}
