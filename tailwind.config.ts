import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        orange: "#EB841A",
        gray: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
export default config;

// plugins: [
//   plugin(function ({ addBase, theme }) {
//     addBase({
//       ':root': {
//         '--primary': theme('colors.primary'),
//         '--white': theme('colors.white'),
//         '--gray-4': theme('colors.gray-4'),
//         '--gray-6': theme('colors.gray-6'),
//         '--gray-10': theme('colors.gray-10'),
//         '--gray-12': theme('colors.gray-12'),
//         '--gray-14': theme('colors.gray-14'),
//       },
//     })
//   })
// ],
// const plugin = require('tailwindcss/plugin');
