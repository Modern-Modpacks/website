<script lang="ts">
    import HeaderBar from "$lib/components/HeaderBar.svelte"
    import "../app.css"
    import { lightMode, memeLocales, mobile, mousePos, reducedMotion, scrollY, sortedLocales, storedLocale, upsideDownLocale } from "$lib/scripts/stores"
    import { _, addMessages, getLocaleFromNavigator, init, locales, locale } from "svelte-i18n"
    import consts from "$lib/scripts/consts"
    import { afterNavigate, onNavigate } from "$app/navigation"
    import { onMount } from "svelte"
    import { page } from "$app/stores"
    import { flatten, unflatten } from "flat"
    import Footer from "$lib/components/Footer.svelte"
    import { getContributorAvatar, navigateCleanup } from "$lib/scripts/utils";
    import membersJson from "$lib/json/members.json5"
    import translatorsJson from "$lib/json/translators.json5"
    import testersJson from "$lib/json/testers.json5"
    import type { Contributor } from "$lib/scripts/interfaces";
    import moment from "moment";

    // Update variables that check for media queries
    let updateMedia = () => {
        $reducedMotion = !!window.matchMedia("(prefers-reduced-motion: reduce)") && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        $mobile = !!window.matchMedia("(max-width: 1023px)") && window.matchMedia("(max-width: 1023px)").matches
    }

    // Add locales from the src/lib/json/langs folder
    // JSON5 ftw baby
    let langs = import.meta.glob("../lib/json/langs/*.json5", {eager: true})
    for (let l of Object.keys(langs)) {
        let dictsWithNewlines : {[key: string]: string} = (flatten(langs[l]) as {[key: string]: string})
        Object.keys(dictsWithNewlines).forEach(k => {
            let type = dictsWithNewlines[k].constructor
            if (type == Object || type == Boolean) return
            dictsWithNewlines[k] = dictsWithNewlines[k].replace(/\n/g, "<br/>") // Newline fuckery. Nothing special, html being html, continue scrolling
        })
        dictsWithNewlines = unflatten(dictsWithNewlines)

        addMessages(l.split("/").at(-1)?.replace(".json5", "")!, dictsWithNewlines)
    }
    // Get init svelte-i18n with english at first
    init(
        {
            fallbackLocale: "en",
            initialLocale: "en"
        }
    )

    // Init view transitions, awesome
    onNavigate(navigation => {
        if (!document.startViewTransition || $page.url.pathname=="/" || $mobile) return

        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            })
        })
    })

    let firstLoad : boolean = true
    onMount(() => {
        // Store locales (sorted, regular and meme)
        $sortedLocales = $locales.sort((a, _) => a=="en" ? -1 : 0)
        $memeLocales = $sortedLocales.filter(v => v.startsWith("_"))
        $sortedLocales = $sortedLocales.filter(v => !$memeLocales.includes(v))

        // Store mouse pos for later use
        document.addEventListener("mousemove", e => {
            $mousePos = {
                x: e.pageX,
                y: e.pageY
            }
        })

        // Update queries
        updateMedia()
        window.addEventListener("resize", updateMedia)

        // Preload all of the required images
        let preloadImgs = [
            // Map
            "https://static.planetminecraft.com/files/image/minecraft/project/2023/513/16677278-image_xl.webp",
            "https://raw.githubusercontent.com/Modern-Modpacks/assets/main/Icons/Other/pin.png"
        ]
        // Website icons
        Object.values(consts.WEBSITE_ICONS).forEach(i => {preloadImgs.push(i)})
        // Contrib avatars
        let contributors : Contributor[] = [...membersJson, ...Object.values(translatorsJson).flat(), ...testersJson]
        contributors.forEach(c => preloadImgs.push(getContributorAvatar(c)))
        // Translator flags
        Object.keys(translatorsJson).forEach(l => {preloadImgs.push(`https://flagcdn.com/256x192/${l}.png`)})
        // Compass in about us
        for(let i = 0; i < 32; i++) {
            preloadImgs.push(`https://raw.githubusercontent.com/misode/mcmeta/1.19.2-assets/assets/minecraft/textures/item/compass_${i.toString().padStart(2, "0")}.png`)
        }
        preloadImgs.forEach(i => {
            let img = document.createElement("img")
            img.src = i
            document.getElementById("imagecache")?.append(img)
        })

        // Funni upside down locale easter egg
        locale.subscribe(v => {
            let flipElements = ["h1", "h2", "h3", "h4", "li", "p", "b", "textarea::placeholder"]

            if (v=="_upsidedown") {
                $upsideDownLocale = true
                flipElements.forEach(c => {document.body.classList.add(`[&_${c}]:[rotate:180deg]`)})

                return
            }

            $upsideDownLocale = false
            flipElements.forEach(c => {document.body.classList.remove(`[&_${c}]:[rotate:180deg]`)})
        })
        // Change body theme
        lightMode.subscribe(l => {
            document.body.classList.add(l ? "light" : "dark")
            document.body.classList.remove(l ? "dark" : "light")
        })

        setTimeout(() => {
            // Setup acutal locale
            let initLocale : string | undefined = $storedLocale ? $storedLocale : getLocaleFromNavigator()?.split("-").at(-1)?.toLowerCase()
            $locale = $locales.includes(initLocale!) ? initLocale : "en"
            // When the locale is changed in local storage, hot reload it
            storedLocale.subscribe(v => {if (v) $locale = v})
            // Change moment.js locale
            locale.subscribe(l => {moment.locale(l ?? "en")})

            firstLoad = false
        }, 1)
    })
    afterNavigate(() => {
        if (!firstLoad) navigateCleanup()
    })
</script>

<style>
    :global(body)::-webkit-scrollbar {
        @apply scrollbar-hide
    }
    :global(body.dark) {
        @apply bg-primary-dark
    }
    :global(body.light) {
        @apply bg-primary-light
    }
    :global(*) {
        @apply text-text-dark font-raleway
    }
    :global(body.dark *) {
        @apply text-text-dark
    }
    :global(body.light *) {
        @apply text-text-light
    }
    :global(h1) {
        @apply font-extrabold text-6xl mobile:text-5xl
    }
    :global(h2) {
        @apply font-extrabold text-[2.75rem] leading-[3.25rem] mobile:text-3xl
    }
    :global(h3) {
        @apply font-medium text-3xl mobile:text-2xl
    }
    :global(h4) {
        @apply font-extralight text-xl
    }
    :global(p) {
        @apply text-xl mobile:text-sm max-w-[60ch] mobile:max-w-fit
    }
    :global(div) {
        @apply min-h-0
    }
    :global(img) {
        -webkit-user-drag: none;
        @apply h-full
    }
    
    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes fade-out {
        to {
            opacity: 0;
	}
    }
    @keyframes slide-left {
        to {
            transform: translateX(-20%);
        }
    }
    @keyframes slide-right {
        from {
            transform: translateX(20%);
        }
    }
    :root::view-transition-old(root) {
        animation: .5s ease-in both fade-out,
                   .5s ease-in both slide-left;
    }
    :root::view-transition-new(root) {
        animation: .5s ease-out both fade-in,
                   .5s ease-out both slide-right;
    }
</style>

<svelte:window bind:scrollY={$scrollY} />
<svelte:head>
    <link rel="icon" href={consts.ROUNDED_LOGO_URL} />
</svelte:head>

<div id="container" class="overflow-x-hidden">
    <HeaderBar />
    <slot />
    <Footer />

    <div id="imagecache" class="hidden" />
</div>