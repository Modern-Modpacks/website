<script lang="ts">
    import { page } from "$app/stores";
    import consts from "$lib/scripts/consts";
    import { popupOpened } from "$lib/scripts/stores";
    import { toggleScroll } from "$lib/scripts/utils";
    import { ArrowLeft } from "lucide-svelte";
    import { _ } from "svelte-i18n";
    import Basic from "svelte-toggles/src/Basic";

    let element : HTMLElement | null // The actual sidebar

    // Toggle sidebar
    export const toggle = () => {
        element?.classList.toggle("translate-x-[100%]")
        if (!$popupOpened) toggleScroll(false)
    }
</script>

<div bind:this={element} class="fixed translate-x-[100%] w-[100vw] h-[100vh] z-[60] bg-primary-dark duration-[400ms] ease-out">
    <button on:click={toggle} class="m-6 bg-secondary-dark rounded-full bg-opacity-65">
        <ArrowLeft size="48" />
    </button>

    <div class="absolute bottom-24 px-8 w-full">
        <span class="flex flex-col">
            {#each consts.PAGES as button}
                <a 
                    href={button.link} on:click={toggle}
                    class="py-2 {$page.url.pathname=="/"+button.link ? `font-bold text-2xl text-${button.color}` : "font-semibold text-lg"}"
                >{$_("ui.navbar."+button.title)}</a>
                <hr />
            {/each}
        </span>
        <span class="mt-6 px-4 flex justify-between items-center">
            <select name="" id="" class="w-40"></select>
            <Basic lightFill="#f1af15" darkFill="#7d7d73" size="large" />
        </span>
    </div>
</div>