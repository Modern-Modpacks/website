<script lang="ts">
    import { reducedMotion } from "$lib/scripts/stores";
    import { onMount } from "svelte";
    import { tweened, type Tweened } from "svelte/motion";

    let cls : string = ""
    export {cls as class} // Class attribute support
    export let element : HTMLElement | null = null // To be able to do bind:element instead of bind:this

    export let duration : number
    export let minScale : number
    export let maxScale : number
    export let delay : number = 0
    export let play : boolean = true

    let scaleup : boolean = false
    let anim : Tweened<number> = tweened(maxScale, {duration: duration, delay: delay})
    let doCycle = () => {
        $anim = scaleup ? maxScale : minScale
        scaleup = !scaleup
    }

    onMount(() => {
        setTimeout(() => {
            if ($reducedMotion || !play) return

            // Play anim and start interval to play it continuously
            doCycle()
            setInterval(doCycle, duration)
        }, 1)
    })
</script>

<span bind:this={element} id="animinheader" class="block{cls ? " "+cls : ""}" style="transform: scale({$anim}%);">
    <slot />
</span>