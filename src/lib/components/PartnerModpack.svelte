<script lang="ts">
    import { type PartnerModpack } from "$lib/scripts/interfaces"
    import { popupOpenedBy, popupOpenedByPartner } from "$lib/scripts/stores";
    import ModpackPopup from "./ModpackPopup.svelte"

    export let modpack : PartnerModpack
    export let firstOfType : boolean
    let popupToggle : (() => void) | undefined
</script>

<ModpackPopup bind:toggle={popupToggle} modpack={modpack} icon={modpack.icon ?? ""} color="white" partner={true} firstOfType={firstOfType} />
<button class="h-40 w-40" on:click={popupToggle}>
    <img src="{modpack.icon}" class="h-full w-full rounded-xl {!$popupOpenedByPartner ? "motion-safe:desktop:hover:scale-110" : ""} duration-150 cursor-pointer" alt="{modpack.name} icon" title="{modpack.name}">
</button>