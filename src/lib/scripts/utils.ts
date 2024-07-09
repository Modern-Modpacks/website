import { get } from "svelte/store"
import type { Coordinates, Member } from "./interfaces"
import { scrollY } from "./stores"
import consts from "./consts"

export const randomChoice = (elements: any[]) => elements[Math.floor(Math.random()*elements.length)] // Randomly select an element from the array, probably the most redefined function on planet earth
export const getDistance = (point1: Coordinates, point2: Coordinates): number => { // Get distance between two pixels on screen, used for the mouse follow effect in the modpacks section
    let distX = point1.x - point2.x
    let distY = point1.y - point2.y

    return Math.sqrt((distX ** 2) + (distY ** 2))
}

export const getWebsiteIcon = (url : string): string | null => { // Get an icon of a website based on its url
    if (!url) return null
    for (let [k, icon] of Object.entries(consts.WEBSITE_ICONS)) {
        if (url.includes(k)) return icon
    }
    return null
}
export const getMemberAvatar = (member : Member): string => member.avatar_url ?? `https://avatars.githubusercontent.com/u/${member.github_id}?v=4` // Get the avatar of a member

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