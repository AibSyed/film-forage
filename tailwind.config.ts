import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./features/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        neon: "#0ea5e9",
        ember: "#f97316",
      },
      boxShadow: {
        glow: "0 10px 30px rgba(14,165,233,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
