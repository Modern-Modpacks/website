<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { Modpack } from "$lib/scripts/interfaces"
    import { popupOpened } from "$lib/scripts/stores"
    import { Globe, X } from "lucide-svelte";
    import { onMount } from "svelte"
    import { _ } from "svelte-i18n";
    import Portal from "svelte-portal"
    
    export let modpack : Modpack
    export let icon : string
    export let color : string

    export const toggle = () => {
        $popupOpened = !$popupOpened
        shown = !shown

        document.body.style.overflowY = shown ? "hidden" : "auto"
    }
    let shown : boolean = false

    let downloadIcon : string | null = null
    let sourceIcon : string | null = null
    for (let k of Object.keys(consts.WEBSITE_ICONS)) {
        let icon = consts.WEBSITE_ICONS[k as keyof typeof consts.WEBSITE_ICONS]

        if (modpack.links?.download?.includes(k) && downloadIcon==null) downloadIcon = icon
        if (modpack.links?.source?.includes(k) && sourceIcon==null) sourceIcon = icon
    }

    onMount(() => {
        document.addEventListener("keydown", e => {
            if (shown && e.key=="Escape") toggle()
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Portal target="body">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="{shown ? "opacity-100" : "invisible pointer-events-none opacity-0"} h-[100vh] w-[100vw] fixed top-0 left-0 flex items-center justify-center duration-500 bg-black bg-opacity-50 z-40" on:click={toggle}>
        <div class="bg-primary-dark shadow-black shadow-2xl rounded-xl h-[800px] w-[850px] duration-500 {shown ? "scale-100" : "scale-75"}" on:click={e => {e.stopPropagation()}}>
            <button class="absolute right-5 top-5 motion-safe:hover:rotate-180 duration-[350ms] ease-out cursor-pointer bg-black bg-opacity-30 rounded-full p-1" on:click={toggle}>
                <X size="32" />
            </button>
            <img src="{modpack.banner}" alt="banner" class="w-full h-[35%] object-cover rounded-t-xl">
            <img src="{icon}" alt="icon" class="absolute w-24 h-24 top-52 left-7 rounded-xl">

            <div class="p-7 pb-14 mt-5 flex h-[65%] box-border">
                <div class="w-[36rem]">
                    <h2>{modpack.name}</h2>
                    <h4 class="w-[50ch]">{$_(`modpacks.${modpack.abbr?.toLowerCase()}.shortdesc`)}</h4>
                    <p class="mt-6 w-[50ch] text-lg">{@html $_(`modpacks.${modpack.abbr?.toLowerCase()}.longdesc`)}</p>
                </div>

                <div class="h-full w-full flex flex-col">
                    <div class="flex flex-1 flex-col items-end">
                        <b class="text-xl mb-2">{$_("ui.tagstitle")}</b>
                        <div class="flex flex-wrap gap-2 justify-end">
                            {#each modpack.tags ?? [] as tag}
                                <p class="w-auto text-base bg-{color} bg-opacity-30 border-{color} border-2 rounded-xl px-2.5 py-0.5 hover:scale-110 duration-150">{$_("ui.tags."+tag)}</p>
                            {/each}
                        </div>
                        
                        {#if modpack.ram}
                            <b class="text-xl mt-8 mb-2">{$_("ui.ram.title")}</b>
                            <ul class="flex flex-col items-end [&>li]:text-lg">
                                <li>{$_("ui.ram.minimal")}: <b>{modpack.ram.minimal}</b></li>
                                <li>{$_("ui.ram.recommended")}: <b>{modpack.ram.recommended}</b></li>
                            </ul>
                        {/if}
                    </div>

                    <div class="w-full">
                        {#if modpack.links?.download}
                            <a href="{modpack.links.download}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-4 bg-text-dark rounded-lg p-4 hover:scale-110 duration-200">
                                {#if downloadIcon!=null}<img src="{downloadIcon}" alt="logo" class="brightness-0 w-[36px]">
                                {:else}<Globe color="#000000" size="30" />{/if}

                                <b class="text-lg text-secondary-dark">{$_("ui.download")}</b>
                            </a>
                        {/if}

                        {#if modpack.links?.source}
                            <a href="{modpack.links.source}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 mt-4 hover:scale-110 duration-200">
                                {#if sourceIcon!=null}<img src="{sourceIcon}" alt="logo" class="brightness-0 invert w-[36px]">
                                {:else}<Globe color="#000000" size="30" />{/if}

                                <b class="text-lg">{$_("ui.source")}</b>
                            </a>
                        {/if}

                        {#if !modpack.links}
                            <div class="flex items-center justify-center border-text-dark border-4 border-dashed rounded-lg p-4 hover:scale-105 duration-200 cursor-help" title="{$_("ui.wipbig")}">
                                <b class="text-lg">{$_("ui.wip")}</b>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</Portal>