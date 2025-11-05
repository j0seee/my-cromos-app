/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ❌ No bloquear el build por errores de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ❌ No bloquear el build por errores de TypeScript
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;