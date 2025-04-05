/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "media.giphy.com", 
      "media0.giphy.com",
      "media1.giphy.com", 
      "media2.giphy.com",
      "media3.giphy.com",
      "media4.giphy.com",
      "i.pravatar.cc"
    ], // ✅ Add all Giphy subdomains as allowed domains
  },
  experimental: {
    serverComponentsExternalPackages: ['zlib'],
  },
};

module.exports = nextConfig;