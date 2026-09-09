import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        bg: {
          base: "#F4EDE5",
          raised: "#EDECF2",
          elevated: "#D8E2EB",
          subtle: "#D1E8EE",
        },

        border: {
          subtle: "#EDECF2",
          default: "#C8C7D7",
          strong: "#8897AA",
        },

        text: {
          primary: "#3F4A59",
          secondary: "#657181",
          tertiary: "#8897AA",
          muted: "#A7AFBB",
        },

        accent: {
          DEFAULT: "#8897AA",
          muted: "#6F7F94",
          subtle: "rgba(200, 199, 215, 0.35)",
        },

        danger: "#A98291",
        warn: "#B7A186",
        success: "#78A8B0",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },

      fontSize: {
        "display-xl": [
          "clamp(2.75rem, 6vw, 4.75rem)",
          {
            lineHeight: "1.05",
            letterSpacing: "-0.03em",
          },
        ],

        "display-lg": [
          "clamp(2rem, 4vw, 3.25rem)",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.025em",
          },
        ],

        display: [
          "clamp(1.5rem, 3vw, 2.25rem)",
          {
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
          },
        ],
      },

      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(216, 226, 235, 0.7), transparent 68%)",
      },

      boxShadow: {
        soft: "0 12px 35px rgba(136, 151, 170, 0.16)",
        card: "0 4px 20px rgba(136, 151, 170, 0.12)",
      },

      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(4px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "pulse-soft": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.6",
          },
        },
      },

      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};

export default config;