import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import type { TeamMember } from '@/lib/supabase/types';

export async function listTeam(): Promise<TeamMember[]> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb
      .from('team_members')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('listTeam failed', e);
    return [];
  }
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb.from('team_members').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error('getTeamMember failed', e);
    return null;
  }
}

export async function createTeamMember(input: Partial<TeamMember>): Promise<TeamMember> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('team_members').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateTeamMember(id: string, input: Partial<TeamMember>): Promise<TeamMember> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('team_members').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb.from('team_members').delete().eq('id', id);
  if (error) throw error;
}
