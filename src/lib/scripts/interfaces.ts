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
export interface Project { // Used for side projects in projects.json5
    id: string

    name: string
    icon: string
    link: string
}
export interface PartnerModpack extends Modpack { // Used for partnered packs. These can include a custom icon and a link to a different discord server
    icon?: string

    links?: {
        download?: string
        source?: string
        discord?: string
    }
}
export interface Member { // Used for members in members.json5
    name: string

    avatar_url?: string
    github_id?: number

    titles?: string[]
    socials?: string[]
}