/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage public URLs
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
    // Run middleware on Node.js instead of Edge. Required because Clerk's
    // middleware pulls in @clerk/shared/* modules + #crypto + #safe-node-apis
    // that aren't available in Vercel's Edge runtime.
    nodeMiddleware: true,
  },
};
module.exports = nextConfig;
