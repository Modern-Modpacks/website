<script lang="ts">
    import members from "$lib/json/members.json5"
    import consts from "$lib/scripts/consts";
    import type { Member } from "$lib/scripts/interfaces";
    import { getContributorAvatar, getWebsiteIcon } from "$lib/scripts/utils";
    import { _ } from "svelte-i18n";
    import Tag from "./Tag.svelte"
    import { Globe } from "lucide-svelte";

    export let memberId : number

    let member : Member
    $: member = members[memberId]
    let socials : string[]
    $: socials = ["https://github.com/"+member.github.username, ...(member.socials ?? [])].sort((a, b) => getWebsiteIcon(a)[1] ? 0 : -1)

    // Filtered colors for tags
    const removeColors : string[] = [
        "green",
        "cyan",
        "pink",
        "gray",
        "lightgray",
        "white",
        "black",
        "brown"
    ]
    const possibleColors : string[] = consts.COLORS.filter(v => !removeColors.includes(v))
</script>

<span class="w-[25rem] mobile:w-[100vw] mobile:h-[90vh] flex flex-col mobile:items-center mobile:justify-center gap-4">
    <img src="{getContributorAvatar(member)}" alt="{member.name}'s avatar" class="h-72 w-72 mobile:h-52 mobile:w-52 rounded-3xl bg-primary-dark">
    <h2 class="w-fit">{member.name}</h2>
    <span class="flex flex-wrap mobile:justify-center gap-2.5 [&>p]:w-fit">
        {#each Object.entries(member.titles ?? []) as [i, title]}
            {@const color = possibleColors[(+i * Math.floor(possibleColors.length / Math.min(member.titles?.length ?? 0, possibleColors.length))) % possibleColors.length]}
            {@const titleTranslate = title.startsWith("c_") ? $_("ui.chief") + " " + $_("ui.titles." + title.replace(/^c_/, "")).toLowerCase() : $_("ui.titles." + title)}

            <Tag text="{titleTranslate}" color="mm-{color}"/>
        {/each}
    </span>
    <span class="flex gap-2.5">
        {#each socials as social}
        {@const icon = getWebsiteIcon(social)}
            <a href="{social}" target="_blank" rel="noopener noreferrer">
                {#if icon[0]}
                    <img src="{icon[1]}" alt="{icon[0]} icon" class="h-10 brightness-0 invert duration-200 motion-safe:hover:desktop:opacity-40">
                {:else}
                    <Globe size="40" class="duration-200 motion-safe:hover:desktop:opacity-40"/>
                {/if}
            </a>
        {/each}
    </span>
</span>