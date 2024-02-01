/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'my-primary': '#5e17eb',
        'my-secondary': '#ffa500'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    // themes: ["light"],
    themes: [
      {
        mytheme: {
          "primary": "#5E17EB",
          "secondary": "#247400",
          "accent": "#008eff",
          "neutral": "#060603",
          "base-100": "#fcfcfc",
          "info": "#00a5ff",
          "success": "#35b000",
          "warning": "#ffa500",
          "error": "#ff96a6",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
