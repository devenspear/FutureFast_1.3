/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Allow cross-origin requests in development
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '192.168.1.51',  // Include the IP address from the warning
  ],
};

module.exports = nextConfig;
