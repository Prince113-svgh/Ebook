/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com','your-cdn.com'] // add domains you use for images/pdf preview
  }
}
module.exports = nextConfig
