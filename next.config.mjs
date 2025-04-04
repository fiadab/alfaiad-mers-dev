/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Image settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev", // For Edgestore service
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // For Clerk images
      },
      {
        protocol: "https",
        hostname: "**.example.com", // Allow additional external sources
      }
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Security headers
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.edgestore.dev img.clerk.com;",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  // Experimental features (serverActions are enabled by default now)
  experimental: {
    serverActions: true, // Remove this option if no longer needed, as serverActions are enabled by default
    serverComponentsExternalPackages: ["@prisma/client", "prisma", "mongodb"],
    optimizeCss: true,
  },

  // Webpack configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "mongodb-client-encryption": false,
      aws4: false,
      snappy: false,
      "bson-ext": false,
      kerberos: false,
    };
    return config;
  },

  // General settings
  reactStrictMode: true,
  trailingSlash: true,
  output: "standalone", // Important for Vercel hosting
  productionBrowserSourceMaps: true,

  // Environment variables
  env: {
    EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
    EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },

  // Note: Middleware settings have been removed from this config.
  // Next.js automatically applies middleware from the middleware file.
};

export default nextConfig;
