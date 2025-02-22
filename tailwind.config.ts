// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          100: "hsl(0, 0%, 96%)",
          400: "hsl(0, 0%, 45%)",
          700: "hsl(0, 0%, 20%)",
          750: "hsl(0, 0%, 17%)",
          800: "hsl(0, 0%, 15%)",
          900: "hsl(0, 0%, 10%)",
        },
        purple: {
          400: "#d4a5fa", // Brighter, more vivid than #d8b4fe, less pastel
          500: "#ba7af5", // Vibrant, brighter than #c084fc, less muted
          600: "#a855f7", // Kept as a strong mid-tone, vivid
          700: "#9741e8", // Brighter than #9333ea, more punchy
        },
        pink: {
          500: "#ec4899",
          600: "#db2777",
        },
        red: {
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
      borderRadius: {
        xl: "1rem",
      },
      transitionProperty: {
        all: "all",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;