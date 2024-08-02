<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { Pin } from "$lib/scripts/interfaces";
    import { _ } from "svelte-i18n";

    export let pin : Pin
</script>

<span class="absolute top-0 left-0 flex flex-col items-center cursor-pointer group" style="translate: {pin.coords.x}px {pin.coords.y}px;" title="{$_("languages."+pin.lang)}">
    <img src="{consts.PIN_URL}" alt="pin" class="relative h-8 z-10 motion-safe:group-hover:scale-[1.5] duration-[250ms] ease-out origin-bottom">
    <div class="h-10 w-10 bg-[radial-gradient(circle,_#000000_0%,_transparent_50%)] rounded-full -translate-y-5" />
</span>