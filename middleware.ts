import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Everything under /admin requires auth. The sign-in page itself is public
// so users can actually reach it.
const isProtected = createRouteMatcher(['/admin(.*)']);
const isPublicAdmin = createRouteMatcher(['/admin/sign-in(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req) && !isPublicAdmin(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except _next assets and common public files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
