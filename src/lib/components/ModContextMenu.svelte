<script lang="ts">
    import { contextMenuOpenedBy } from "$lib/scripts/stores"
    import { onMount } from "svelte";

    let element : HTMLElement | null
    export let aboutToClose : boolean = true

    export const toggle = (i : number | null) => {
        aboutToClose = !aboutToClose

        if ($contextMenuOpenedBy==null) $contextMenuOpenedBy = i
        else setTimeout(() => {$contextMenuOpenedBy = null}, 200)

        let classes = element?.classList

        classes?.toggle("opacity-0")
        classes?.toggle("pointer-events-none")
    }
    
    onMount(() => {
        document.addEventListener("click", e => {
            let target : HTMLElement = e.target as HTMLElement
            if ($contextMenuOpenedBy!=null && !target.matches("#contextmenu, #mod")) toggle(null)
        })
        document.addEventListener("keydown", e => {
            if ($contextMenuOpenedBy!=null && e.key=="Escape") toggle(null)
        })
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={element} class="duration-200 opacity-0 pointer-events-none backdrop-blur-xl w-full h-full absolute z-20">

</div>