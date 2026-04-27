export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#16211f",
        mint: "#CDEFE1",
        forest: "#0F6B4F",
        limewash: "#EEF8D9",
        clay: "#D9764A",
        skyglass: "#EAF4FF"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(28, 50, 45, 0.11)"
      }
    }
  },
  plugins: []
};
