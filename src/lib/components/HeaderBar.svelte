<script lang="ts">
    import { base } from "$app/paths"
    import { page } from "$app/stores"
    import consts from "$lib/scripts/consts"
    import { scrollY, storedLocale } from "$lib/scripts/stores"
    import { SettingsIcon } from "lucide-svelte"
    import { onMount } from "svelte"
    import { locales, locale, _ } from "svelte-i18n"
    import Basic from "svelte-toggles/src/Basic"

    // const settingsOpenByDefault : boolean = true // DEBUG
    const settingsOpenByDefault : boolean = false

    let toggleSettings = (disable : boolean) => {
        let settingsClasses : DOMTokenList | undefined = document.getElementById("settings")?.classList
        let settingsIconClasses : DOMTokenList | undefined = document.getElementById("settingsicon")?.classList

        if (disable) {
            settingsClasses?.add("opacity-0", "pointer-events-none")
            settingsIconClasses?.remove("motion-safe:!-rotate-180", "motion-safe:group-hover:!-rotate-180")
            
            return
        }

        settingsClasses?.toggle("opacity-0")
        settingsClasses?.toggle("pointer-events-none")
        settingsIconClasses?.toggle("motion-safe:!-rotate-180")
        settingsIconClasses?.toggle("motion-safe:group-hover:!-rotate-180")
    }

    onMount(() => {
        document.addEventListener("click", e => {
            let target : HTMLElement = e.target as HTMLElement
            if (!target.matches("#settings, #settings *, #settingsicon")) toggleSettings(true)
        })
        scrollY.subscribe(n => {
            if ($page.url.pathname!="/projects" || n!=0) return
            toggleSettings(true)
        })
    })
</script>

<div class="fixed z-50 w-[90%] bg-header-dark backdrop-blur-sm shadow-2xl shadow-black h-16 flex justify-between px-2 left-[50%] translate-x-[-50%]{["/", "/projects"].includes($page.url.pathname) && !$scrollY ? " translate-y-[-100%] shadow-none " : " "}motion-safe:duration-150 rounded-b-2xl" style="view-transition-name: _;" id="header">
    <a class="group flex items-center h-full" href="{base}">
        <img src={consts.LOGO_URL} alt="logo" class="rounded-2xl p-2 duration-100 motion-safe:group-hover:rounded-[1.35rem]">
        <b>Modern Modpacks</b>
    </a>

    <span class="flex items-center h-full mr-4 gap-10
        [&>a]:relative motion-safe:[&>a]:duration-100 [&>a]:animate-ease-out [&>a]:animate-alternate
        hover:[&>a]:scale-[120%]
        after:[&>a]:content-[''] after:[&>a]:block after:[&>a]:absolute after:[&>a]:bottom-[-60%] motion-safe:after:[&>a]:duration-[.125s] after:[&>a]:h-2 after:[&>a]:w-full after:[&>a]:scale-y-0 after:[&>a]:origin-bottom
        after:hover:[&>a]:scale-y-[50%]
    ">
        {#each [
            {link: "projects", title: "projects", color: "mm-red"},
            {link: "about", title: "aboutus", color: "mm-yellow"},
            {link: "blog", title: "blog", color: "mm-lime"},
            {link: "https://status.modernmodpacks.site", title: "status", color: "mm-lightblue"}
        ] as button}
            <a 
                href={button.link}
                class="{$page.url.pathname=="/"+button.link ? "font-bold scale-[120%]" : "font-semibold opacity-80"} hover:text-{button.color} after:bg-{button.color}"
            >{$_("ui.navbar."+button.title)}</a>
        {/each}

        <button class="ml-3 cursor-pointer h-full group" on:click={e => {e.stopPropagation(); toggleSettings(false)}}>
            <SettingsIcon class="duration-200 motion-safe:group-hover:-rotate-90" id="settingsicon"/>
        </button>
    </span>
</div>

<div class="
    fixed{settingsOpenByDefault ? " " : " opacity-0 pointer-events-none "}z-50 motion-safe:duration-150 top-20 right-20 w-56 p-5 shadow-2xl rounded-xl shadow-black bg-header-dark backdrop-blur-xl
    flex flex-col gap-1
    [&_p]:text-lg [&_p]:font-medium
" id="settings">
    <h3 class="font-bold">{$_("ui.settings.title")}</h3>
    <p>{$_("ui.settings.language")}</p>
    <div class="
        grid grid-cols-2 gap-2
        [&>button]:h-10 [&>button]:rounded-xl [&>button]:duration-100
    ">
        {#each $locales.sort((a, _) => a=="en" ? -1 : 0) as l}
            <button class="{$locale==l ? "bg-text-dark text-selected-text-dark" : ""}" on:click={() => {$storedLocale=l; $locale=l}}>{$_("name", {locale: l})}</button>
        {/each}
    </div>
    <span class="flex items-center">
        <p>{$_("ui.settings.darkmode")}</p>
        <Basic lightFill="#f1af15" darkFill="#7d7d73" />
    </span>
</div>