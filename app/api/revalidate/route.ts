import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// POST /api/revalidate?secret=…&path=/
// Allows out-of-band content updates (e.g. a Supabase webhook) to refresh
// a route. Server Actions already revalidate inline on save, so this is
// only needed when content changes outside the admin.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  const path = url.searchParams.get('path');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!path) {
    return NextResponse.json({ ok: false, error: 'Missing ?path' }, { status: 400 });
  }
  try {
    revalidatePath(path, 'page');
    return NextResponse.json({ ok: true, revalidated: path });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Failed' },
      { status: 500 }
    );
  }
}
