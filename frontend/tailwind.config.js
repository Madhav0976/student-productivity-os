/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        mist: "#F7F9FC",
        brand: "#2563EB",
        mint: "#14B8A6",
        coral: "#F97316"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};
