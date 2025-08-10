import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#7C3AED' }
      }
    }
  },
  plugins: []
}
export default config
