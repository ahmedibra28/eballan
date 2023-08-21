/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['ui-avatars.com', 'source.unsplash.com', 'www.worldometers.info', 'upload.wikimedia.org',
            'b2c-admin-storage.s3-ap-southeast-1.amazonaws.com', 'amazonaws.com', 'play-lh.googleusercontent.com'],
    },
}

module.exports = nextConfig
