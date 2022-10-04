/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pallete-green-dark": "#134611",
        "pallete-green-light": "#CADF9E",
        "pallete-grey-dark": "#475B63",
        "pallete-brown-light": "#A49694",
        "pallete-blue-light": "#7BDFF2",
      },
    },
  },
  plugins: [],
};
