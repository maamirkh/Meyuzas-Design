import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#111827',
          accent: '#f97316'
        }
      },
      boxShadow: {
        'card-soft': '0 2px 12px rgba(2,6,23,0.08)'
      }
    }
  },
  plugins: []
};

export default config;