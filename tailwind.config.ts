
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sage: {
          50: "#F7F9F8",
          100: "#E5E7EB",
          500: "#059669",
          600: "#047857",
        },
        text: {
          heading: "#0A0A0A",
          body: "#4A4A4A",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        amber: {
          500: "#F59E0B",
          600: "#D97706",
        },
        violet: {
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        blue: {
          500: "#3B82F6",
          600: "#2563EB",
        },
      },
      boxShadow: {
        card: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        "card-hover": "0px 8px 30px rgba(0, 0, 0, 0.08)",
        chart: "0px 2px 6px rgba(0, 0, 0, 0.03)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      },
      backgroundImage: {
        "gradient-soft": "linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)",
        "gradient-warm": "linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)",
        "gradient-cool": "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-light": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-slow": "fade-in-slow 0.8s ease-out forwards",
        "scale-up": "scale-up 0.4s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-light": "pulse-light 2s infinite ease-in-out",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
