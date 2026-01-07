/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0c29', // Fondo principal muy oscuro
          800: '#1a163a', // Fondo secundario (sidebar/cards)
          700: '#241e4d', // Bordes o hover
        },
        primary: {
          500: '#7b2ff7', // Morado neón principal
          600: '#5f23c2',
        },
        accent: {
          blue: '#00d4ff', // Azul cian para detalles
          pink: '#ff007a', // Rosa para alertas o destacados
          yellow: '#fbbf24'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/assets/bg-pattern.svg')",
      }
    },
  },
  plugins: [],
}
