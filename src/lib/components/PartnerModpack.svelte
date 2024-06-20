<script lang="ts">
    import { type PartnerModpack } from "$lib/scripts/interfaces"
    import ModpackPopup from "./ModpackPopup.svelte"

    export let modpack : PartnerModpack
    let popupToggle : (() => void) | undefined
</script>

<ModpackPopup bind:toggle={popupToggle} modpack={modpack} icon={modpack.icon ?? ""} color="white" partner={true} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img src="{modpack.icon}" class="h-40 w-40 rounded-xl motion-safe:hover:scale-110 duration-150 cursor-pointer" alt="icon" title="{modpack.name}" on:click={popupToggle}>