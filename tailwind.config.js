/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#FFFFFF",
        sidebarBorder: "#E7E9EE",
        content: "#FAFBFC",
        accent: "#0056D2",
        badgeBg: "#E4EEFC",
        amber: "#F5A623",
        amberBg: "#FEF6E7",
        mint: "#22B573",
        progressGreen: "#1E9E6B",
        errorCoral: "#E15554",
        textInactive: "#5B6472",
      },
      fontFamily: {
        serif: ["Source Serif 4", "Georgia", "Cambria", "serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
