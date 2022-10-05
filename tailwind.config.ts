module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    extend: {
      colors: {
        main: "#38b049",
        color2: "#00A774",
        color3: "#009B9B",
        color4: "#008BB7",
        color5: "#0079C1",
        color6: "#0062B7",
        secondary: "#1d6f2a",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
