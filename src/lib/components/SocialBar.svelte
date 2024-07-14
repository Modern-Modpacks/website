<script lang="ts">
    import consts, { icons } from "$lib/scripts/consts"
    import type { Social } from "$lib/scripts/interfaces"
    import BreathingIcon from "./BreathingIcon.svelte"

    export let header : boolean = false // Specifies Whether the social bar is in the header or in "about us", shortens the social list if in header
    const socials : {[key: string]: Social} = consts.SOCIALS // Socials, digested for TS
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span class="{header ? "mt-2 " : "mobile:grid "}group flex gap-3 mobile:gap-4 w-fit mobile:grid-flow-col mobile:grid-rows-2">
    {#each Object.entries(Object.keys(
        Object.fromEntries(Object.entries(socials).filter(([_k, v]) => v.header || !header))
    )) as [i, k]}
    {@const social = socials[k]}
        <BreathingIcon duration={2000} minScale={85} maxScale={100} delay={1500 + (400 * +i)} play={header} class="duration-200 desktop:group-hover:!scale-100">
            <a href="{social.url}" target="_blank" rel="noopener noreferrer" title="{social.title}" class="{header ? "opacity-0 translate-y-10 duration-[.5s]" : "rounded-full bg-white block p-1.5 motion-safe:desktop:hover:scale-125 duration-300"}" style="{header ? `transition-delay: ${1 + (.05 * +i * +header)}s;` : ""}">
                <img src="{icons[k]}" id="animinheader" alt="website logo" class="{header ? "h-10 mobile:h-9 invert motion-safe:hover:invert-[55%]" : "h-5 mobile:h-6 opacity-90"} opacity-[inherit] brightness-0 duration-200">
            </a>
        </BreathingIcon>
    {/each}
</span>