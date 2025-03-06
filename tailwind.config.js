/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0F172A',
          secondary: '#1E293B',
          accent: '#2563EB',
        },
        luxury: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          purple: '#800080',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'loading-dot': 'loading-dot 1s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'loading-dot': {
          '0%, 100%': {
            opacity: '0.2',
            transform: 'scale(0.8)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1)',
          },
        },
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(45deg, #2563EB, #800080, #FFD700)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.luxury.gold'),
              '&:hover': {
                color: theme('colors.luxury.silver'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      {
        luxury: {
          primary: "#2563EB",
          secondary: "#800080",
          accent: "#FFD700",
          neutral: "#1E293B",
          "base-100": "#0F172A",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
}

