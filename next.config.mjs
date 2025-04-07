/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      }
    ],
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
