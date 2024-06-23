<script lang="ts">
    import HeaderBar from "$lib/components/HeaderBar.svelte"
    import "../app.css"
    import { mousePos, reducedMotion, scrollY, storedLocale } from "$lib/scripts/stores"
    import { _, addMessages, getLocaleFromNavigator, init, locales } from "svelte-i18n"
    import consts from "$lib/scripts/consts"
    import { onNavigate } from "$app/navigation"
    import { onMount } from "svelte"
    import { page } from "$app/stores"
    import { flatten, unflatten } from "flat"
    import { draw } from "svelte/transition";
    import { inview } from "svelte-inview";
    import { sineOut } from "svelte/easing";

    // Check for reducedmotion
    onMount(() => {
        $reducedMotion = !!window.matchMedia(`(prefers-reduced-motion: reduce)`) && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
    })

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

    // Animate MM icon in the footer
    const MMIconDuration : number = 2000
    let MMIconInterval : number | null
    let showMMIcon : boolean = false
    let startMMIconAnimation = () => {
        if ($reducedMotion) return

        showMMIcon = !showMMIcon
        MMIconInterval = setInterval(() => {showMMIcon = !showMMIcon}, MMIconDuration + 1000)
    }

    // Store mouse pos for later use
    onMount(() => {
        document.addEventListener("mousemove", e => {
            $mousePos = {
                x: e.pageX,
                y: e.pageY
            }
        })

        // reducedMotion support for the MM icon anim
        setTimeout(() => {
            showMMIcon = $reducedMotion
        }, 1)
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
        @apply font-extrabold text-6xl
    }
    :global(h2) {
        @apply font-extrabold text-[2.75rem] leading-[3.25rem]
    }
    :global(h3) {
        @apply font-medium text-3xl
    }
    :global(h4) {
        @apply font-extralight text-xl
    }
    :global(p) {
        @apply text-xl w-[60ch]
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

<HeaderBar />
<slot />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    class="w-full h-[20vh] flex flex-col gap-2 justify-center items-center bg-footer-dark"
    use:inview={{unobserveOnEnter: true}} on:inview_enter={startMMIconAnimation}
    on:mouseenter={() => {if (MMIconInterval) {clearInterval(MMIconInterval)}; showMMIcon = true}} on:mouseleave={startMMIconAnimation}
>
    <svg
        width="96"
        height="96"
        viewBox="0 0 16.933333 16.933333"
        version="1.1"
    >
        {#if showMMIcon}
            <path
                transition:draw={{duration: MMIconDuration, easing: sineOut}}
                fill="#00000000"
                stroke="#ffffff"
                stroke-width=.5
                d="M 0.26455172,8.4666663 V 2.8191284 H 0.94806128 1.631571 V 3.8780416 4.9369551 H 2.3150804 2.9985903 V 5.6428973 6.3488396 H 4.0238545 5.049119 V 5.6428973 4.9369551 H 5.7326286 6.4161382 V 3.8780416 2.8191284 H 7.0996478 7.7831573 V 8.4666663 14.114205 H 7.0996478 6.4161382 V 10.231522 6.3488396 H 5.7326286 5.049119 v 0.7059423 0.705942 H 4.0238545 2.9985903 V 7.0547819 6.3488396 H 2.3150804 1.631571 v 3.8826824 3.882683 H 0.94806128 0.26455172 Z m 8.88562508,0 V 2.8191284 h 0.6835094 0.6835098 v 1.0589132 1.0589135 h 0.68351 0.683508 v 0.7059422 0.7059423 h 1.025266 1.025264 V 5.6428973 4.9369551 h 0.683508 0.683511 V 3.8780416 2.8191284 h 0.683508 0.683511 V 8.4666663 14.114205 H 15.985271 15.301763 V 10.231522 6.3488396 h -0.683511 -0.683508 v 0.7059423 0.705942 H 12.90948 11.884214 V 7.0547819 6.3488396 h -0.683508 -0.68351 v 3.8826824 3.882683 H 9.8336862 9.1501768 Z"
            />
        {/if}
    </svg>

    <p class="w-auto font-semibold [&>a]:text-mm-lightblue [&>a:hover]:underline">{@html $_("credits")}</p>
</div>