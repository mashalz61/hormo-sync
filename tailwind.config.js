/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        healthcare: {
          bg: "#F3F8FC",
          surface: "#FFFFFF",
          surfaceSoft: "rgba(255,255,255,0.72)",
          border: "rgba(135,170,198,0.18)",
          text: "#16324F",
          muted: "#58718D",
          primary: "#2B7FFF",
          secondary: "#3AB7B1",
          accent: "#7A8BFF"
        }
      },
      boxShadow: {
        card: "0px 14px 32px rgba(33, 76, 120, 0.12)",
        soft: "0px 10px 24px rgba(33, 76, 120, 0.08)"
      }
    }
  },
  plugins: []
};
