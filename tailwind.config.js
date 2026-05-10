/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B35",
          foreground: "#FFFFFF",
        },
        navy: {
          DEFAULT: "#1A1F3C",
          foreground: "#FFFFFF",
        }
      },
      borderRadius: {
        lg: "12px",
      }
    },
  },
  plugins: [],
}
