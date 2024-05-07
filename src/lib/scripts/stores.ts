import { get, writable } from "svelte/store";
import { localStorageWritable } from "@babichjacob/svelte-localstorage"

export let scrollY = writable<number>(0)
export let reducedMotion = writable<boolean>(false)
export let randomSplash = localStorageWritable<string>("splash", "")