'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthUserId } from '@/lib/auth';
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '@/lib/cms/team';
import { TeamMemberSchema, type TeamMemberFormValues } from '@/lib/schemas/team';
import type { TeamMember } from '@/lib/supabase/types';
import type { ActionResult } from '@/app/admin/actions';

async function requireAuth() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
}

function revalidateRoutes() {
  revalidatePath('/team', 'page');
}

export async function saveTeamMemberAction(
  values: TeamMemberFormValues & { id?: string }
): Promise<ActionResult<TeamMember>> {
  await requireAuth();
  const { id, ...rest } = values;

  const parsed = TeamMemberSchema.safeParse(rest);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] = issue.message;
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }

  try {
    const saved = id
      ? await updateTeamMember(id, parsed.data)
      : await createTeamMember(parsed.data);
    revalidateRoutes();
    return { ok: true, data: saved };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteTeamMemberAction(id: string): Promise<void> {
  await requireAuth();
  await deleteTeamMember(id);
  revalidateRoutes();
  redirect('/admin/team');
}
