// next.config.mjs

/** 
 * @type {import('next').NextConfig} 
 */
const nextConfig = {
  // إعدادات الصور
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev", // لخدمة Edgestore
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // لصور Clerk
      },
      {
        protocol: "https",
        hostname: "**.example.com", // السماح بمصادر خارجية إضافية
      }
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400, // 24 ساعة
  },

  // إعدادات الأمان
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.edgestore.dev img.clerk.com;"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          }
        ]
      }
    ]
  },

  // إعدادات Prisma و MongoDB
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [
      "@prisma/client", 
      "prisma",
      "mongodb"
    ],
    optimizeCss: true,
  },

  // إعدادات Webpack
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "mongodb-client-encryption": false,
      "aws4": false,
      "snappy": false,
      "bson-ext": false,
      "kerberos": false
    }
    return config
  },

  // إعدادات عامة
  reactStrictMode: true,
  trailingSlash: true,
  output: "standalone", // مهم لاستضافة Vercel
  productionBrowserSourceMaps: true,

  // إعدادات البيئة
  env: {
    EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
    EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
  },

  // إعدادات Middleware
  middleware: {
    paths: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
  }
}

export default nextConfig