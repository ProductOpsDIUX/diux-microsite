'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthUserId } from '@/lib/auth';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
} from '@/lib/cms/articles';
import { ArticleSchema, type ArticleFormValues } from '@/lib/schemas/article';
import type { Article } from '@/lib/supabase/types';
import type { ActionResult } from '@/app/admin/actions';

async function requireAuth() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
}

function revalidateArticleRoutes(slug?: string) {
  revalidatePath('/article', 'page');
  revalidatePath('/', 'page'); // home may surface latest articles
  if (slug) revalidatePath(`/article/${slug}`, 'page');
}

// Surface duplicate-slug errors to the form rather than throwing a 500.
function mapPgError(e: unknown): { ok: false; error: string; fieldErrors?: Record<string, string> } {
  const msg = e instanceof Error ? e.message : 'Save failed';
  if (msg.includes('articles_slug_key') || msg.toLowerCase().includes('duplicate')) {
    return {
      ok: false,
      error: 'Slug is already taken.',
      fieldErrors: { slug: 'That slug is already in use.' },
    };
  }
  return { ok: false, error: msg };
}

export async function saveArticleAction(
  values: ArticleFormValues & { id?: string }
): Promise<ActionResult<Article>> {
  await requireAuth();
  const { id, ...rest } = values;

  const parsed = ArticleSchema.safeParse(rest);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] = issue.message;
    return { ok: false, error: 'Some fields are invalid.', fieldErrors };
  }

  // Stamp published_at when transitioning to published for the first time.
  const payload: Partial<Article> = { ...parsed.data };
  if (parsed.data.is_published) {
    const existing = id ? await getArticle(id) : null;
    if (!existing?.published_at) payload.published_at = new Date().toISOString();
  } else {
    payload.published_at = null;
  }

  try {
    const saved = id
      ? await updateArticle(id, payload)
      : await createArticle(payload);
    revalidateArticleRoutes(saved.slug);
    return { ok: true, data: saved };
  } catch (e) {
    return mapPgError(e);
  }
}

export async function deleteArticleAction(id: string): Promise<void> {
  await requireAuth();
  const existing = await getArticle(id);
  await deleteArticle(id);
  revalidateArticleRoutes(existing?.slug);
  redirect('/admin/articles');
}
