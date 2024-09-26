<script lang="ts">
    import { mobile, reducedMotion } from "$lib/scripts/stores";
    import testersJson from "$lib/json/testers.json5" 
    import Saos from "saos";
    import BreathingIcon from "./BreathingIcon.svelte";
    import type { Tester } from "$lib/scripts/interfaces";
    import { getContributorAvatar } from "$lib/scripts/utils";
    import { onMount } from "svelte";

    // Hex position and whether the parent element is hovered
    export let col : number
    export let row : number
    export let parentHovered : boolean

    // Calculate hex's linear position
    let count : number = row
    for(let x = 0; x < col; x++) count += x%2 ? 5 - +(x==3) : 4 - +(x==4)

    // Testers, chewed up for ts
    let testers : Tester[] = testersJson

    // Get current tester based on offset
    let offset : number = count % testers.length
    let tester : Tester
    $: tester = testers[offset]

    // Offset animation
    let showHex : boolean = true
    const minSec : number = 5000
    const maxSec : number = 35000
    let setRotationTimeout = () => {
        if ($reducedMotion) return
        setTimeout(rotationTimeout, (Math.random() * (maxSec - minSec)) + minSec)
    }
    let rotationTimeout = () => {
        if (parentHovered) {
            setRotationTimeout()
            return
        }

        showHex = false
        setTimeout(() => {
            offset = (offset + 1) % testers.length
            showHex = true

            setRotationTimeout()
        }, 500)
    }
    onMount(() => {
        setTimeout(setRotationTimeout, 1)
    })
</script>

<style>
    @keyframes -global-appear {
        from {
            @apply opacity-0
        }
        to {
            @apply opacity-100
        }
    }
</style>

<Saos animation={$reducedMotion ? "" : `appear .25s ${.1*(col + row)}s ease-in backwards`} once={true}>
    <span class="absolute w-48 h-48 mobile:w-32 mobile:h-32 duration-500{showHex ? "" : " opacity-0 pointer-events-none"}" style="top: {(col%2 ? ($mobile ? 0 : -11) : ($mobile ? -3 : -5)) + (row * ($mobile ? 8.5 : 12.5))}rem; left: {($mobile ? -3 : -5) + (col * ($mobile ? 8 : 10.5))}rem;">
        <BreathingIcon duration={2000} minScale={100} maxScale={105} delay={150 * count} class="peer duration-200 motion-safe:desktop:[&:not(:hover)]:group-hover:!scale-100 motion-safe:desktop:hover:!scale-[115%]" style="clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);">
            <a href="https://github.com/{tester.github.username}" target="_blank" rel="noopener noreferrer" title="GitHub ({tester.github.username})">
                <img src="{getContributorAvatar(tester)}" alt="{tester.name}'s avatar">
            </a>
        </BreathingIcon>
    </span>
</Saos>