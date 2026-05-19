'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUserId } from '@/lib/auth';
import { upsertPageSeo } from '@/lib/cms/seo';
import { PageSeoSchema, type PageSeoFormValues } from '@/lib/schemas/seo';
import type { PageSeo } from '@/lib/supabase/types';
import type { ActionResult } from '@/app/admin/actions';

async function requireAuth() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
}

export async function saveSeoAction(values: PageSeoFormValues): Promise<ActionResult<PageSeo>> {
  await requireAuth();
  const parsed = PageSeoSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] = issue.message;
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }
  try {
    const saved = await upsertPageSeo(parsed.data);
    // SEO is read by every route's generateMetadata; revalidate the path
    // whose meta just changed so the next view picks up the new title etc.
    revalidatePath(parsed.data.path, 'page');
    return { ok: true, data: saved };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}
