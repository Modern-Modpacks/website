<script lang="ts">
    import HeaderBar from "$lib/components/HeaderBar.svelte"
    import "../app.css"
    import { scrollY } from "$lib/scripts/stores"
    import { _, addMessages, getLocaleFromNavigator, init, register } from "svelte-i18n"
    import consts from "$lib/scripts/consts"

    let langs = import.meta.glob("../lib/json/langs/*.json", {eager: true})
    for(let l of Object.keys(langs)) {
        addMessages(l.split("/").at(-1)?.replace(".json", "")!, (langs[l] as any))
    }
    init(
        {
            fallbackLocale: "en-US",
            initialLocale: getLocaleFromNavigator()
        }
    )
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
    :global(p) {
        @apply text-xl w-[60ch]
    }
    :global(div) {
        @apply min-h-0
    }
    :global(img) {
        @apply h-full
    }
</style>

<svelte:window bind:scrollY={$scrollY} />
<svelte:head>
    <link rel="icon" href={consts.ROUNDED_LOGO_URL} />
</svelte:head>

<HeaderBar />
<slot />