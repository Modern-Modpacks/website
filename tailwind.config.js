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
  "mm-brown": "#603c20",

  "hm-red": "#8e2121",
  "hm-orange": "#e06101",
  "hm-yellow": "#f1af15",
  "hm-gray": "#373a3e"
}
let mmSafelist = []
Object.keys(mmColors).forEach(c => {mmSafelist.push("bg-"+c, "border-"+c, "after:bg-"+c, "hover:text-"+c)})

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "hover:font-bold", "hover:font-semibold", "hover:opacity-0",
    "bg-white", "border-white",
    "bg-text-dark", "text-selected-text-dark",
    "motion-safe:hover:!scale-110", "motion-safe:hover:!scale-[1.15]", "motion-safe:hover:!scale-100", "motion-safe:[&:not(:hover)]:group-hover:!scale-100",
    "cursor-pointer", "cursor-not-allowed",
    "scale-100", "scale-75",

    ...mmSafelist
  ],
  theme: {
    colors: {
      "black": "#000",
      "white": "#fff",
      "transparent": "#00000000",
      ...mmColors,

      "primary-dark": "#1c1c1c",
      "secondary-dark": "#0c0c0c",
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
        },
        breathe: {
          from: {
              transform: "scale(75%)"
          },
          to: {
              transform: "scale(100%)"
          }
        },
        "small-breathe": {
          from: {
              transform: "scale(100%)"
          },
          to: {
              transform: "scale(105%)"
          }
        },
        marquee: {
          from: {
              transform: "translateX(0rem)"
          },
          to: {
              transform: "translateX(var(--scroll-amount))"
          }
        }
      },
      animation: {
        float: "float 2s alternate infinite ease-in-out",
        breathe: "breathe 2s alternate infinite ease-in-out",
        "small-breathe": "small-breathe 5s alternate infinite ease-in-out",
        marquee: "marquee var(--scroll-time) infinite linear"
      }
    }
  },
  plugins: [
    require("tailwindcss-animated"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-view-transitions"),
    require("tailwindcss-image-rendering")()
  ]
}

