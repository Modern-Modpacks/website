import type { Coordinates } from "./interfaces"

export const randomChoice = (elements: any[]) => elements[Math.floor(Math.random()*elements.length)]
export const getDistance = (point1: Coordinates, point2: Coordinates): number => {
    let distX = point1.x - point2.x
    let distY = point1.y - point2.y

    return Math.sqrt((distX ** 2) + (distY ** 2))
}