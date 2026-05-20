import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import type { HiringRole } from '@/lib/supabase/types';

export async function listOpenHiringRoles(): Promise<HiringRole[]> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb
      .from('hiring_roles')
      .select('*')
      .eq('is_open', true)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('listOpenHiringRoles failed', e);
    return [];
  }
}

export async function listAllHiringRoles(): Promise<HiringRole[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from('hiring_roles')
      .select('*')
      .order('is_open', { ascending: false })
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('listAllHiringRoles failed', e);
    return [];
  }
}

export async function getHiringRole(id: string): Promise<HiringRole | null> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb.from('hiring_roles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error('getHiringRole failed', e);
    return null;
  }
}

export async function createHiringRole(input: Partial<HiringRole>): Promise<HiringRole> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('hiring_roles').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateHiringRole(id: string, input: Partial<HiringRole>): Promise<HiringRole> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('hiring_roles').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteHiringRole(id: string): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb.from('hiring_roles').delete().eq('id', id);
  if (error) throw error;
}
