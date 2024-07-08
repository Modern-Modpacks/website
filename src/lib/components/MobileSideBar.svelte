<script lang="ts">
    import { page } from "$app/stores";
    import consts from "$lib/scripts/consts";
    import { memeLocales, popupOpened, sortedLocales, storedLocale, upsideDownLocale } from "$lib/scripts/stores";
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

<div bind:this={element} class="fixed translate-x-[100%] w-[100vw] h-[100vh] z-[60] bg-primary-dark motion-safe:duration-[400ms] ease-out">
    <button on:click={toggle} class="m-6 bg-secondary-dark rounded-full bg-opacity-65">
        <ArrowLeft size="48" />
    </button>

    <div class="absolute bottom-24 px-8 w-full">
        <span class="flex flex-col">
            {#each consts.PAGES as button}
                <a
                    href={button.link} on:click={toggle}
                    class="py-2 {$page.url.pathname=="/"+button.link ? `[&>p]:font-bold [&>p]:text-2xl [&>p]:text-${button.color}` : "[&>p]:font-semibold [&>p]:text-lg"}"
                >
                    <p>{$_("ui.navbar."+button.title)}</p>
                </a>
                <hr />
            {/each}
        </span>
        <span class="mt-6 px-4 flex justify-between items-center">
            <span class="before:content-[''] before:block before:absolute before:-z-10 before:w-32 before:h-14 before:rounded-full before:bg-black before:shadow-md before:shadow-black before:opacity-65">
                <select bind:value={$storedLocale} class="relative w-32 h-14 py-4 indent-4 border-r-[1rem] border-transparent rounded-full focus:outline-none bg-primary-dark bg-opacity-55 backdrop-blur-xl font-bold [&>option]:text-base{$_("name").length>8 ? " text-xs" : ""}{$upsideDownLocale ? " rotate-180" : ""}">
                    {#each $sortedLocales as l}
                        <option value="{l}">{$_("name", {locale: l})}</option>
                    {/each}
                    <hr>
                    {#each $memeLocales as l}
                        <option value="{l}">{$_("name", {locale: l})}</option>
                    {/each}
                </select>
            </span>
            <span class="rotate-180">
                <Basic lightFill="#f1af15" darkFill="#7d7d73" size="large" />
            </span>
        </span>
    </div>
</div>