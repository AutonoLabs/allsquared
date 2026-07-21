import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1b33",
        paper: "#fafaf7",
        accent: "#1f6b3f",
      },
    },
  },
  plugins: [],
};

export default config;
