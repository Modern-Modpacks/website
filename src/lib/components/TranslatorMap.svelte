<script lang="ts">
    import consts from "$lib/scripts/consts"
    import type { Pin as p } from "$lib/scripts/interfaces";
    import Pin from "./Pin.svelte";

    export let element : HTMLElement | null = null

    const pins : p[] = [
        {
            coords: {x: 769, y: 182},
            lang: "ru"
        }
    ]
</script>

<span bind:this={element} class="h-full aspect-video flex items-center overflow-y-hidden scale-x-[100.5%]">
    <img src="{consts.MAP_URL}" alt="map" class="h-[110%] rendering-pixelated">

    {#each pins as pin}
        <Pin pin={pin} />
    {/each}
</span>