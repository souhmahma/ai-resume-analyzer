/** @type {import('tailwindcss').Config} */
export default {
  content  : ['./index.html', './src/**/*.{js,jsx}'],
  darkMode : 'class',
  theme    : {
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.1)',
        dark: {
          50 : '#f8fafc',
          100: '#1e1e2e',
          200: '#181825',
          300: '#11111b',
          400: '#0d0d17',
        },
        brand: {
          50 : '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          pink  : '#ec4899',
          purple: '#a855f7',
          blue  : '#3b82f6',
          cyan  : '#06b6d4',
        }
      },
      fontFamily: {
        sans : ['Inter', 'sans-serif'],
        mono : ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float'        : 'float 6s ease-in-out infinite',
        'pulse-slow'   : 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient'     : 'gradient 8s ease infinite',
        'slide-up'     : 'slideUp 0.5s ease-out',
        'fade-in'      : 'fadeIn 0.6s ease-out',
        'glow'         : 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%'     : { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%'     : { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to  : { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to  : { opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%'     : { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial'  : 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh'    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-gradient'    : 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
      },
    },
  },
  plugins: [],
}