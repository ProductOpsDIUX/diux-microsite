'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthUserId } from '@/lib/auth';
import {
  createResource,
  updateResource,
  deleteResource,
} from '@/lib/cms/resources';
import { ResourceSchema, type ResourceFormValues } from '@/lib/schemas/resource';
import type { Resource } from '@/lib/supabase/types';
import type { ActionResult } from '@/app/admin/actions';

async function requireAuth() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
}

function revalidateRoutes() {
  revalidatePath('/resources', 'page');
}

export async function saveResourceAction(
  values: ResourceFormValues & { id?: string }
): Promise<ActionResult<Resource>> {
  await requireAuth();
  const { id, ...rest } = values;

  const parsed = ResourceSchema.safeParse(rest);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] = issue.message;
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }

  try {
    const saved = id
      ? await updateResource(id, parsed.data)
      : await createResource(parsed.data);
    revalidateRoutes();
    return { ok: true, data: saved };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteResourceAction(id: string): Promise<void> {
  await requireAuth();
  await deleteResource(id);
  revalidateRoutes();
  redirect('/admin/resources');
}
