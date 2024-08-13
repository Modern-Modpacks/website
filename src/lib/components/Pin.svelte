<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { Pin } from "$lib/scripts/interfaces";
    import { mobile } from "$lib/scripts/stores";
    import { _ } from "svelte-i18n";

    export let pin : Pin
</script>

<span class="absolute top-0 left-0 flex flex-col items-center cursor-pointer group" style="translate: {pin.coords.x / ($mobile ? 2 : 1)}px {pin.coords.y / ($mobile ? 1.4 : 1)}px;" title="{$_("languages."+pin.lang)}">
    <img src="{consts.PIN_URL}" alt="pin" class="relative h-8 mobile:h-6 z-10 motion-safe:group-hover:scale-[1.5] duration-[250ms] ease-out origin-bottom">
    <div class="h-10 w-10 mobile:h-6 mobile:w-6 bg-[radial-gradient(circle,_#000000_0%,_transparent_50%)] rounded-full -translate-y-5 mobile:-translate-y-3" />
</span>