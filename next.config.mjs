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
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.trusted-scripts.com *.clerk.com *.clerk.dev *.clerk.accounts.dev; " +
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
              "img-src 'self' data: *.edgestore.dev img.clerk.com res.cloudinary.com; " +
              "font-src 'self' fonts.gstatic.com; " +
              "connect-src 'self' https://api.clerk.com https://clerk.dev https://files.edgestore.dev http://localhost:3000; " +
              "frame-src 'self' *.clerk.com *.clerk.dev *.clerk.accounts.dev; " +
              "worker-src 'self' blob:;"
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
    optimizeCss: true,
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "mongodb-client-encryption": false,
      aws4: false,
      snappy: false,
      "bson-ext": false,
      kerberos: false,
    };

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 256000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      };
    }

    return config;
  },

  reactStrictMode: true,
  trailingSlash: false,
  output: "standalone",
  productionBrowserSourceMaps: false,

  env: {
    EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
    EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },

  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
