<script lang="ts">
    import HeaderBar from "$lib/components/HeaderBar.svelte"
    import "../app.css"
    import { mobile, mousePos, reducedMotion, scrollY, storedLocale } from "$lib/scripts/stores"
    import { _, addMessages, getLocaleFromNavigator, init, locales } from "svelte-i18n"
    import consts from "$lib/scripts/consts"
    import { onNavigate } from "$app/navigation"
    import { onMount } from "svelte"
    import { page } from "$app/stores"
    import { flatten, unflatten } from "flat"
    import Footer from "$lib/components/Footer.svelte"

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
            if (dictsWithNewlines[k].constructor == Object) return
            dictsWithNewlines[k] = dictsWithNewlines[k].replace(/\n/g, "<br/>") // Newline fuckery. Nothing special, html being html, continue scrolling
        })
        dictsWithNewlines = unflatten(dictsWithNewlines)

        addMessages(l.split("/").at(-1)?.replace(".json5", "")!, dictsWithNewlines)
    }
    // Get locale and init svelte-i18n
    let locale : string | undefined = $storedLocale ? $storedLocale : getLocaleFromNavigator()?.split("-").at(-1)?.toLowerCase()
    init(
        {
            fallbackLocale: "en",
            initialLocale: $locales.includes(locale!) ? locale : "en"
        }
    )

    // Init view transitions, awesome
    onNavigate(navigation => {
        if (!document.startViewTransition || $page.url.pathname=="/") return

        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            })
        })
    })

    onMount(() => {
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
    })
</script>

<style>
    :global(body)::-webkit-scrollbar {
        @apply scrollbar-hide
    }
    :global(body) {
        @apply bg-primary-dark
    }
    :global(*) {
        @apply text-text-dark font-raleway
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

<div id="container" class="overflow-x-hidden h-fit">
    <HeaderBar />
    <slot />
    <Footer />
</div>