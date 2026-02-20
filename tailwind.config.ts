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
        // Colores de marca AMC Agency
        background: "#050505", // Negro profundo
        foreground: "#ffffff",
        accent: {
          blue: "#0070f3",   // Azul Eléctrico
          gold: "#d4af37",   // Oro Neón
        },
        card: {
          DEFAULT: "#0a0a0a",
          foreground: "#ffffff",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;