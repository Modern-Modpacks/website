<script lang="ts">
    import consts from "$lib/scripts/consts"

    export let element : HTMLElement | null = null
</script>

<span bind:this={element} class="h-full aspect-video flex items-center overflow-y-hidden scale-x-[100.5%]">
    <img src="{consts.MAP_URL}" alt="map" class="h-[105%] rendering-pixelated">
</span>