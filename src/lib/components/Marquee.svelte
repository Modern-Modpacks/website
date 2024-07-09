<script lang="ts">
    import { mobile, reducedMotion } from "$lib/scripts/stores";
    import { onMount } from "svelte"
    import { linear, sineOut } from "svelte/easing";
    import { tweened, type Tweened } from "svelte/motion"
    import { get, writable, type Writable } from "svelte/store"

    // Options
    export let backwards : boolean = false // By default animation plays right to left, weather to reverse that
    export let vertical : boolean = false // Weather to play the animation vertically instead of horizontally
    export let baseAnimDur : number
    export let firstAnimLength : number = 0
    export let animMin : number
    export let animMax : number
    export let stopDur : number = 0
    export let inview : Writable<boolean> = writable(false)
    
    // Shenanigans
    let translate : Tweened<number> = tweened(firstAnimLength ? ((backwards ? animMax : animMin) + (firstAnimLength * (backwards ? 1.5 : -1))) : 0, {duration: baseAnimDur})
    let animCount : number = firstAnimLength ? 0 : 2
    let animPlaying : boolean = false
    let timeout : number | null
    let doAnim = (resetAnim: boolean) => {
        if ($reducedMotion) return
        animPlaying = true

        let animDur = resetAnim ? (!animCount ? 1500 : baseAnimDur) : baseAnimDur - ((baseAnimDur * (backwards ? 1 - (get(translate) / animMax) : get(translate) / animMax)))

        if (resetAnim) translate.set(backwards ? animMax : animMin, {duration: !animCount ? animDur : 0, easing: !animCount ? sineOut : linear})
        if (animCount) translate.set(backwards ? animMin : animMax, {duration: animDur})

        animCount++
        timeout = setTimeout(() => {doAnim(true)}, animDur)
    }

    onMount(() => {
        setTimeout(() => {
            if ($mobile) animCount = 2

            if (!firstAnimLength || $mobile) doAnim(true)
            else {inview.subscribe(v => {
                if (v) doAnim(true)
            })}
        }, 1)
    })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
    class="w-fit{$reducedMotion ? " overflow-x-scroll" : ""}"
    style="transform: translate{vertical ? "Y" : "X"}({-$translate}rem);"
    on:mouseenter={() => {if ($reducedMotion || $mobile || animCount<2 || !stopDur) return; animPlaying = false; clearInterval(timeout ?? 0); translate.set(get(translate) + (2 * (backwards ? -1 : 1)), {duration: stopDur, easing: sineOut})}} on:mouseleave={() => {if (!animPlaying) doAnim(false)}}
>
    <slot />
</span>