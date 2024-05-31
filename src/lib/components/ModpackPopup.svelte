<script lang="ts">
    import { popupOpened } from "$lib/scripts/stores"
    import { X } from "lucide-svelte";
    import { onMount } from "svelte"
    import Portal from "svelte-portal"

    export const toggle = () => {
        $popupOpened = !$popupOpened
        shown = !shown

        document.body.style.overflowY = shown ? "hidden" : "auto"
    }
    let shown : boolean = false

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
        <div class="bg-primary-dark shadow-black shadow-2xl rounded-xl h-[80vh] w-[40vw] duration-500 {shown ? "scale-100" : "scale-75"}" on:click={e => {e.stopPropagation()}}>
            <button class="absolute right-5 top-5 motion-safe:hover:rotate-180 duration-[350ms] ease-out cursor-pointer bg-black bg-opacity-30 rounded-full p-1" on:click={toggle}>
                <X size="32" />
            </button>
        </div>
    </div>
</Portal>