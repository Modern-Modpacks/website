<script lang="ts">
    import type { Coordinates, Mod } from "$lib/scripts/interfaces";
    import { contextMenuOpenedBy } from "$lib/scripts/stores"
    import { targetToHTML } from "$lib/scripts/utils";
    import { onMount } from "svelte";
    import Portal from "svelte-portal";

    export let aboutToClose : boolean = true // Set before $contextMenuOpenedBy is unset, required by the parent to determine if it's time to continue the spin anim
    export let spinAnimHovered : boolean = false // Weather the parent is hovered, if not and the context menu is escaped, continue the animation
    export let doAllBarrelRolls : () => void // Spin all layers function passed by the parent

    let element : HTMLElement | null // The main div
    let bg : HTMLElement | null // The blur background
    let contextmenu : HTMLElement | null // The actual context menu

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
            if (!spinAnimHovered) doAllBarrelRolls()
        }

        element?.classList?.toggle("pointer-events-none")
        // element?.classList?.toggle("opacity-0")
        bg?.classList?.toggle("opacity-0")
        contextmenu?.classList.toggle("grid-rows-[0fr]")
        contextmenu?.classList.toggle("grid-rows-[1fr]")
    }
    
    // Closing the context menu through various means
    onMount(() => {
        document.addEventListener("click", e => { // Clicking outside of it
            if ($contextMenuOpenedBy!=null && !targetToHTML(e.target)?.matches("#contextmenu *, #mod")) toggle(null, null, null)
        })
        document.addEventListener("keydown", e => { // Pressing esc
            if ($contextMenuOpenedBy!=null && e.key=="Escape") toggle(null, null, null)
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={element} class="pointer-events-none">
    <div bind:this={bg} class="opacity-0 motion-safe:duration-200 backdrop-blur-xl w-full h-full absolute z-20" />
    <Portal target="body">
        <div bind:this={contextmenu} id="contextmenu" class="absolute top-0 z-50 grid grid-rows-[0fr]" style="transform: translate({coords?.x}px, {coords?.y}px); transition: grid-template-rows 200ms;">
            <div class="overflow-hidden">
                <div class="bg-black w-fit">
                    <a href="{mod?.link_urls.source.url}">{mod?.name}</a>
                </div>
            </div>
        </div>
    </Portal>
</div>