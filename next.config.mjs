/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "files.edgestore.dev" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
  },

  async headers() {
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.com *.clerk.dev *.clerk.accounts.dev",
          "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
          "img-src 'self' data: blob: *.edgestore.dev img.clerk.com",
          "font-src 'self' fonts.gstatic.com",
          "connect-src 'self' https://api.clerk.com *.clerk.accounts.dev https://files.edgestore.dev",
          "frame-src 'self' *.clerk.com *.clerk.dev *.clerk.accounts.dev",
          "worker-src 'self' blob:"
        ].join("; ")
      },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    return [{ source: "/:path*", headers: securityHeaders }];
  },

  experimental: {
    serverComponentsExternalPackages: ["prisma"],
    optimizeCss: true,
    optimizePackageImports: ['@clerk/nextjs', '@prisma/client', 'lodash'],
  },

  webpack(config) {
    config.resolve.fallback = { 
      "mongodb-client-encryption": false,
      aws4: false,
      snappy: false
    };
    return config;
  },

  reactStrictMode: true,
  output: "standalone",
  compress: true,
};

export default nextConfig;