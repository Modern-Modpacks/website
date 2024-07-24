<script lang="ts">
    import consts from "$lib/scripts/consts"

    export let element : HTMLElement | null = null
</script>

<span bind:this={element} class="h-full overflow-y-hidden">
    <img src="{consts.MAP_URL}" alt="map" class="h-[125%] scale-x-[100.5%] rendering-pixelated">
</span>