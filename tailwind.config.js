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
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(45deg, #2563EB, #800080, #FFD700)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    typography: {
      DEFAULT: {
        css: {
          color: 'rgb(209 213 219)',
          a: {
            color: '#FFD700',
            '&:hover': {
              color: '#C0C0C0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
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

