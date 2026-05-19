import 'server-only';
import { getServiceClient, STORAGE_BUCKET } from '@/lib/supabase/server';

// Upload a single file to the public media bucket. Returns the public URL.
// Caller controls the prefix (e.g. 'hero', 'articles/<slug>') so files are
// organized predictably.
export async function uploadMedia(opts: {
  file: File;
  prefix: string;
}): Promise<{ url: string; path: string }> {
  const sb = getServiceClient();
  const safeName = opts.file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const path = `${opts.prefix.replace(/^\/+|\/+$/g, '')}/${Date.now()}-${safeName}`;
  const { error } = await sb.storage
    .from(STORAGE_BUCKET)
    .upload(path, opts.file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: opts.file.type || 'application/octet-stream',
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteMedia(path: string): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
