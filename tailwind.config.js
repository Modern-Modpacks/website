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
Object.keys(mmColors).forEach(c => {mmSafelist.push("bg-"+c, "border-"+c, "after:bg-"+c, "[&>p]:text-"+c, "hover:[&>p]:text-"+c)})

const textElements = ["h1", "h2", "h3", "h4", "li", "p", "b"]
let udSafelist = []
textElements.forEach(e => {udSafelist.push(`[&_${e}]:[rotate:180deg]`)})

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "hover:font-bold", "hover:font-semibold",
    "bg-white", "border-white",
    "bg-text-dark", "text-selected-text-dark", "motion-safe:shadow-2xl",
    "motion-safe:desktop:hover:!scale-110", "motion-safe:desktop:hover:!scale-100",
    "motion-safe:!scale-[1.15]", "hover:opacity-0",
    "xl:motion-safe:peer-hover:translate-y-[2rem]", "xl:motion-safe:peer-hover:translate-y-[-2rem]", "2xl:motion-safe:peer-hover:translate-y-[4.7rem]", "2xl:motion-safe:peer-hover:translate-y-[-4.7rem]",
    "xl:motion-reduce:translate-y-[2rem]", "xl:motion-reduce:translate-y-[-2rem]", "2xl:motion-reduce:translate-y-[4.7rem]", "2xl:motion-reduce:translate-y-[-4.7rem]",
    "cursor-pointer", "cursor-not-allowed", "cursor-help",
    "overflow-x-scroll", "overflow-y-hidden", "touch-none",
    "scale-100", "scale-75", "translate-y-10", "-translate-y-10",

    ...udSafelist, ...mmSafelist
  ],
  theme: {
    screens: {
      "xl": "1280px",
      "2xl": "1536px",

      "mobile": {"max": "1023px"},
      "desktop": "1024px"
    },
    colors: {
      "black": "#000",
      "white": "#fff",
      "transparent": "#00000000",
      ...mmColors,

      "primary-dark": "#1c1c1c",
      "secondary-dark": "#0c0c0c",
      "header-dark": "#33333388",
      "footer-dark": "#070707",
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
    require("tailwindcss-view-transitions"),
    require("tailwindcss-image-rendering")()
  ]
}

