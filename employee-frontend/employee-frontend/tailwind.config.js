/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8BC34A",
          dark: "#3c6600",
          dim: "#345900",
          container: "#c1fd7c",
          "on-container": "#396100",
        },
        sidebar: "#333333",
        surface: {
          DEFAULT: "#FFFFFF",
          dim: "#d3d5d5",
          variant: "#dbdddd",
          container: "#e7e8e8",
          "container-high": "#e1e3e3",
          "container-highest": "#dbdddd",
          "container-low": "#f0f1f1",
          "container-lowest": "#ffffff",
        },
        "on-surface": "#2d2f2f",
        "on-surface-variant": "#5a5c5c",
        outline: {
          DEFAULT: "#767777",
          variant: "#acadad",
        },
        tertiary: {
          DEFAULT: "#6c45af",
          container: "#c29fff",
          "on-container": "#3f0f81",
        },
        error: {
          DEFAULT: "#b02500",
          container: "#f95630",
          "on-container": "#520c00",
        },
        success: {
          DEFAULT: "#8BC34A",
          light: "#c1fd7c",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#92400E",
        },
      },
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        "headline-md": ["1.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        "title-sm": ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-md": ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      boxShadow: {
        ambient: "0 20px 40px rgba(45, 47, 47, 0.04)",
        "ambient-lg": "0 24px 48px rgba(45, 47, 47, 0.06)",
        glass: "0 8px 32px rgba(45, 47, 47, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        68: "17rem",
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        pulse_soft: "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
