<script lang="ts">
    import Marquee from "$lib/components/Marquee.svelte";
    import mems from "$lib/json/members.json5" 
    import MemberCard from "$lib/components/MemberCard.svelte";
    import { _ } from "svelte-i18n";
    import type { Member } from "$lib/scripts/interfaces";
    import { onMount } from "svelte";
    import { getMemberAvatar } from "$lib/scripts/utils";
    import { tweened, type Tweened } from "svelte/motion";
    import { sineIn, sineOut } from "svelte/easing";
    import { mobile, reducedMotion } from "$lib/scripts/stores";

    // Members, served just as typescript likes it
    let members : Member[] = mems

    // Calculations needed for THE WALL animation
    let wallUnitSize : number | null // The width and height of one image
    let wallRowCount : number | null // The amount of rows
    let wallScrollHeight : number = 0 // The height that is scrolled in the anim
    let recalculateWall = () => {
        wallUnitSize = window.innerWidth * .125
        wallRowCount = Math.ceil(Math.ceil(window.innerHeight * .95) / wallUnitSize) + members.length
        wallScrollHeight = ((wallUnitSize ?? 0) / 16) * members.length
    }

    // Variables needed for the member card animation
    const inDur : number = 500 // Appear duration
    const stayDur : number = 5000 // Stay duration
    const outDur : number = 1000 // Leave duration
    const outPercent : number = 150 // Translate percentage when the card is hidden
    const inPercent : number = 0 // Translate percentage when the card is shown
    const permMemberId : number | null = null // Permanent member id that doesn't change
    // const permMemberId : number | null = 0 // DEBUG, don't turn on in prod
    let cardAnimPlaying : boolean = false // Weather the card anim is playing
    let cardTransition : Tweened<number> = tweened(0)
    let cardIn : boolean = true // Weather the card is shown
    let mouseOverCard : boolean = false // Weather the mouse is hovering over the cards
    let memberId : number // The id of the shown member
    $: memberId = permMemberId ?? 0
    let cardCycle = () => { // Do a cycle of animation
        if (cardIn && mouseOverCard) {
            cardAnimPlaying = false
            return
        }
        cardAnimPlaying = true

        cardIn = !cardIn
        let dur = cardIn ? inDur : outDur

        if (cardIn) {
            memberId = (memberId + 1) % members.length
            if (!$mobile && !$reducedMotion) cardTransition.set(inPercent, {duration: dur, easing: sineOut})
        }
        else if (!$mobile && !$reducedMotion) cardTransition.set(outPercent, {duration: dur, easing: sineIn})

        setTimeout(cardCycle, dur + (stayDur * +cardIn))
    }
    let startCardCycles = () => {if (permMemberId==null) setTimeout(cardCycle, stayDur)} // Start card animations

    onMount(() => {
        // Recalculate wall on mount and resize
        recalculateWall()
        window.addEventListener("resize", recalculateWall)

        startCardCycles() // Start member card animation
    })
</script>

<div class="desktop:h-[95vh]">
    <div class="absolute w-full h-[95vh] -z-10 overflow-hidden [&>span]:flex [&>span]:flex-wrap">
        <Marquee baseAnimDur={10000 * members.length} animMin={0} bind:animMax={wallScrollHeight} vertical={true}>
            {#each [...Array(8 * (wallRowCount ?? 0)).keys()] as i}
                <img src="{getMemberAvatar(members[i % members.length])}" alt="" class="w-[12.5vw]">
            {/each}
        </Marquee>
    </div>

    <div class="w-full h-full desktop:pl-16 desktop:pt-8 flex mobile:flex-col justify-evenly items-center desktop:bg-gradient-to-r mobile:bg-black mobile:bg-opacity-80 from-[#000000f0] from-10% via-transparent to-70% to-[#000000f0]">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div class="w-full">
            <span class="block w-fit" on:mouseover={() => {mouseOverCard = true}} on:mouseleave={() => {mouseOverCard = false; if (!cardAnimPlaying) startCardCycles()}}>
                <span class="block w-fit" style="transform: translateX(-{$cardTransition}%);">
                    <MemberCard bind:memberId={memberId} />
                </span>
            </span>
        </div>

        <div class="flex flex-col gap-5 items-center w-full mobile:bg-primary-dark mobile:px-10 mobile:py-8 [&>*]:text-center">
            <h2>{$_("about.members.heading")}</h2>
            <p>{@html $_("about.members.desc")}</p>
        </div>
    </div>
</div>