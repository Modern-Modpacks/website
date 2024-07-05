import { get } from "svelte/store"
import type { Coordinates } from "./interfaces"
import { scrollY } from "./stores"

export const randomChoice = (elements: any[]) => elements[Math.floor(Math.random()*elements.length)] // Randomly select an element from the array, probably the most redefined function on planet earth
export const getDistance = (point1: Coordinates, point2: Coordinates): number => { // Get distance between two pixels on screen, used for the mouse follow effect in the modpacks section
    let distX = point1.x - point2.x
    let distY = point1.y - point2.y

    return Math.sqrt((distX ** 2) + (distY ** 2))
}

export const toggleScroll = (enable : boolean) => {
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