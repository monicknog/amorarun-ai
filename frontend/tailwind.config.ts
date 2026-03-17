import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        folha: "#2f5d50",
        terra: "#7a5b43",
        creme: "#f7f2e7",
        coral: "#e38366"
      }
    }
  },
  plugins: []
};

export default config;