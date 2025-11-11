/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        grotesque: ['Bricolage Grotesque', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'dm-sans-italic': ['DM Sans Italic', 'italic'],
      },
    },
  },
  plugins: [],
};
