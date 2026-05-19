import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import type { CaseStudy } from '@/lib/supabase/types';

export async function listCaseStudies(): Promise<CaseStudy[]> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb
      .from('case_studies')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('listCaseStudies failed', e);
    return [];
  }
}

export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb.from('case_studies').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error('getCaseStudy failed', e);
    return null;
  }
}

export async function createCaseStudy(input: Partial<CaseStudy>): Promise<CaseStudy> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('case_studies').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCaseStudy(id: string, input: Partial<CaseStudy>): Promise<CaseStudy> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('case_studies').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCaseStudy(id: string): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb.from('case_studies').delete().eq('id', id);
  if (error) throw error;
}
