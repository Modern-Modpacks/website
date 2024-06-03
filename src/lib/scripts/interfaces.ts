export interface Coordinates {
    x: number
    y: number
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
export interface PartnerModpack extends Modpack {
    icon?: string
}