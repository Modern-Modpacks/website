<script lang="ts">
    import { contextMenuOpenedBy, mobile, reducedMotion, scrollY } from "$lib/scripts/stores";
    import { tweened, type Tweened } from "svelte/motion";
    import ModContextMenu from "./ModContextMenu.svelte";
    import type { Mod } from "$lib/scripts/interfaces";
    import { get, type Writable } from "svelte/store";
    import { linear, sineOut } from "svelte/easing";
    import type { EasingFunction } from "svelte/transition";

    export let modNumber : number
    export let layerFirst : number
    export let layerAdd : number
    export let modContextMenu : ModContextMenu
    export let mods : Mod[] | null
    export let shouldAnimPlay : Writable<boolean>

    const defaultRotDuration : number = 5000 // Default rotation duration
    const rotDurationAdd : number = 3000 // How many ms is added per layer

    let getLayer = (layerNum: number, layerMax: number, layerAdd : number, modNumber: number): number => { // Get a layer based on super complex math :5head:
        if (modNumber<layerMax) return layerNum
        return getLayer(layerNum + 1, layerMax + layerAdd, layerAdd, modNumber - layerMax) // Each layer is `layerAdd` elements more than the last one, usually this is set to 2
    }
    const layer : number = getLayer(0, layerFirst, layerAdd, modNumber)
    const itemsInLayer : number = layerFirst + (layerAdd * layer)
    let radius : number
    $: radius = ($mobile ? 200 : 250) + ((layer + 1) ** ($mobile ? 6.5 : 7))

    let firstBarrelRollDone : boolean = false // Weather the first anim has already occurred
    let duration : number = defaultRotDuration + (rotDurationAdd * layer)
    let rotCount : Tweened<number> = tweened(0, {duration: duration})
    let rotAmount : number 
    $: rotAmount = (360 / itemsInLayer) * (modNumber + $rotCount) * (layer % 2 ? 1 : -1)

    let mod : Mod | null
    $: mod = mods ? mods[modNumber % mods?.length] : null

    // You spin me right round
    // Baby right round
    // Like a record baby
    // Round round round round
    let timeout : number | null
    let doABarrelRoll = (thisDur: number, easing: EasingFunction) => { // Start anim and start the timeout for the next one
        if ($reducedMotion) return

        rotCount.set(get(rotCount)+1, {duration: thisDur, easing: easing})
        timeout = setTimeout(() => {doABarrelRoll(duration, linear)}, thisDur)
    }
    shouldAnimPlay.subscribe(v => {
        if (v) {
            if (firstBarrelRollDone) doABarrelRoll(duration, linear) // If the first anim has already played, continue normally
            else {
                doABarrelRoll(600, sineOut) // If it hasn't, do a "on first view" animation
                firstBarrelRollDone = true
            }
        }
        else if (firstBarrelRollDone && !$reducedMotion) { // If the anim is hovered over, stop the timeout and smoothly stop the anim itself
            clearTimeout(timeout!)
            rotCount.set($rotCount+.03, {duration: 500, easing: sineOut})
        }
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
    style="transform: scale({($mobile ? 65 : 100) + (20 * layer)}%) rotate({rotAmount}deg) translate({radius}px) rotate({-rotAmount}deg); z-index: {40 * +($contextMenuOpenedBy==modNumber)}"
    title="{mod?.name}" on:click={e => {
        if ($mobile) $shouldAnimPlay = false
        modContextMenu?.toggle(modNumber, mod, {
            x: e.clientX + 10,
            y: e.clientY + $scrollY + 10
        })
    }}
>
    <img id="mod" src="{mod?.icon_url}" alt="" class="shadow-black{$contextMenuOpenedBy==modNumber ? " motion-safe:!scale-[1.15] motion-safe:shadow-2xl" : ""}">
</span>