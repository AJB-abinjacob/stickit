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
    },
  },
  plugins: [],
};
