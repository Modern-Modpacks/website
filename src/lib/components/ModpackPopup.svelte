<script lang="ts">
    import consts from "$lib/scripts/consts"
    import type { Modpack, PartnerModpack } from "$lib/scripts/interfaces"
    import { mobile, popupOpenedBy, settingsOpened, upsideDownLocale } from "$lib/scripts/stores"
    import { getWebsiteIcon, toggleScroll } from "$lib/scripts/utils";
    import { Globe, X } from "lucide-svelte"
    import { onMount } from "svelte"
    import { _ } from "svelte-i18n"
    import Portal from "svelte-portal"
    import Tag from "./Tag.svelte";
    import { navigating } from "$app/stores";
    
    export let modpack : Modpack
    export let icon : string
    export let color : string
    export let partner : boolean
    export let firstOfType : boolean | null = null

    let partnerPack : PartnerModpack | null = null
    if (partner) partnerPack = modpack as PartnerModpack

    // Activates the popup which is hidden by default
    export const toggle = () => {
        $popupOpenedBy = $popupOpenedBy==null ? modpack : null
        shown = !shown

        toggleScroll(false)

        if (shown) {
            pullAmount = startPull // Reset mobile pull
            window.location.hash = modpack.abbr?.toLowerCase()! // Set location hash
        }
        else history.pushState("", document.title, window.location.pathname + window.location.search) // Remove location hash
    }
    let shown : boolean = false
    let loading : boolean = true

    // Mobile pull functionality
    const startPull : number = 200
    const pullFriction : number = 100
    let popupContent : HTMLElement | null
    let pull : boolean = false
    let pullAmount : number = startPull
    let prevTouch : Touch | null
    let pullUp : boolean | null

    // Get the icons for download and source button depending on the url of the links
    let downloadIcon : string | null = getWebsiteIcon(modpack.links?.download!)
    let sourceIcon : string | null = getWebsiteIcon(modpack.links?.source!)

    onMount(() => {
        // Escape on escape, duh
        document.addEventListener("keydown", e => {
            if (shown && e.key=="Escape" && !$settingsOpened) toggle()
        })

        if (!$navigating && (!partner || firstOfType) && window.location.hash.replace("#", "").toLowerCase()==modpack.abbr?.toLowerCase()) { // Enable the popup if the pack in the location hash is the current one
            scrollTo(0, innerHeight)
            setTimeout(toggle, 1)
        }
        setTimeout(() => {loading = false}, 10)
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Portal target="body">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="{shown ? "opacity-100" : "invisible pointer-events-none desktop:opacity-0 mobile:!bg-transparent"} h-[100vh] w-[100vw] fixed top-0 left-0 flex items-center justify-center {!loading ? "motion-safe:duration-500" : ""} motion-safe:bg-black motion-safe:bg-opacity-50 z-40" on:click={toggle}>
        <div bind:this={popupContent}
            class="bg-primary-dark shadow-black shadow-2xl desktop:rounded-xl mobile:rounded-t-xl h-[800px] w-[850px] mobile:h-fit mobile:w-[100vw] mobile:fixed mobile:pb-[1000px] {pull || loading ? "" : "motion-safe:duration-500"} {shown ? "scale-100" : "desktop:scale-75 mobile:top-[100%]"}"
            style="{$mobile && shown ? `top: ${pullAmount}px;` : ""}"
            on:click={e => {e.stopPropagation()}} on:touchmove={e => {
                if (!prevTouch) {
                    pull = true
                    prevTouch = e.touches[0]
                    return
                }

                let changeAmount = e.changedTouches[0].screenY - prevTouch.screenY
                pullUp = changeAmount < 0

                pullAmount += changeAmount
                prevTouch = e.changedTouches[0]
            }} on:touchend={() => {
                if (!pull) return

                pull = false
                prevTouch = null
                
                pullAmount += (pullFriction * (pullUp ? -1 : 1))
                let maxPull = -((popupContent?.offsetHeight ?? 0) - 1000 - window.innerHeight)
                if (pullAmount < maxPull) pullAmount = maxPull

                if (pullAmount > startPull) toggle()
            }}
        >
            {#if !$mobile}
                <button class="absolute right-5 top-5 motion-safe:desktop:hover:rotate-180 duration-[350ms] ease-out cursor-pointer bg-black bg-opacity-30 rounded-full p-1" on:click={toggle}>
                    <X size="32" />
                </button>
            {:else}
                <span class="h-1 w-40 bg-white absolute mx-auto mt-4 top-0 left-0 right-0 rounded-xl opacity-60" />
            {/if}
            <img src="{modpack.banner}" alt="banner" class="w-full h-[35%] mobile:h-[20vh] object-cover rounded-t-xl">
            <img src="{icon}" alt="icon" title="{modpack.name}" class="absolute w-24 h-24 mobile:w-20 mobile:h-20 top-[26%] left-[3%] mobile:top-16 mobile:left-5 rounded-xl mobile:rounded-lg">

            <div class="p-7 mobile:p-5 pb-14 mt-4 mobile:mt-2 flex mobile:flex-col mobile:gap-6 desktop:h-[65%] box-border">
                <div class="w-[36rem]{$upsideDownLocale ? " [&>*]:text-right" : ""}">
                    <h2 class="mobile:text-2xl">{modpack.name}</h2>
                    <h4 class="w-[50ch] mobile:w-[45ch] mobile:text-xs">{$_(`modpacks.${modpack.abbr?.toLowerCase()}.shortdesc`)}</h4>
                    <p class="mt-6 mobile:mt-4 w-[50ch] mobile:w-[45ch] text-lg mobile:text-xs" style="overflow_y: auto">{@html $_(`modpacks.${modpack.abbr?.toLowerCase()}.longdesc`)}</p>
                </div>

                <div class="h-full w-full flex flex-col">
                    <div class="flex flex-1 flex-col items-end mobile:items-center">
                        {#if !$mobile}
                            <b class="text-xl mb-2">{$_("ui.tagstitle")}</b>
                        {/if}
                        <div class="flex flex-wrap gap-2 justify-end mobile:justify-center mobile:mb-6">
                            {#each modpack.tags ?? [] as tag}
                                <Tag color={color} text={$_("ui.tags."+tag)} />
                            {/each}
                        </div>
                        {#if !$mobile && modpack.ram}
                            <b class="text-xl mt-8 mb-2">{$_("ui.ram.title")}</b>
                            <ul class="flex flex-col items-end [&>li]:text-lg">
                                <li>{$_("ui.ram.minimal")}: <b>{modpack.ram.minimal}</b></li>
                                <li>{$_("ui.ram.recommended")}: <b>{modpack.ram.recommended}</b></li>
                            </ul>
                        {/if}
                    </div>
                    <div class="w-full">
                        {#if modpack.links?.download}
                            <a href="{modpack.links.download}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-4 bg-text-dark rounded-lg p-4 motion-safe:desktop:hover:scale-110 duration-200">
                                {#if downloadIcon!=null}<img src="{downloadIcon}" alt="logo" class="brightness-0 w-[36px]">
                                {:else}<Globe color="#000000" size="30" />{/if}

                                <b class="text-lg text-secondary-dark">{$_($mobile ? "ui.view" : "ui.download")}</b>
                            </a>
                        {/if}

                        {#if modpack.links?.source}
                            <a href="{modpack.links.source}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 mt-4 motion-safe:desktop:hover:scale-110 duration-200">
                                {#if sourceIcon!=null}<img src="{sourceIcon}" alt="logo" class="brightness-0 invert w-[36px]">
                                {:else}<Globe color="#000000" size="30" />{/if}

                                <b class="text-lg">{$_("ui.source")}</b>
                            </a>
                        {/if}

                        {#if (!modpack.links?.download && !modpack.links?.source)}
                            {#if !partner || partnerPack?.links?.discord}
                                <a href="{partner ? partnerPack?.links?.discord : consts.SOCIALS.discord.url}" target="_blank" rel="noopener noreferrer" class="flex gap-3 items-center justify-center border-text-dark border-4 border-dashed rounded-lg p-4 motion-safe:hover:desktop:scale-105 duration-200" title="{$_(partner ? "ui.wipbigdiscord" : "ui.wipbigmm")}">
                                    <img src="{consts.WEBSITE_ICONS.discord}" alt="logo" class="brightness-0 invert w-[36px]">
                                    <b class="text-lg">{$_("ui.wip")}</b>
                                </a>
                            {:else}
                                <div class="flex items-center justify-center border-text-dark border-4 border-dashed rounded-lg p-4 motion-safe:desktop:hover:scale-105 duration-200 cursor-help" title="{$_("ui.wipbig")}">
                                    <b class="text-lg">{$_("ui.wip")}</b>
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</Portal>
