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
        background: "#1a1a1a", // Black-ish dark gray
        foreground: "#e0e0e0", // Light gray for text
        gray: {
          200: "#d1d1d1", // Light gray
          500: "#666666", // Mid gray
          800: "#333333", // Dark gray
        },
        purple: {
          400: "#c084fc", // Bright purple
          600: "#9333ea", // Darker purple
        },
      },
      borderRadius: {
        lg: "0.75rem",
      },
      // Updated animation for darker background effect
      animation: {
        "pulse-bg": "pulse-bg 3s infinite ease-in-out",
      },
      keyframes: {
        "pulse-bg": {
          "0%": { transform: "scale(1)", backgroundColor: "#111827" }, // Very dark gray (gray-900)
          "50%": { transform: "scale(1.02)", backgroundColor: "#1f2937" }, // Slightly lighter dark gray (gray-800)
          "100%": { transform: "scale(1)", backgroundColor: "#111827" }, // Back to very dark gray
        },
      },
    },
  },
  plugins: [],
} satisfies Config;