/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  images: {
    domains: ['https://lh3.googleusercontent.com/', 'https://github.com/'],
  },
}
export default nextConfig
