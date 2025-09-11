/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
