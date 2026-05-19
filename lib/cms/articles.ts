import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import type { Article } from '@/lib/supabase/types';

// Normalize a row so callers can rely on `tags` being an array, `author`
// + `display_date` being strings, etc. This protects pages that read these
// fields against rows created before the columns were added (e.g. before
// the 0005/0006 migrations have been run on a given environment).
function normalize(a: Partial<Article> | null): Article | null {
  if (!a) return null;
  return {
    ...(a as Article),
    author: a.author ?? '',
    display_date: a.display_date ?? '',
    tags: Array.isArray(a.tags) ? a.tags : [],
  };
}

export async function listArticles(opts: { includeDrafts?: boolean } = {}): Promise<Article[]> {
  try {
    // Service client when we need drafts; public client respects RLS which
    // hides unpublished rows.
    const sb = opts.includeDrafts ? getServiceClient() : getPublicClient();
    const { data, error } = await sb
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => normalize(row) as Article);
  } catch (e) {
    console.error('listArticles failed', e);
    return [];
  }
}

export async function getArticle(id: string): Promise<Article | null> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb.from('articles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return normalize(data);
  } catch (e) {
    console.error('getArticle failed', e);
    return null;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const sb = getPublicClient();
    const { data, error } = await sb.from('articles').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return normalize(data);
  } catch (e) {
    console.error('getArticleBySlug failed', e);
    return null;
  }
}

export async function createArticle(input: Partial<Article>): Promise<Article> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('articles').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id: string, input: Partial<Article>): Promise<Article> {
  const sb = getServiceClient();
  const { data, error } = await sb.from('articles').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb.from('articles').delete().eq('id', id);
  if (error) throw error;
}
