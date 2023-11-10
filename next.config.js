const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: Boolean(process.env.NODE_ENV === 'development'),
    images: {
        domains: ['github.com', 'ui-avatars.com', 'farshaxan.blr1.cdn.digitaloceanspaces.com'],
    },
}

module.exports = nextConfig
