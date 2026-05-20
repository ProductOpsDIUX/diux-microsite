'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthUserId } from '@/lib/auth';
import { createHiringRole, updateHiringRole, deleteHiringRole } from '@/lib/cms/hiring';
import { HiringRoleSchema, type HiringRoleFormValues } from '@/lib/schemas/hiring';
import type { HiringRole } from '@/lib/supabase/types';
import type { ActionResult } from '@/app/admin/actions';

async function requireAuth() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
}

function revalidateRoutes() {
  revalidatePath('/contact', 'page');
}

export async function saveHiringRoleAction(
  values: HiringRoleFormValues & { id?: string },
): Promise<ActionResult<HiringRole>> {
  await requireAuth();
  const { id, ...rest } = values;

  const parsed = HiringRoleSchema.safeParse(rest);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] = issue.message;
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }

  try {
    const saved = id
      ? await updateHiringRole(id, parsed.data)
      : await createHiringRole(parsed.data);
    revalidateRoutes();
    return { ok: true, data: saved };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteHiringRoleAction(id: string): Promise<void> {
  await requireAuth();
  await deleteHiringRole(id);
  revalidateRoutes();
  redirect('/admin/hiring');
}
