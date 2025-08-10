/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2mb' }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' }
    ]
  }
};
export default nextConfig;
