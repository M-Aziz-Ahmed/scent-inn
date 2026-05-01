/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Ensure mongoose works in serverless environment
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
