<script lang="ts">
    import type { Coordinates, Mod } from "$lib/scripts/interfaces";
    import { contextMenuOpenedBy, mobile, reducedMotion } from "$lib/scripts/stores"
    import { X } from "lucide-svelte";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import Portal from "svelte-portal";
    import type { Writable } from "svelte/store";

    export let aboutToClose : boolean = true // Set before $contextMenuOpenedBy is unset, required by the parent to determine if it's time to continue the spin anim
    export let spinAnimHovered : boolean = false // Weather the parent is hovered, if not and the context menu is escaped, continue the animation
    export let shouldSpinAnimPlay : Writable<boolean>

    let element : HTMLElement | null // The main div
    let bg : HTMLElement | null // The blur background
    let contextmenu : HTMLElement | null // The actual context menu
    let cross : HTMLElement | null // The cross button that only appears on mobile

    let mod : Mod | null // Info about which mod should be shown
    let coords : Coordinates | null // Where the menu should be opened

    // Enable/disable the context menu
    export const toggle = (i : number | null, m: Mod | null, c : Coordinates | null) => {
        aboutToClose = !aboutToClose

        if ($contextMenuOpenedBy==null) {
            $contextMenuOpenedBy = i
            mod = m
            coords = c
        }
        else {
            setTimeout(() => {if (aboutToClose) $contextMenuOpenedBy = null}, 200)
            if (!spinAnimHovered || $mobile) $shouldSpinAnimPlay = true
        }

        element?.classList?.toggle("pointer-events-none")
        bg?.classList?.toggle("opacity-0")
        contextmenu?.classList.toggle("grid-rows-[0fr]")
        contextmenu?.classList.toggle("grid-rows-[1fr]")

        if ($mobile) {
            cross?.classList?.toggle("pointer-events-none")
            cross?.classList?.toggle("opacity-0")
        }
    }
    
    // Closing the context menu through various means
    onMount(() => {
        document.addEventListener("click", e => { // Clicking outside of it
            if ($contextMenuOpenedBy!=null && !(e.target! as HTMLElement).matches("#contextmenu *, #mod")) toggle(null, null, null)
        })
        document.addEventListener("keydown", e => { // Pressing esc
            if ($contextMenuOpenedBy!=null && e.key=="Escape") toggle(null, null, null)
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={element} id="contextmenucontainer" class="pointer-events-none">
    <div bind:this={bg} class="opacity-0 motion-safe:duration-200 backdrop-blur-xl w-full h-full absolute z-20" />
    <Portal target="{$mobile ? "#contextmenucontainer" : "body"}">
        <div bind:this={contextmenu} id="{!$mobile ? "contextmenu" : ""}" class="absolute top-0 mobile:mt-[25vh] z-50 grid grid-rows-[0fr] shadow-black mobile:bg-gradient-to-b mobile:from-black mobile:bg-opacity-50 desktop:shadow-xl dekstop:rounded-xl" style="{!$mobile ? `transform: translate(${coords?.x}px, ${coords?.y}px); ` : ""}{!$reducedMotion ? "transition: grid-template-rows 200ms;" : ""}">
            <div class="overflow-hidden mobile:w-[100vw] mobile:flex mobile:justify-center">
                <div id="{$mobile ? "contextmenu" : ""}" class="bg-header-dark mobile:bg-transparent desktop:backdrop-blur-lg p-2 desktop:rounded-xl w-fit mobile:h-[55vh] mobile:flex mobile:flex-col mobile:items-center mobile:justify-evenly">
                    {#if $mobile}
                        <button bind:this={cross} class="pointer-events-none opacity-0 absolute right-4 top-4 duration-200" on:click={() => {toggle(null, null, null)}}>
                            <X size="28" />
                        </button>

                        <img src="{mod?.icon_url}" alt="project logo" class="h-[30%] aspect-square">
                    {/if}
                    <b class="text-2xl mobile:text-xl">{mod?.name}</b>
                    <p class="text-lg w-[20ch] my-2">{mod?.summary}</p>

                    <span class="[&>hr]:opacity-50 [&>a]:text-lg [&>a]:font-semibold [&>a]:duration-150 motion-safe:desktop:[&>a:hover]:text-xl">
                        {#each [
                            {name: "CurseForge", link: "https://curseforge.com/minecraft/mc-mods/"+mod?.slug},
                            {name: "CurseRinth", link: "https://curserinth-tizu.vercel.app/mod/mod__"+mod?.slug},
                            {name: "Modrinth", link: "https://modrinth.com/mod/"+mod?.slug},
                            {name: "GitHub", link: mod?.link_urls.source.url}
                        ] as url}
                            <a href="{url.link}" target="_blank" rel="noopener noreferrer">{$_("ui.openon")} {url.name}</a>
                            {#if url.name.toLowerCase()!="github"}<hr />{/if}
                        {/each}
                    </span>
                </div>
            </div>
        </div>
    </Portal>
</div>