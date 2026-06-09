/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/public/demo_output/**', '**/.git/**'],
      }
    }
    return config
  },
}

export default nextConfig
