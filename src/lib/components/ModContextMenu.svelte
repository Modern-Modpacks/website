<script lang="ts">
    import { contextMenuOpenedBy } from "$lib/scripts/stores"
    import { onMount } from "svelte";

    let element : HTMLElement | null // The main div
    export let aboutToClose : boolean = true // Set before $contextMenuOpenedBy is unset, required by the parent to determine if it's time to continue the spin anim
    export let spinAnimHovered : boolean = false // Weather the parent is hovered, if not and the context menu is escaped, continue the animation
    export let doAllBarrelRolls : () => void // Spin all layers function passed by the parent

    // Enable/disable the context menu
    export const toggle = (i : number | null) => {
        aboutToClose = !aboutToClose

        if ($contextMenuOpenedBy==null) $contextMenuOpenedBy = i
        else {
            setTimeout(() => {$contextMenuOpenedBy = null}, 200)
            if (!spinAnimHovered) doAllBarrelRolls()
        }
        
        let classes = element?.classList

        classes?.toggle("opacity-0")
        classes?.toggle("pointer-events-none")
    }
    
    // Closing the context menu through various means
    onMount(() => {
        document.addEventListener("click", e => { // Clicking outside of it
            let target : HTMLElement = e.target as HTMLElement
            if ($contextMenuOpenedBy!=null && !target.matches("#contextmenu *, #mod")) toggle(null)
        })
        document.addEventListener("keydown", e => { // Pressing esc
            if ($contextMenuOpenedBy!=null && e.key=="Escape") toggle(null)
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={element} id="contextmenubg" class="motion-safe:duration-200 opacity-0 pointer-events-none backdrop-blur-xl w-full h-full absolute z-20">

</div>