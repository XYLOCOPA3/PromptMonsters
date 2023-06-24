/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      rotate: {
        10: "10deg",
        15: "15deg",
        20: "20deg",
        30: "30deg",
      },
      animation: {
        "blink-1": "blink-1 0.6s ease   both",
        "shake-horizontal":
          "shake-horizontal 0.2s cubic-bezier(0.455, 0.030, 0.515, 0.955)   both",
      },
      keyframes: {
        "blink-1": {
          "0%,50%,to": {
            opacity: "1",
          },
          "25%,75%": {
            opacity: "0",
          },
        },
        "shake-horizontal": {
          "0%,to": {
            transform: "translateX(0)",
          },
          "10%,30%,50%,70%": {
            transform: "translateX(-5px)",
          },
          "20%,40%,60%": {
            transform: "translateX(5px)",
          },
          "80%": {
            transform: "translateX(2px)",
          },
          "90%": {
            transform: "translateX(-2px)",
          },
        },
      },
    },
  },
  plugins: [],
};
