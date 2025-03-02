/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.giphy.com", "i.pravatar.cc"], // ✅ Add Giphy as an allowed domain
  },
  experimental: {
    serverComponentsExternalPackages: ['zlib'],
  },
};

module.exports = nextConfig;