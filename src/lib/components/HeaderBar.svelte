<script lang="ts">
    import { base } from "$app/paths"
    import { page } from "$app/stores"
    import consts from "$lib/scripts/consts"
    import { lightMode, memeLocales, mobile, reducedMotion, scrollY, settingsOpened, sortedLocales, storedLocale } from "$lib/scripts/stores"
    import { Menu, SettingsIcon } from "lucide-svelte"
    import { onMount } from "svelte"
    import { locale, _ } from "svelte-i18n"
    import MobileSideBar from "./MobileSideBar.svelte";
    import { navigateCleanup, removeHash } from "$lib/scripts/utils";
    import ThemeToggle from "./ThemeToggle.svelte";

    // const settingsOpenByDefault : boolean = true // DEBUG, don't turn on in prod
    const settingsOpenByDefault : boolean = false

    let sidebar : MobileSideBar | null // Sidebar, mobile exclusive

    // Toggle settings or just disable
    let toggleSettings = (disable : boolean) => {
        $settingsOpened = disable ? false : !$settingsOpened
    }

    onMount(() => {
        document.addEventListener("click", e => {
            if (!(e.target! as HTMLElement).matches("#settings, #settings *, #settingsicon")) toggleSettings(true) // If the user clicks outside of the settings menu, close that shit
        })
        document.addEventListener("keydown", e => {
            if (e.key=="Escape") setTimeout(() => toggleSettings(true), 1) // If escape is pressed, close that shit (and by shit I mean settings)
        })
        scrollY.subscribe(n => {
            if ($page.url.pathname!="/projects" || n!=0) return
            toggleSettings(true) // If the header gets hidden in the projects page, close that shit (and by shit I mean you get it)
        })
    })
</script>

{#if !$mobile}
    <div class="fixed overflow-y-hidden z-50 w-[90%] {$lightMode ? "bg-header-light" : "bg-header-dark"} backdrop-blur-sm shadow-2xl shadow-black h-16 flex justify-between px-2 left-[50%] translate-x-[-50%]{["/", "/projects"].includes($page.url.pathname) && !$scrollY ? " translate-y-[-100%] shadow-none " : " "}motion-safe:duration-150 rounded-b-2xl" style="view-transition-name: _;" id="header">
        <a class="group flex items-center h-full" href="/{base}">
            <img src={consts.LOGO_URL} alt="Modern Modpacks logo" class="rounded-2xl p-2 duration-100 motion-safe:group-hover:rounded-[1.35rem]">
            <b>Modern Modpacks</b>
        </a>

        <span class="flex items-center mr-4 gap-10">
            {#each consts.PAGES as button}
            {@const currentPage = $page.url.pathname==button.link}
                <a href={currentPage ? "javascript:void(0)" : button.link} class="group relative h-full flex items-center" on:click={currentPage ? () => {
                    removeHash()
                    navigateCleanup()
                } : null}>
                    <p class="
                        {currentPage ? "font-bold scale-[125%]" : "font-semibold opacity-80"}
                        text-base animate-ease-out animate-alternate {$lightMode ? "group-hover:font-bold" : `group-hover:!text-${button.color}`} motion-safe:group-hover:scale-[125%]
                    " style="{$reducedMotion ? "" : "transition: transform 100ms;"}">{$_("ui.navbar."+button.title)}</p>
                    <div class="absolute bg-{button.color} w-full h-1.5 -bottom-2 group-hover:bottom-0 motion-safe:duration-100" />
                </a>
            {/each}

            <button class="ml-3 cursor-pointer h-full group" on:click={e => {e.stopPropagation(); toggleSettings(false)}}>
                <SettingsIcon class="duration-200 motion-safe:group-hover:-rotate-90" id="settingsicon"/>
            </button>
        </span>
    </div>

    <div class="
        fixed{settingsOpenByDefault || $settingsOpened ? " " : " opacity-0 pointer-events-none "}z-50 motion-safe:duration-150 top-20 right-20 w-56 p-5 shadow-2xl rounded-xl shadow-black {$lightMode ? "bg-header-light" : "bg-header-dark"} backdrop-blur-xl
        flex flex-col gap-2
        [&_p]:text-lg [&_p]:font-medium
    " id="settings">
        <h3 class="font-bold w-fit">{$_("ui.settings.title")}</h3>
        <p class="w-fit">{$_("ui.settings.language")}</p>
        <div class="
            grid grid-cols-2 gap-2
            [&>button]:h-10 [&>button]:rounded-xl [&>button]:duration-150
        ">
            {#each $sortedLocales as l}
                {@const name = $_("name", {locale: l})}
                <button class="{$locale==l ? ($lightMode ? "bg-text-light !text-selected-text-light" : "bg-text-dark !text-selected-text-dark") : "bg-black bg-opacity-20"}{name.length>8 ? " text-[0.8rem]" : ""}" on:click={() => {$storedLocale=l}}>{name}</button>
            {/each}
            <hr class="col-span-2 my-2">
            {#each $memeLocales as l}
             {@const name = $_("name", {locale: l})}
                <button class="{$locale==l ? ($lightMode ? "bg-text-light !text-selected-text-light" : "bg-text-dark !text-selected-text-dark") : "bg-black bg-opacity-20"}{name.length>8 ? " text-[0.8rem]" : ""}{l=="_upsidedown" ? " rotate-180" : ""}" on:click={() => {$storedLocale=l}}>{name}</button>
            {/each}
        </div>
        <span class="flex items-center justify-between mt-2">
            <p class="underline underline-offset-4 decoration-dotted" title="{$_("ui.settings.darkmodewarning")}">{$_("ui.settings.darkmode")}</p>
            <ThemeToggle />
        </span>
    </div>
{:else}
    <button on:click={sidebar?.toggle} class="fixed top-6 right-6 z-50 cursor-pointer {$lightMode ? "bg-secondary-light" : "bg-secondary-dark"} bg-opacity-75 p-3 rounded-full duration-300 ease-out{["/", "/projects"].includes($page.url.pathname) && !$scrollY ? " translate-y-[-200%] shadow-none" : ""}">
        <Menu size="28" />
    </button>
    <MobileSideBar bind:this={sidebar} />
{/if}