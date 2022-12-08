/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        turquoise: "#2dd4bf",
        mauvePurple: "#d8b4fe",
        babyBlue: "#93c5fd",
        minionYellow: "#fde047",
        darkGray: "#707275",
        backgroundGray: "#f9fafb",
        lightGray: "#f4f5f7",
        veryDarkGray: "#282828",
        darkRed: "#9f0e0e",
        lightRed: "#f7dede",
        darkGreen: "#0e9f6e",
        lightGreen: "#def7ec",
        darkBlue: "#3f83f8",
        lightBlue: "#e1effe",
        darkYellow: "#c27803",
        lightYellow: "#fdf6b2",
        adminBlue: "#93C5FD",
      },
      animation: {
        "slide-down": "slide-down 0.3s ease-in-out 1",
      },
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-2rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
