/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        healthcare: {
          bg: "#FFF6F9",
          surface: "#FFFFFF",
          surfaceSoft: "rgba(255,255,255,0.78)",
          border: "rgba(214,156,182,0.25)",
          text: "#4C3140",
          muted: "#7C5B69",
          primary: "#CC5C89",
          secondary: "#E7A1BE",
          accent: "#DA7FA6"
        }
      },
      boxShadow: {
        card: "0px 14px 32px rgba(108, 63, 86, 0.12)",
        soft: "0px 10px 24px rgba(108, 63, 86, 0.08)"
      }
    }
  },
  plugins: []
};
