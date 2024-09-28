<script lang="ts">
    import { lightMode, mobile, reducedMotion, upsideDownLocale } from "$lib/scripts/stores"
    import { onMount } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { inview } from "svelte-inview"
    import { linear } from "svelte/easing"
    import { draw } from "svelte/transition"
    import SocialsBar from "./SocialsBar.svelte";
    import consts from "$lib/scripts/consts";

    // Whether to show the MM logo svg
    let showMMIcon : boolean = false
    onMount(() => {setTimeout(() => {showMMIcon = $reducedMotion}, 1)}) // reducedMotion support
</script>

<div 
    class="px-[22vw] mobile:px-12 pt-14 mobile:pt-8 pb-8 [&>div]:w-full h-80 mobile:h-96 relative flex mobile:flex-col mobile:items-center justify-evenly gap-16 mobile:gap-4 {$lightMode ? "bg-footer-light" : "bg-footer-dark"}"
    use:inview={{threshold: $mobile ? .5 : .65}} on:inview_enter={() => {showMMIcon = true}} on:inview_leave={() => {if (!$reducedMotion) showMMIcon = false}}
>
    <div class="flex flex-col justify-evenly mobile:items-center [&>p]:text-lg mobile:[&>p]:text-sm [&_a]:!text-mm-lightblue [&_a:hover]:underline mobile:[&>*]:text-center{$upsideDownLocale ? " [&>*]:text-right" : ""}">
        <svg
            width="{$mobile ? 64 : 72}"
            height="{$mobile ? 64 : 72}"
            viewBox="0 0 16.933333 16.933333"
            version="1.1"
        >
            {#if showMMIcon}
                <path
                    transition:draw={{duration: $reducedMotion ? 0 : 2000, easing: linear}}
                    fill="#00000000"
                    stroke="{$lightMode ? "#000000" : "#ffffff"}"
                    stroke-width=.5
                    d="M 0.26455172,8.4666663 V 2.8191284 H 0.94806128 1.631571 V 3.8780416 4.9369551 H 2.3150804 2.9985903 V 5.6428973 6.3488396 H 4.0238545 5.049119 V 5.6428973 4.9369551 H 5.7326286 6.4161382 V 3.8780416 2.8191284 H 7.0996478 7.7831573 V 8.4666663 14.114205 H 7.0996478 6.4161382 V 10.231522 6.3488396 H 5.7326286 5.049119 v 0.7059423 0.705942 H 4.0238545 2.9985903 V 7.0547819 6.3488396 H 2.3150804 1.631571 v 3.8826824 3.882683 H 0.94806128 0.26455172 Z m 8.88562508,0 V 2.8191284 h 0.6835094 0.6835098 v 1.0589132 1.0589135 h 0.68351 0.683508 v 0.7059422 0.7059423 h 1.025266 1.025264 V 5.6428973 4.9369551 h 0.683508 0.683511 V 3.8780416 2.8191284 h 0.683508 0.683511 V 8.4666663 14.114205 H 15.985271 15.301763 V 10.231522 6.3488396 h -0.683511 -0.683508 v 0.7059423 0.705942 H 12.90948 11.884214 V 7.0547819 6.3488396 h -0.683508 -0.68351 v 3.8826824 3.882683 H 9.8336862 9.1501768 Z"
                />
            {/if}
        </svg>

        <h1 class="text-4xl mobile:text-2xl desktop:pb-4">Modern Modpacks</h1>
        <p>{@html $_("ui.footer.version")}</p>
        <p>{@html $_("ui.footer.opensource", {values: {link: "https://github.com/"+consts.REPO}})}</p>
        <p class="!text-mm-gray">© Modern Modpacks, 2024</p>
    </div>
    {#if !$mobile}
        <div class="flex flex-col items-end [&>span]:absolute [&>span]:bottom-10">
            <b class="text-2xl">Quick access</b>
            <div class="h-[63%] flex flex-col justify-evenly items-end [&>a]:w-fit">
                {#each [
                    {url: "https://github.com/Modern-Modpacks/website/issues/new", lang: "report"},
                    {url: `https://raw.githubusercontent.com/${consts.REPO}/v2/attribs.md`, lang: "attributions"},
                    {url: "https://stackshare.io/modern-modpacks/mm-stack", lang: "stack"},
                    {url: "https://www.youtube.com/watch?v=EJxCw3lDYiQ", lang: "cats"}
                ] as link}
                    <a href="{link.url}" target="_blank" rel="noopener noreferrer" class="opacity-50 hover:opacity-100 hover:underline motion-safe:duration-150">
                        <p class="text-base">{$_("ui.footer.links." + link.lang)}</p>
                    </a>
                {/each}
            </div>

            <SocialsBar />
        </div>
    {:else}
        <SocialsBar />
    {/if}

    <p class="absolute bottom-0 w-fit text-center !text-transparent text-sm">greg</p>
</div>