/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', ...defaultTheme.fontFamily.sans],
        montserrat: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
        roboto: ['"Roboto"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        accent: "#0054a6"
      },
      backgroundColor: {
        accent: "#0054a6",
        primary: "#fff",
        secondary: "rgb(248 250 252)",
        third: "rgb(229 231 235)"
      },
      gridColumn: {
        "span-15": "span 15 / span 15",
        "span-5": "span 5 / span 5"
      },
      gridTemplateColumns: {
        20: "repeat(20, minmax(0, 1fr))"
      },
      boxShadow: {
        custom: "rgba(0, 0, 0, 0.12) 0px 2px 10px 2px"
      },
      screens: {
        "3xl": "1750px",
        "4xl": "1900px",
        "5xl": "2200px"
      }
    },
    
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/container-queries")
  ]
};
