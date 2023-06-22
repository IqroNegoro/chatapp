/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "**/*.{html,vue}"],
  theme: {
    extend: {
      screens: {
        "lg": "991px"
      }
    },
  },
  plugins: [],
}

