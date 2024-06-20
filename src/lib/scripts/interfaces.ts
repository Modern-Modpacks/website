import type { Tweened } from "svelte/motion"

export interface Coordinates { // Used for keeping track of the mouse
    x: number
    y: number
}
export interface Social { // Used for socials in consts.ts
    url: string
    title: string
    header: boolean
}
export interface TweenedBreatheAnim { // Used for breathing animations around the website
    scale: Tweened<number>
    scaleup: boolean
    
    maxScale: number
    minScale: number
}
export interface Modpack { // Used for modpacks in modpacks.json5
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
export interface Mod { // Used for mods gotten from modrinth api
    slug: string

    name: string
    summary: string

    icon_url: string
    link_urls: {
        source: {url: string}
    }
}
export interface PartnerModpack extends Modpack { // Used for partnered packs, since they don't have an icon by default
    icon?: string
}