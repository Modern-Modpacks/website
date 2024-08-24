import type { Contributor, Coordinates } from "./interfaces"
import consts from "./consts"

export const randomChoice = (elements: any[]) => elements[Math.floor(Math.random()*elements.length)] // Randomly select an element from the array, probably the most redefined function on planet earth
export const getDistance = (point1: Coordinates, point2: Coordinates): number => { // Get distance between two pixels on screen, used for the mouse follow effect in the modpacks section
    let distX = point1.x - point2.x
    let distY = point1.y - point2.y

    return Math.sqrt((distX ** 2) + (distY ** 2))
}
export const calculateElementCenter = (el : HTMLElement | undefined): Coordinates => { // Get the center of the element on the page
    if (!el) return {x: 0, y: 0}
    return {
        x: window.scrollX + el.getBoundingClientRect().left! + (el.getBoundingClientRect().width! / 2),
        y: window.scrollY + el.getBoundingClientRect().top! + (el.getBoundingClientRect().height! / 2)
    }
}

export const getWebsiteIcon = (url : string): string | null => { // Get an icon of a website based on its url
    if (!url) return null
    for (let [k, icon] of Object.entries(consts.WEBSITE_ICONS)) {
        if (url.includes(k)) return icon
    }
    return null
}
export const getContributorAvatar = (c : Contributor): string => c.avatar_url ?? `https://avatars.githubusercontent.com/u/${c.github.id}?v=4` // Get the avatar of a contributor

export const toggleScroll = (enable : boolean) => { // Toggle the ability to scroll the page vertically
    let container : HTMLElement | null = document.querySelector("#container")
    if (!container) return

    if (enable) {
        document.body.classList.remove("overflow-y-hidden", "touch-none")
        container.classList.remove("overflow-y-hidden", "touch-none")
        return
    }
    
    document.body.classList.toggle("overflow-y-hidden")
    document.body.classList.toggle("touch-none")
    container.classList.toggle("overflow-y-hidden")
    container.classList.toggle("touch-none")
}