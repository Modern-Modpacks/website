<script lang="ts">
    import members from "$lib/json/members.json5"
    import consts from "$lib/scripts/consts";
    import type { Member } from "$lib/scripts/interfaces";
    import { getMemberAvatar, getWebsiteIcon } from "$lib/scripts/utils";
    import { _ } from "svelte-i18n";
    import Tag from "./Tag.svelte"
    import { Globe } from "lucide-svelte";

    export let memberId : number
    let member : Member
    $: member = members[memberId]

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

<span class="w-72 flex flex-col gap-4">
    <img src="{getMemberAvatar(member)}" alt="avatar" class="rounded-3xl bg-primary-dark">
    <h2 class="w-fit">{member.name}</h2>
    <span class="flex flex-wrap gap-1.5 [&>p]:w-fit">
        {#each Object.entries(member.titles ?? []) as [i, title]}
            {@const color = possibleColors[(+i * Math.floor(possibleColors.length / Math.min(member.titles?.length ?? 0, possibleColors.length))) % possibleColors.length]}
            <Tag text="{$_("ui.titles."+title)}" color="mm-{color}"/>
        {/each}
    </span>
    {#if member.socials}
        <span class="flex gap-2.5">
            {#each member.socials as social}
            {@const icon = getWebsiteIcon(social)}
                <a href="{social}" target="_blank" rel="noopener noreferrer">
                    {#if icon}
                        <img src="{icon}" alt="website icon" class="h-10 brightness-0 invert duration-200 motion-safe:hover:desktop:opacity-40">
                    {:else}
                        <Globe size="40" class="duration-200 motion-safe:hover:desktop:opacity-40"/>
                    {/if}
                </a>
            {/each}
        </span>
    {/if}
</span>