<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { Pin } from "$lib/scripts/interfaces";
    import { activatedPin, mobile } from "$lib/scripts/stores";
    import { _ } from "svelte-i18n";

    export let pin : Pin

    let active : boolean
    $: active = $activatedPin == pin.lang
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span class="absolute top-0 left-0 flex flex-col items-center cursor-pointer group" style="translate: {pin.coords.x / ($mobile ? 2.025 : 1)}px {pin.coords.y / ($mobile ? 1.4 : 1)}px;" title="{$_("languages."+pin.lang)}" on:click={() => {$activatedPin = (active ? null : pin.lang)}}>
    <img src="{consts.PIN_URL}" alt="pin" class="relative h-7 mobile:h-4 z-10 motion-safe:group-hover:scale-[1.5]{active ? " motion-safe:scale-[1.5] brightness-[.65]" : ""} ease-out origin-bottom" style="transition: transform 250ms, filter 100ms;">
    <div class="absolute -bottom-4 h-8 w-8 mobile:h-6 mobile:w-6 bg-[radial-gradient(circle,_#000000_0%,_transparent_50%)] rounded-full mobile:-translate-y-3" />
</span>