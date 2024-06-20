/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui(),
    function ({ addUtilities }) {
      addUtilities({
        ".custom-scrollbar::-webkit-scrollbar": {
          width: "8px",
        },
        ".custom-scrollbar::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb": {
          background: "darkgrey",
          borderRadius: "10px",
          border: "2px solid transparent",
          backgroundClip: "padding-box",
        },
      });
    },
  ],
};
