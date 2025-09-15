/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
      {
        protocol: 'http',
        hostname: '192.168.1.9',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.2',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: 'example.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/hq-dashboard',
      },
    ]
  },
};

export default nextConfig;
