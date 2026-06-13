/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#FFFFFF",
        "background": "#F8F9FC",
        "primary": "#6D5DFC",
        "secondary": "#8B7CFF",
        "on-surface": "#111827",
        "on-background": "#111827",
        "on-surface-variant": "#4B5563",
        "outline": "#E5E7EB",
        "outline-variant": "#D1D5DB",
        "error": "#EF4444",
        "on-error": "#FFFFFF",
        "success": "#10B981",
        "on-success": "#FFFFFF",
        "warning": "#F59E0B",
        "on-warning": "#FFFFFF",
        "surface-container": "#F3F4F6",
        "surface-container-high": "#E5E7EB",
        "surface-container-highest": "#D1D5DB",
        "on-primary": "#FFFFFF",
        "primary-container": "#E0E7FF",
        "on-primary-container": "#3730A3"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "80px",
        "container-max": "1440px",
        base: "8px",
        "margin-mobile": "20px"
      },
      fontFamily: {
        "mono-technical": ["Geist"],
        "body-md": ["Inter"],
        "headline-lg": ["Hanken Grotesk"],
        "headline-xl": ["Hanken Grotesk"],
        "display-lg-mobile": ["Hanken Grotesk"],
        "body-lg": ["Inter"],
        "display-lg": ["Hanken Grotesk"],
        "label-caps": ["Geist"]
      },
      fontSize: {
        "mono-technical": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "0.01em", fontWeight: "600" }],
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["44px", { lineHeight: "48px", letterSpacing: "0.01em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-lg": ["72px", { lineHeight: "80px", letterSpacing: "0.02em", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "600" }]
      }
    },
  },
  plugins: [],
}
