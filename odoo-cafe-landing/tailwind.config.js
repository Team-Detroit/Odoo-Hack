export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#714B67",
          50: "#F6F2F5",
          100: "#EBE2E8",
          200: "#D6C5D1",
          300: "#B999AE",
          400: "#946F88",
          500: "#714B67",
          600: "#5C3D54",
          700: "#473042",
          800: "#332230",
          900: "#22161F",
        },
        teal: {
          DEFAULT: "#017E84",
          50: "#EAF6F6",
          100: "#D2ECED",
          200: "#A2D8DA",
          300: "#62BCC0",
          400: "#2E9DA2",
          500: "#017E84",
          600: "#016469",
          700: "#014C50",
          800: "#013538",
          900: "#012224",
        },
        neutralgray: {
          DEFAULT: "#8F8F8F",
          light: "#B5B5B5",
          dark: "#5C5C5C",
        },
        offwhite: "#FAF9FB",
        lavender: "#F4F1F6",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(113, 75, 103, 0.18)",
        card: "0 4px 24px -8px rgba(113, 75, 103, 0.12)",
        float: "0 30px 60px -20px rgba(113, 75, 103, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
