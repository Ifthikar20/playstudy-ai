/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.giphy.com"], // ✅ Add Giphy as an allowed domain
  },
};

module.exports = nextConfig;
