export interface Coordinates {
    x: number
    y: number
}
export interface Modpack {
    name?: string
    abbr?: string
}
export interface PartnerModpack extends Modpack {
    icon?: string
}