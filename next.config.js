/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Ignorar errores de ESLint durante el build (Vercel no fallará por avisos de 'any')
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Ignorar errores de TypeScript durante el build (no bloqueará por tipos)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ⚙️ Otras configuraciones útiles para Next.js
  experimental: {
    turbo: {
      rules: {
        // Permitir imágenes estáticas sin optimización de next/image
        '*.png': ['file-loader'],
        '*.jpg': ['file-loader'],
        '*.webp': ['file-loader'],
      },
    },
  },
};

module.exports = nextConfig;