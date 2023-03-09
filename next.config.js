/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: "/",
      destination: "/redoc-static.html",
    },
  ],
}

module.exports = nextConfig
