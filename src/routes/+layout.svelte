<script lang="ts">
    import HeaderBar from "$lib/components/HeaderBar.svelte"
    import "../app.css"
    import { reducedMotion, scrollY } from "$lib/scripts/stores"
    import { _, addMessages, getLocaleFromNavigator, init, locales } from "svelte-i18n"
    import consts from "$lib/scripts/consts"
    import { onNavigate } from "$app/navigation"
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    onMount(() => {
        $reducedMotion = !!window.matchMedia(`(prefers-reduced-motion: reduce)`) && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
    })

    let langs = import.meta.glob("../lib/json/langs/*.json", {eager: true})
    for(let l of Object.keys(langs)) {
        addMessages(l.split("/").at(-1)?.replace(".json", "")!, (langs[l] as any))
    }
    let locale : string | null = getLocaleFromNavigator()
    init(
        {
            fallbackLocale: "en",
            initialLocale: $locales.includes(locale!) ? locale : "en"
        }
    )

    onNavigate(navigation => {
        if (!document.startViewTransition || $page.url.pathname=="/") return

        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            })
        })
    })
</script>

<style>
    :global(body) {
        @apply bg-primary-dark
    }
    :global(body)::-webkit-scrollbar {
        @apply scrollbar-hide
    }
    :global(*) {
        @apply text-text-dark font-raleway
    }
    :global(h1) {
        @apply font-bold text-6xl
    }
    :global(h2) {
        @apply font-medium text-3xl
    }
    :global(h3) {
        @apply font-bold text-2xl
    }
    :global(p) {
        @apply text-xl w-[60ch]
    }
    :global(div) {
        @apply min-h-0
    }
    :global(img) {
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

<HeaderBar />
<slot />