'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { updateHomeContent } from '@/lib/cms/home';
import { uploadMedia } from '@/lib/cms/storage';
import { HomeSchema, type HomeFormValues } from '@/lib/schemas/home';
import type { HomeContent } from '@/lib/supabase/types';

// Every action runs this gate. The Clerk middleware already protects the
// /admin routes, but server actions can be invoked from anywhere, so we
// guard them explicitly too.
async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');
}

// ──────────────────────────────────────────────────────────────────────
// HOME PAGE editor
// ──────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function saveHomeAction(values: HomeFormValues): Promise<ActionResult<HomeContent>> {
  await requireAuth();

  const parsed = HomeSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join('.')] = issue.message;
    }
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }

  try {
    const saved = await updateHomeContent(parsed.data);
    revalidatePath('/', 'page');
    return { ok: true, data: saved };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

// ──────────────────────────────────────────────────────────────────────
// IMAGE upload — used by ImageUploader
// ──────────────────────────────────────────────────────────────────────

export type UploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; error: string };

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

export async function uploadAction(formData: FormData): Promise<UploadResult> {
  await requireAuth();
  const file = formData.get('file');
  const prefix = String(formData.get('prefix') || 'misc');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided' };
  if (!ACCEPTED.has(file.type)) return { ok: false, error: 'Unsupported file type' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'File too large (max 8 MB)' };
  try {
    const { url, path } = await uploadMedia({ file, prefix });
    return { ok: true, url, path };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Upload failed' };
  }
}
