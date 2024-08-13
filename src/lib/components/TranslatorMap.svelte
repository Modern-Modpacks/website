<script lang="ts">
    import consts from "$lib/scripts/consts"
    import type { Pin as p } from "$lib/scripts/interfaces";
    import Pin from "./Pin.svelte";

    export let element : HTMLElement | null = null

    const pins : p[] = [
        {
            coords: {x: 696, y: 81},
            lang: "ru"
        },
        {
            coords: {x: 615, y: 96},
            lang: "de"
        },
        {
            coords: {x: 687, y: 141},
            lang: "tr"
        },
        {
            coords: {x: 586, y: 104},
            lang: "fr"
        },
        {
            coords: {x: 564, y: 138},
            lang: "es"
        },
        {
            coords: {x: 961, y: 134},
            lang: "cn"
        }
    ]
</script>

<span bind:this={element} class="h-full aspect-video flex desktop:items-center desktop:overflow-y-hidden scale-x-[100.5%]">
    <img src="{consts.MAP_URL}" alt="map" class="h-[110%] mobile:h-[125%] mobile:w rendering-pixelated">

    {#each pins as pin}
        <Pin pin={pin} />
    {/each}
</span>