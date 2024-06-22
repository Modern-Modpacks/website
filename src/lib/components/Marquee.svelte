<script lang="ts">
    import { reducedMotion } from "$lib/scripts/stores";
    import { onMount } from "svelte"
    import { sineOut } from "svelte/easing";
    import { tweened, type Tweened } from "svelte/motion"
    import { get } from "svelte/store"

    // Options
    export let backwards : boolean = false // By default animation plays right to left, weather to reverse that
    export let baseAnimDur : number
    export let animMin : number
    export let animMax : number
    export let stopDur : number
    
    // Shenanigans
    let translate : Tweened<number> = tweened(0, {duration: baseAnimDur})
    let timeout : number | null 
    let doAnim = (resetAnim: boolean) => {
        if ($reducedMotion) return
        let animDur = resetAnim ? baseAnimDur : baseAnimDur - ((baseAnimDur * (backwards ? 1 - (get(translate) / animMax) : get(translate) / animMax)))

        if(resetAnim) translate.set(backwards ? animMax : animMin, {duration: 0})
        translate.set(backwards ? animMin : animMax, {duration: animDur})

        timeout = setTimeout(() => {doAnim(true)}, animDur)
    }

    onMount(() => {doAnim(true)})
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
    class="w-fit{$reducedMotion ? " overflow-x-scroll" : ""}"
    style="transform: translateX(-{$translate}rem);"
    on:mouseenter={() => {if ($reducedMotion) return; clearInterval(timeout ?? 0); translate.set(get(translate) + (2 * (backwards ? -1 : 1)), {duration: stopDur, easing: sineOut})}} on:mouseleave={() => {doAnim(false)}}
>
    <slot />
</span>