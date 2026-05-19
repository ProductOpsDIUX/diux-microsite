import 'server-only';
import { cookies } from 'next/headers';
import { createClerkClient, verifyToken } from '@clerk/backend';

// We can't ship Clerk's middleware on Vercel (the bundle pulls in modules
// Vercel's Edge runtime rejects, and the experimental Node-runtime path
// fails to resolve Clerk's ESM imports at deploy time). Without middleware
// Clerk's auth() / currentUser() helpers throw, so this module reads the
// session cookie directly and verifies it via @clerk/backend — which is
// a transitive dep of @clerk/nextjs and Just Works in a Server Component.

const SECRET = process.env.CLERK_SECRET_KEY;
const clerk = SECRET
  ? createClerkClient({ secretKey: SECRET })
  : null;

async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  // Clerk v7 keeps the active session JWT in `__session`.
  return store.get('__session')?.value ?? null;
}

/** Returns the signed-in user's Clerk ID, or null. */
export async function getAuthUserId(): Promise<string | null> {
  if (!SECRET) return null;
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const payload = await verifyToken(token, { secretKey: SECRET });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/** Returns the full Clerk user object (with names, email), or null. */
export async function getAuthUser() {
  if (!clerk) return null;
  const userId = await getAuthUserId();
  if (!userId) return null;
  try {
    return await clerk.users.getUser(userId);
  } catch {
    return null;
  }
}
