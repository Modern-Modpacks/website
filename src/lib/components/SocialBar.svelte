<script lang="ts">
    import consts from "$lib/scripts/consts"
    import type { Social } from "$lib/scripts/interfaces"

    export let header : boolean = false

    const socials : {[key: string]: Social} = consts.SOCIALS
    const icons : {[key: string]: string} = consts.WEBSITE_ICONS
</script>

<span class="{header ? "mt-4 " : ""}flex gap-3">
    {#each Object.entries(Object.keys(socials)) as [i, k]}
    {@const social = socials[k]}
        {#if !header || social.header}
            <a href="{social.url}" title="{social.title}" class="{header ? " opacity-0 translate-y-10 duration-[.5s]" : ""}" style="transition-delay: {1 + (.05 * +i * +header)}s;">
                <img src="{icons[k]}" id="social" alt="website logo" class="h-10 brightness-0 invert motion-safe:hover:invert-[55%] duration-200">
            </a>
        {/if}
    {/each}
</span>