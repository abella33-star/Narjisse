import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#000000',
        surface: '#0A0A0A',
        card:    '#111111',
        border:  '#1E1E1E',
        muted:   '#444444',
        'accent-gold':   '#D4AF37',
        'accent-orange': '#FF6B00',
        'accent-pink':   '#E91E8C',
        'accent-green':  '#00C896',
        'accent-purple': '#9B59B6',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'Arial Narrow', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
