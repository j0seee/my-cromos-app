/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#70D6FF',       // Azul brillante → botones y acentos
        secondary: '#FF70A6',     // Rosa → badges y elementos importantes
        orangeAccent: '#FF9770',  // Naranja → bordes, hover, detalles
        yellowAccent: '#FFD670',  // Amarillo → estrellas y highlights
        limeAccent: '#E9FF70',    // Verde-lima → nuevos cromos, indicadores de éxito
      },
      boxShadow: {
        card: '0 4px 10px rgba(0, 0, 0, 0.15)',
        badge: '0 2px 6px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        card: '12px',
        badge: '9999px',
      },
    },
  },
  plugins: [],
}
