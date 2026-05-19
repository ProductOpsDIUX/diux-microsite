/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage public URLs
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // Server Actions are GA in Next 15 — config moved out of `experimental`.
  serverActions: { bodySizeLimit: '10mb' },
};
module.exports = nextConfig;
