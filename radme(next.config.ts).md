Wo code jiski wajah se error aaya:

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance Optimizations
  reactStrictMode: true,
  
  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Power by header remove (security)
  poweredByHeader: false,

  // Headers for Security & Performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
      // Cache static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Experimental Features for Performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // Webpack Configuration for Bundle Optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `npm.${packageName?.replace('@', '')}`;
            },
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;

claude ko thk krne k lye ye command deni hai:
1- next.config ki file ka name next.config.ts tha lekin abhi tumne file ka name change krke ts se js kr dya uski wajah, or agr me pura wala name hi rehne dun to koi issue to nh?
2- jab mene tumhara next.config wala code apney file me dala to is dic me error show ho raha hai isko solve kro or na
3- mene next.config.ts hi rkha hua hai name abhi change nh kra hai

code:
lib: {             test: /[\\/]node_modules[\\/]/,             name(module) {               const packageName = module.context.match(                 /[\\/]node_modules[\\/](.*?)([\\/]|$)/               )?.[1];               return `npm.${packageName?.replace('@', '')}`;             },

code me hover krne pr message:
Parameter 'module' implicitly has an 'any' type.ts(7006)
(parameter) module: any

vs code k powershell pr error or local host khud se hi band bh ho gaya jab dubara run krna chaha to ye error aa raha hai:
PS D:\Demo\Meyuzas-Design> npm run dev
> mayuzas-design@0.1.0 dev
> next dev
   ▲ Next.js 16.0.3 (Turbopack)
   - Local:         http://localhost:3000    
   - Network:       http://192.168.1.101:3000
   - Experiments (use with caution):
     ✓ optimizeCss
     · optimizePackageImports
 ✓ Starting...
 ✓ Ready in 2.1s
 ⨯ ERROR: This build is using Turbopack, with a `webpack` config and no `turbopack` config.      
   This may be a mistake.
   As of Next.js 16 Turbopack is enabled by default and
   custom webpack configurations may need to be migrated to Turbopack.
   NOTE: your `webpack` config may have been added by a configuration plugin.
   To configure Turbopack, see https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
   TIP: Many applications work fine under Turbopack with no configuration,
   if that is the case for you, you can silence this error by passing the
   `--turbopack` or `--webpack` flag explicitly or simply setting an
   empty turbopack config in your Next config file (e.g. `turbopack: {}`).