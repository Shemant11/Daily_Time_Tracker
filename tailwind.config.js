import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Lexend", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        base: {
          DEFAULT: "hsl(var(--base))",
          soft: "hsl(var(--base-soft))",
          elevated: "hsl(var(--base-elevated))",
        },
        border: "hsl(var(--border))",
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
          faint: "hsl(var(--ink-faint))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          soft: "hsl(var(--accent-soft))",
        },
        ember: {
          DEFAULT: "hsl(var(--ember))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0,0,0,0.24)",
        "glass-sm": "0 4px 16px 0 rgba(0,0,0,0.16)",
        glow: "0 0 0 1px hsl(var(--accent) / 0.4), 0 0 24px hsl(var(--accent) / 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--accent) / 0.45)" },
          "70%": { boxShadow: "0 0 0 12px hsl(var(--accent) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--accent) / 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        "pulse-ring": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
