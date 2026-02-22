import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
        },
        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        }
      }
    },
  },
  plugins: [],
};
export default config;
