/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#610505",
        'primary2': "rgb(242, 216, 216)",
        'primaryhover': "rgb(115, 37, 37)"
      }
    },
    screens: {
      'mobileMenu': '1025px',
      ...require('tailwindcss/defaultTheme').screens,
    },

  },
  plugins: [],
}