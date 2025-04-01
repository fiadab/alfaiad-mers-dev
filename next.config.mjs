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
  webpack: (config, { isServer }) => {
    // إصلاح مشكلة HandleBars لعمليات البناء
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        handlebars: false
      };
    }

    // تجاهل ملفات Handlebars غير الضرورية
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/handlebars/,
      use: 'null-loader'
    });

    return config;
  }
};

export default nextConfig;