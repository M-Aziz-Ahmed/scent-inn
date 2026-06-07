/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Ensure mongoose works in serverless environment
  serverExternalPackages: ['mongoose'],
  // No global X-Robots-Tag headers — allow crawlers to index unless otherwise configured
};

export default nextConfig;
