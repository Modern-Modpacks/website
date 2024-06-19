import type { Tweened } from "svelte/motion"

export interface Coordinates {
    x: number
    y: number
}
export interface Social {
    url: string
    title: string
    header: boolean
}
export interface TweenedBreatheAnim {
    scale: Tweened<number>
    scaleup: boolean
    
    maxScale: number
    minScale: number
}
export interface Modpack {
    name?: string
    abbr?: string

    banner?: string

    tags?: string[]
    ram?: {
        minimal?: number
        recommended?: number
    }
    links?: {
        download?: string
        source?: string
    }
}
export interface Mod {
    slug: string
    name: string
    icon_url: string
}
export interface PartnerModpack extends Modpack {
    icon?: string
}