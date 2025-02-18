/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1C1F26",
        surface: "#262B36",
        border: "#363B47",
        "gray-400": "#9CA3AF",
      },
      fontSize: {
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["28px", "36px"],
      },
      spacing: {
        3: "14px",
        4: "18px",
        5: "20px",
        6: "28px",
        8: "32px",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
      maxWidth: {
        lg: "512px",
        xl: "590px",
      },
    },
  },
  plugins: [],
};
