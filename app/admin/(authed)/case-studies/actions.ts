'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthUserId } from '@/lib/auth';
import {
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getCaseStudy,
} from '@/lib/cms/case-studies';
import { CaseStudySchema, type CaseStudyFormValues } from '@/lib/schemas/case-study';
import type { CaseStudy } from '@/lib/supabase/types';
import type { ActionResult } from '@/app/admin/actions';

async function requireAuth() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
}

function revalidateRoutes(slug?: string) {
  revalidatePath('/case-study', 'page');
  revalidatePath('/', 'page');
  if (slug) revalidatePath(`/case-study/${slug}`, 'page');
}

function mapPgError(e: unknown): { ok: false; error: string; fieldErrors?: Record<string, string> } {
  const msg = e instanceof Error ? e.message : 'Save failed';
  if (msg.includes('case_studies_slug_key') || msg.toLowerCase().includes('duplicate')) {
    return {
      ok: false,
      error: 'Slug is already taken.',
      fieldErrors: { slug: 'That slug is already in use.' },
    };
  }
  return { ok: false, error: msg };
}

export async function saveCaseStudyAction(
  values: CaseStudyFormValues & { id?: string }
): Promise<ActionResult<CaseStudy>> {
  await requireAuth();
  const { id, ...rest } = values;

  const parsed = CaseStudySchema.safeParse(rest);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] = issue.message;
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }

  try {
    const saved = id
      ? await updateCaseStudy(id, parsed.data)
      : await createCaseStudy(parsed.data);
    revalidateRoutes(saved.slug);
    return { ok: true, data: saved };
  } catch (e) {
    return mapPgError(e);
  }
}

export async function deleteCaseStudyAction(id: string): Promise<void> {
  await requireAuth();
  const existing = await getCaseStudy(id);
  await deleteCaseStudy(id);
  revalidateRoutes(existing?.slug);
  redirect('/admin/case-studies');
}
