import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: 'var(--color-bg)',
          panel: 'var(--color-panel)',
          green: 'var(--color-green)',
          lime: 'var(--color-lime)',
          white: 'var(--color-text)',
          muted: 'var(--color-muted)',
          pink: 'var(--color-pink)',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        pixel: ['"VT323"', '"Pixelify Sans"', 'monospace'],
      },
      boxShadow: {
        terminal: '0 0 24px rgb(174 255 64 / 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config;
