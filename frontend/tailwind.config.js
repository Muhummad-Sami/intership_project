export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        background: "#121414",
        surface: "#1a1c1c",
        "on-surface": "#e2e2e2",
      },
      fontFamily: {
        display: ["Playfair Display"],
        body: ["Hanken Grotesk"],
      }
    },
  },
  plugins: [],
};