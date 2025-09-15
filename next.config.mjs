/** @type {import('next').NextConfig} */
const nextConfig = {
  images :{
    domains : [
      "1z66y5vt2h.ucarecd.net",
      "ucarecdn.com",
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

export default nextConfig;
