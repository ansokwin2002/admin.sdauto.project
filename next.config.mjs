/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },

      // Local networks
      { protocol: 'http', hostname: '192.168.1.7', port: '8000' },
      { protocol: 'http', hostname: '192.168.1.9', port: '8000' },
      { protocol: 'http', hostname: '192.168.1.8', port: '8000' },
      { protocol: 'http', hostname: '192.168.1.5', port: '8000' },
      { protocol: 'http', hostname: '192.168.1.2', port: '8000' },
      { protocol: 'http', hostname: '192.168.1.3', port: '8000' },
      { protocol: 'http', hostname: '192.168.1.4', port: '8000' },
      { protocol: 'http', hostname: '192.168.0.120', port: '8000' },

      { protocol: 'http', hostname: 'example.com' },
    ],
  },
};

export default nextConfig;
