import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9924A',
        'gold-light': '#E8B87A',
        bg: '#0C0C0C',
        surface: '#111111',
        surface2: '#1A1A1A',
        surface3: '#252525',
        body: '#BBBBBB',
        muted: '#888888',
        ghost: '#444444',
        'ghost-text': '#555555',
        warm: '#F8F4EE',
        danger: '#C94A4A',
        success: '#5CBF6A',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        ui: ['Montserrat', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['Space Mono', 'monospace'],
      },
      maxWidth: {
        mobile: '480px',
        site: '1280px',
      },
    },
  },
  plugins: [],
}
export default config
