import { writable } from "svelte/store";
import { localStorageWritable } from "@babichjacob/svelte-localstorage"
import type { Coordinates } from "./interfaces";

export let scrollY = writable<number>(0)
export let mousePos = writable<Coordinates>({x: 0, y: 0})
export let reducedMotion = writable<boolean>(false)
export let randomSplash = localStorageWritable<string>("splash", "")