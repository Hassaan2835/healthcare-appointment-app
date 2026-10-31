/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#04070F",
          900: "#070D1A",
          850: "#0A1322",
          800: "#0C1729",
          700: "#13223C",
          600: "#1B2F52",
        },
        mint: {
          200: "#A7F9E0",
          300: "#7CF5D3",
          400: "#45F0C4",
          500: "#2BD9A9",
          600: "#17B890",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 70px -14px rgba(69, 240, 196, 0.45)",
        card: "0 24px 60px -24px rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};
