/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ui-avatars.com', 'source.unsplash.com', 'www.worldometers.info'],
  },
}

module.exports = nextConfig
