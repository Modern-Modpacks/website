<script lang="ts">
    import consts, { icons } from "$lib/scripts/consts"
    import type { Social, TweenedBreatheAnim } from "$lib/scripts/interfaces"
    import { reducedMotion } from "$lib/scripts/stores";
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion"

    export let header : boolean = false // Specifies weather the social bar is in the header or in "about us", shortens the social list if in header
    const socials : {[key: string]: Social} = consts.SOCIALS // Socials, digested for TS

    // Breathe anim stuff
    let anims : TweenedBreatheAnim[] = []
    let animNumbers : number[] = []
    let barHovered = false
    const duration = 2000

    onMount(() => {
        setTimeout(() => {
            if (!header || $reducedMotion) return

            for (let i = 0; i < Object.values(socials).filter(s => s.header).length; i++) {
                anims.push({scale: tweened(100, {duration: duration, delay: 400*i}), scaleup: false, maxScale: 100, minScale: 85})            
                let anim = anims[i]

                setInterval(() => {
                    anim.scale.set(anim.scaleup ? anim.maxScale : anim.minScale)
                    anim.scaleup = !anim.scaleup
                }, duration)
                anim.scale.subscribe(v => {
                    animNumbers[i] = v
                })
            }
        }, 1)
    })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span class="{header ? "mt-2 " : ""}flex gap-3 w-fit" on:mouseenter={() => {barHovered=true}} on:mouseleave={() => {barHovered=false}}>
    {#each Object.entries(Object.keys(
        Object.fromEntries(Object.entries(socials).filter(([k, v]) => v.header || !header))
    )) as [i, k]}
    {@const social = socials[k]}
        <a href="{social.url}" title="{social.title}" class="{header ? " opacity-0 translate-y-10 duration-[.5s]" : ""}" style="transition-delay: {1 + (.05 * +i * +header)}s;">
            <img src="{icons[k]}" id="social" alt="website logo" class="h-10 brightness-0 invert motion-safe:hover:invert-[55%] duration-200" style="{header && !barHovered ? `transform: scale(${animNumbers[+i]}%);` : ''}">
        </a>
    {/each}
</span>