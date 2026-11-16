import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        tuki: {
          bg: "#0B0314",
          dark: "#140727",
          purple: "#1E0B36",
          deep: "#3B0764",
          violet: "#5B21B6",
          accent: "#7C3AED",
          glow: "#9333EA",
          yellow: "#FACC15",
          "yellow-hover": "#EAB308",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
