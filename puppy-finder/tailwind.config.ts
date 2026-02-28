import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f0',
          100: '#fef0d9',
          200: '#fdd9a6',
          300: '#fbbb6d',
          400: '#f99d38',
          500: '#f57c00',
          600: '#e06500',
          700: '#b84d00',
          800: '#8a3900',
          900: '#5c2400',
        },
        cream: {
          50: '#fffdf8',
          100: '#fff9ee',
          200: '#fff2d6',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          400: '#a8a29e',
          600: '#57534e',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(245, 124, 0, 0.12)',
        warm: '0 4px 12px rgba(245, 124, 0, 0.18)',
        'warm-lg': '0 8px 24px rgba(245, 124, 0, 0.22)',
      },
    },
  },
  plugins: [],
};

export default config;
