/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'localhost',
    'localhost:*',
    '127.0.0.1',
    '127.0.0.1:*',
    `${process.env.NEXT_PUBLIC_API_URL}`,
  ],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '-',
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig; 