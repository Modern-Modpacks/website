<script lang="ts">
    import Marquee from "$lib/components/Marquee.svelte";
    import mems from "$lib/json/members.json5" 
    import MemberCard from "$lib/components/MemberCard.svelte";
    import { _, locale, locales } from "svelte-i18n";
    import type { Member, Pin } from "$lib/scripts/interfaces";
    import { onMount } from "svelte";
    import { getMemberAvatar } from "$lib/scripts/utils";
    import { tweened, type Tweened } from "svelte/motion";
    import { sineIn, sineOut } from "svelte/easing";
    import { activatedPin, mobile, reducedMotion } from "$lib/scripts/stores";
    import consts from "$lib/scripts/consts";
    import TranslatorMap from "$lib/components/TranslatorMap.svelte";
    import { writable, type Writable } from "svelte/store";

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
    let cardAnimPlaying : boolean = false // Whether the card anim is playing
    let cardTransition : Tweened<number> = tweened(0)
    let cardIn : boolean = true // Whether the card is shown
    let mouseOverCard : boolean = false // Whether the mouse is hovering over the cards
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

    let map : HTMLElement | null // One of the images for the scrolling map
    let lastActivePin : Pin | null // Last activated pin
    let mapSidebarShown : boolean = false // Whether the sidebar with info is shown
    let mapShouldPlay : Writable<boolean> = writable(true) // Whether the map marquee should play, based on whether a pin is active on the it
    activatedPin.subscribe(v => {
        mapSidebarShown = false

        if (v!=null) {
            setTimeout(() => {
                lastActivePin = v
                mapSidebarShown = true
            }, 500 * +!$mapShouldPlay)
        }

        $mapShouldPlay = v==null
    })

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

    <div class="w-full h-full desktop:pl-16 desktop:pt-8 flex mobile:flex-col justify-evenly items-center desktop:bg-gradient-to-r mobile:bg-black mobile:bg-opacity-80 from-[#000000f0] from-15% via-transparent to-60% to-[#000000f0]">
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
<div class="relative w-full desktop:h-[670px] flex mobile:flex-col-reverse bg-secondary-dark">
    <div class="relative z-10 w-[60%] mobile:w-full h-full mobile:h-fit bg-gradient-to-r mobile:bg-gradient-to-t from-primary-dark from-70% mobile:from-[92.5%] pointer-events-none">
        <div class="flex flex-col gap-5 items-center justify-center w-fit h-full py-8 mobile:pt-[5.5rem] desktop:ml-10 mobile:px-10 [&>*]:text-center pointer-events-auto">
            <h2>{$_("about.translators.heading")}</h2>
            <p>{@html $_("about.translators.desc")}</p>
        </div>
    </div>
    <div class="absolute left-0 top-0 w-[42.5%] h-full z-20 duration-300 ease-out {$activatedPin ? "backdrop-blur-xl" : "pointer-events-none"}">
        <div class="{mapSidebarShown ? "translate-x-0" : "translate-x-[-100%]"} duration-500 ease-in-out h-full w-fit p-6">
            <span class="flex items-center gap-4">
                <img src="https://flagcdn.com/256x192/{lastActivePin?.lang}.png" alt="flag" class="w-20">
                <span>
                    <h2 class="text-3xl">{$_("languages."+lastActivePin?.lang)}</h2>
                    {#if $locales.includes(lastActivePin?.lang ?? "") && $locale!=lastActivePin?.lang}<p class="text-base font-semibold text-mm-lightgray">{$_("name", {locale: lastActivePin?.lang})}</p>{/if}
                </span>
            </span>
        </div>
    </div>
    
    <div class="desktop:absolute top-0 left-0 h-full mobile:h-[335px] [&>span]:flex [&>span]:items-center [&>span]:h-full">
        <Marquee baseAnimDur={30000} animMin={0} animMax={(map?.getBoundingClientRect().width ?? 0) / 16} stopDur={1000} stopDist={1.5} backwards={true} bind:shouldPlay={mapShouldPlay}>
            {#each [...Array(3).keys()] as _}
                <TranslatorMap bind:element={map} />
            {/each}
        </Marquee>
    </div>

    <p class="absolute right-0 bottom-0 text-sm bg-black bg-opacity-75 px-2 py-0.5">© <a href="https://www.planetminecraft.com/project/earth-1-750-1-19" class="underline">{$_("ui.mapcredit")}</a></p>
</div>