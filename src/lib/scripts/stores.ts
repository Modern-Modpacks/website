import { writable } from "svelte/store"
import { localStorageWritable } from "@babichjacob/svelte-localstorage"
import type { BlogPost, Coordinates, Modpack, Pin } from "./interfaces"

export let scrollY = writable<number>(0) // Scroll position of the page
export let mousePos = writable<Coordinates>({x: 0, y: 0})
export let reducedMotion = writable<boolean>(false)
export let mobile = writable<boolean>(false)
export let sortedLocales = writable<string[]>([])
export let memeLocales = writable<string[]>([])
export let upsideDownLocale = writable<boolean>(false)
export let storedLocale = localStorageWritable<string>("locale", "")
export let settingsOpened = writable<boolean>(false)
export let popupOpenedBy = writable<Modpack | null>(null) // Whether the modpack popup is opened and by who
export let popupOpenedByPartner = writable<boolean>(false) // Whether a partner modpack popup is opened
popupOpenedBy.subscribe(v => {popupOpenedByPartner.set(v!=null && "icon" in v)})
export let contextMenuOpenedBy = writable<number | null>(null) // Whether the mod context menu is opened and by who
export let activatedPin = writable<Pin | null>(null) // The lang code of the activated map pin
export let blogPosts = writable<{[key: string]: BlogPost} | null>(null) // Cached blogposts
export let visitedBlog = writable<boolean>(false) // Whether the blog has been visited
export let previousRandomBanner = localStorageWritable<string>("banner", "") // Keeping track of the previous banner so it doesn't get regenerated whenever not needed
export let randomSplash = localStorageWritable<string>("splash", "") // Same as above but for the spalsh