/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zoom-blue': '#0E71EB',
        'zoom-hover': '#0B5FCC',
        'zoom-gray': '#F7F9FA',
        'zoom-border': '#E1E8ED',
        'zoom-text': '#1F2937',
      },
      fontFamily: {
        'zoom': ['Lato', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}