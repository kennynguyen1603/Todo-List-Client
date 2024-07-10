// const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        gray71: "#b5b5b5",
        customGreen: "rgb(104 163 121)",
      },
      display: ["group-hover"],
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    keyframes: {
      glow: {
        "0%": { left: "-100%" },
        "50%": { left: "50%" },
        "100%": { left: "100%" },
      },
    },
    animation: {
      glow: "glow 3s infinite",
    },

    screens: {
      phone: "480px",
      // => @media (min-width: 480px) { ... }

      tablet: "640px",
      // => @media (min-width: 640px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1680px",
      // => @media (min-width: 1560px) { ... }
    },
  },
  plugins: [import("flowbite/plugin")],
};
