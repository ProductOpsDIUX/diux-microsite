/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage public URLs
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // bodySizeLimit lets ImageUploader send files up to 8 MB through Server
  // Actions. Stays under `experimental` in Next 15 (the feature itself is
  // GA, but the tuning knob is still scoped there).
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};
module.exports = nextConfig;
