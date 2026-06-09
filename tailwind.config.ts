import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        property: {
          DEFAULT: '#1D6FEB',
          light: '#EBF3FF',
          dark: '#1254C0',
        },
        direction: {
          DEFAULT: '#D4740A',
          light: '#FFF4E0',
          dark: '#A55B07',
        },
        range: {
          DEFAULT: '#6E30D8',
          light: '#F2EDFF',
          dark: '#5522A8',
        },
        paper: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-epilogue)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Courier New', 'monospace'],
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      keyframes: {
        tabPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'tab-pulse': 'tabPulse 0.5s ease 2',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
