/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        card: "#111111",
        ac: "#00c853",
        wa: "#ff5252",
        pending: "#888888",
        freeze: "#44a8ee",
        firstblood: "#ffd700",
        primaryText: "#eaeaea",
        secondaryText: "#888888",
      },
      fontFamily: {
        mono: [
          '"Fira Code"',
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flash-gold": "flashGold 2s ease-in-out",
        ticker: "ticker 480s linear infinite",
      },
      keyframes: {
        flashGold: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(255, 215, 0, 0)" },
          "50%": {
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
            borderColor: "#ffd700",
          },
        },
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
