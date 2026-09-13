/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#0B1730",
        sidebarBorder: "#1C2B48",
        content: "#F3F6FB",
        accent: "#2563EB",
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
