import type { Moment } from "moment"
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
export interface Pin { // Used for pins on the translator map
    coords: Coordinates,
    lang: string
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

export interface Contributor { // Base interface for all contributors
    name: string
    avatar_url?: string

    github: {
        username: string,
        id: number
    }
}
export interface Member extends Contributor { // Used for members in members.json5
    titles?: string[]
    socials?: string[]
}
export interface Translator extends Contributor { // Used for translators in translators.json5
    title?: string,
}
export interface Tester extends Contributor {} // Used for testers in testers.json5

export interface GitHubFile { // Used for getting blogpost files from github
    mode: string,
    path: string,
    sha: string,
    size: number,
    type: string
}
export interface BlogPost { // Used for info about blogposts
    content: string,
    sourcelink: string,
    thumbnail: string,
    views: number,

    metadata: {
        title: string,
        subtitle: string,
        tag: number
    },
    ghdata: {
        author: Contributor,

        created: {
            time: Moment,
            url: string
        },
        edited: {
            time: Moment,
            url: string
        }
    }
}