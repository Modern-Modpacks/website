/** @type {import('tailwindcss').Config} */

const mmColors = {
  "mm-red": "#8e2121",
  "mm-orange": "#e06101",
  "mm-yellow": "#f1af15",
  "mm-green": "#495b24",
  "mm-lime": "#5ea918",
  "mm-lightblue": "#2489c7",
  "mm-cyan": "#157788",
  "mm-blue": "#2d2f8f",
  "mm-purple": "#64209c",
  "mm-magenta": "#a9309f",
  "mm-pink": "#d5658f",
  "mm-gray": "#373a3e",
  "mm-lightgray": "#7d7d73",
  "mm-white": "#cfd5d6",
  "mm-black": "#080a0f",
  "mm-brown": "#603c20"
}
let mmSafelist = []
Object.keys(mmColors).forEach(c => {mmSafelist.push("after:bg-"+c, "hover:text-"+c)})

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [ // TODO
    "hover:font-bold", "hover:font-semibold",
    ...mmSafelist
  ],
  theme: {
    colors: {
      "black": "#000",
      "white": "#fff",
      "transparent": "#00000000",
      ...mmColors,

      "primary-dark": "#1c1c1c",
      "header-dark": "#33333388",
      "text-dark": "#ffffff",
      "selected-text-dark": "#000000"
    },
    fontFamily: {
      "raleway": ["Raleway", "monospace", "sans-serif"]
    },
    extend: {
      keyframes: {
        float: {
            from: {
                transform: "translateY(-20%)"
            },
            to: {
                transform: "translateY(20%)"
            }
        }
      },
      animation: {
        float: "float 2s alternate infinite ease-in-out"
      }
    }
  },
  plugins: [
    require("tailwindcss-animated"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-view-transitions")
  ]
}

