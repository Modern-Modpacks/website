<script lang="ts">
    import Marquee from "$lib/components/Marquee.svelte";
    import membersJson from "$lib/json/members.json5" 
    import translatorsJson from "$lib/json/translators.json5" 
    import MemberCard from "$lib/components/MemberCard.svelte";
    import { _, locale, locales } from "svelte-i18n";
    import type { Coordinates, Member, Pin, Translator } from "$lib/scripts/interfaces";
    import { onMount } from "svelte";
    import { calculateElementCenter, getContributorAvatar } from "$lib/scripts/utils";
    import { tweened, type Tweened } from "svelte/motion";
    import { sineIn, sineOut } from "svelte/easing";
    import { activatedPin, lightMode, mobile, reducedMotion } from "$lib/scripts/stores";
    import TranslatorMap from "$lib/components/TranslatorMap.svelte";
    import { writable, type Writable } from "svelte/store";
    import { ChevronLeft, User } from "lucide-svelte";
    import consts from "$lib/scripts/consts";
    import VanillaTilt from "vanilla-tilt";
    import { inview } from "svelte-inview";
    import TesterHex from "$lib/components/TesterHex.svelte";
    import Saos from "saos";

    // Members and translators, served just as typescript likes it
    let members : Member[] = membersJson
    let translators : {[key: string]: Translator[]} = translatorsJson

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
    let sidebarScrolled : number = 0 // Times the sidebar has been scrolled
    let lastActivePin : Pin | null // Last activated pin
    let mapSidebarShown : boolean = false // Whether the sidebar with info is shown
    let mapShouldPlay : Writable<boolean> = writable(true) // Whether the map marquee should play, based on whether a pin is active on the it
    activatedPin.subscribe(v => {
        mapSidebarShown = false

        if (v!=null) {
            setTimeout(() => {
                sidebarScrolled = 0
                lastActivePin = v
                mapSidebarShown = true
            }, 500 * +!$mapShouldPlay)
        } else {
            sidebarScrolled = 0
        }

        $mapShouldPlay = v==null
    })

    let hexesHovered : boolean = false // Whether the tester section's hex animation is hovered

    let discordButton : HTMLElement | null // The "join the discord" button
    let showJoinAnim : boolean = false // Whether to show the animations in the "join us" section (triggered on inview)

    let compass : HTMLElement | null // The compass texture
    let compassCenter : Coordinates | null // The coordinates of the compass' center
    const compasssTextureDur = 53 // The duration it takes for compass to update the rotation
    let compassTexture : Tweened<number> = tweened(0, {duration: compasssTextureDur}) // The spun texture for the compass
    let compassUnfocused : boolean = false // Whether the window is focused and the compass should follow mouse
    let compassUnfocusedTimeout : number | null = null // The timeout used for unfocus anim

    onMount(() => {
        setTimeout(() => {if ($reducedMotion) {showJoinAnim = true; compassUnfocused = false}}, 1)

        // Recalculate wall on mount and resize
        recalculateWall()
        window.addEventListener("resize", recalculateWall)
        startCardCycles() // Start member card animation

        // Enable discord button tilt
        if (!$reducedMotion && !$mobile) VanillaTilt.init(discordButton!, {
            reverse: true,
            speed: 1000
        })

        // Calculate compass center on resize and locale change
        window.addEventListener("resize", () => {compassCenter = calculateElementCenter(compass!)})
        locale.subscribe(_ => {compassCenter = calculateElementCenter(compass!)})
        document.addEventListener("mousemove", e => { // Calculate rotation for the correct compass texture
            if ($reducedMotion || $mobile || !compassCenter) return

            let newTexture = Math.round((Math.atan2(e.pageY - compassCenter.y, e.pageX - compassCenter.x) / (2*Math.PI)) * 31) - 7

            // Rotation shitfuckery
            if (newTexture == -22 || newTexture == 8) compassTexture.set(newTexture, {duration: 0})
            else $compassTexture = newTexture
        })
        // Focus and unfocus anims
        window.addEventListener("blur", e => {
            if ($reducedMotion || $mobile) return

            let duration = Math.abs($compassTexture) * compasssTextureDur
            compassTexture.set(0, {duration: duration})

            compassUnfocusedTimeout = setTimeout(() => {compassUnfocused = true}, duration) as any
        })
        window.addEventListener("focus", e => {
            if ($reducedMotion || $mobile) return

            if (compassUnfocusedTimeout!=null) clearTimeout(compassUnfocusedTimeout)
            compassUnfocused = false
        })
    })
</script>

<style>
    @keyframes -global-showup {
        from {
            transform-origin: bottom;

            scale: 0%;
            opacity: 0;
        }
        to {
            scale: 100%;
            opacity: 1;
        }
    }
</style>

<div class="desktop:h-[95vh]">
    <div class="absolute w-full h-[95vh] -z-10 overflow-hidden [&>span]:flex [&>span]:flex-wrap">
        <Marquee baseAnimDur={10000 * members.length} animMin={0} bind:animMax={wallScrollHeight} vertical={true}>
            {#each [...Array(8 * (wallRowCount ?? 0)).keys()] as i}
                {@const member = members[i % members.length]}
                <img src="{getContributorAvatar(member)}" alt="{member.name}'s avatar" class="w-[12.5vw]">
            {/each}
        </Marquee>
    </div>

    <div class="w-full h-full desktop:pl-16 desktop:pt-8 flex mobile:flex-col justify-evenly items-center desktop:bg-gradient-to-r mobile:bg-black mobile:bg-opacity-80 {$lightMode ? "from-[#ffffffbe] to-[#ffffffbe]" : "from-[#000000f0] to-[#000000f0]"} from-15% via-transparent to-60%">
        <div class="w-full">
            <span role="list" class="block w-fit" on:mouseenter={() => {mouseOverCard = true}} on:mouseleave={() => {mouseOverCard = false; if (!cardAnimPlaying) startCardCycles()}}>
                <span class="block w-fit" style="transform: translateX(-{$cardTransition}%);">
                    <MemberCard bind:memberId={memberId} />
                </span>
            </span>
        </div>

        <div class="flex flex-col gap-5 items-center w-full {$lightMode ? "mobile:bg-primary-light" : "mobile:bg-primary-dark"} mobile:px-10 mobile:py-8 [&>*]:text-center">
            <h2>{$_("about.members.heading")}</h2>
            <p>{@html $_("about.members.desc")}</p>
        </div>
    </div>
</div>
<div class="relative w-full desktop:h-[670px] flex mobile:flex-col-reverse">
    <div class="relative z-10 w-[60%] mobile:w-full h-full mobile:h-fit bg-gradient-to-r mobile:bg-gradient-to-t {$lightMode ? "from-primary-light" : "from-primary-dark"} from-70% mobile:from-[92.5%] mobile:z-20 pointer-events-none">
        <div class="flex flex-col gap-5 items-center justify-center w-fit h-full py-8 mobile:pt-[5.5rem] ml-10 mobile:mr-10 [&>*]:text-center pointer-events-auto">
            <h2>{$_("about.translators.heading")}</h2>
            <p>{@html $_("about.translators.desc")}</p>
        </div>
    </div>
    <div class="absolute left-0 top-0 w-[42.5%] mobile:w-full h-full mobile:h-[400px] z-10 motion-safe:duration-300 ease-out {$activatedPin ? "desktop:backdrop-blur-xl mobile:bg-black mobile:bg-opacity-75" : "pointer-events-none"}">
        <div class="{mapSidebarShown ? "desktop:translate-x-0" : "desktop:translate-x-[-100%] mobile:opacity-0"} motion-safe:duration-500 ease-in-out h-full w-full p-6">
            <span class="flex items-center gap-4 w-fit">
                <img src="https://flagcdn.com/256x192/{lastActivePin?.lang}.png" alt="{lastActivePin?.lang.toUpperCase()} flag" class="w-20 mobile:w-14">
                <span>
                    <h3 class="font-bold mobile:text-lg">{$_("languages."+lastActivePin?.lang)}</h3>
                    {#if $locales.includes(lastActivePin?.lang ?? "") && $locale!=lastActivePin?.lang}<p class="text-base mobile:text-sm font-semibold !text-mm-lightgray">{$_("name", {locale: lastActivePin?.lang})}</p>{/if}
                </span>

                <button class="group absolute w-8 h-8 mobile:w-6 mobile:h-6 right-6 p-2 box-content bg-black bg-opacity-35 rounded-full cursor-pointer" on:click={() => {$activatedPin = null}}>
                    <ChevronLeft class="w-full h-full motion-safe:desktop:translate-x-0.5 {mapSidebarShown ? "motion-safe:group-hover:desktop:-translate-x-1" : "motion-safe:desktop:!-translate-x-1"} duration-200 ease-out" />
                </button>
            </span>
            <div
                class="overflow-hidden mobile:overflow-scroll h-[34rem] mobile:h-80 mobile:pb-10 mt-6 flex flex-col gap-4 mobile:gap-3 w-fit" style="-webkit-overflow-scrolling: touch;"
                on:wheel={e => {
                    e.preventDefault()

                    let langTranslators = translators[lastActivePin?.lang ?? ""]
                    if (langTranslators==null) return
                    sidebarScrolled = Math.min(Math.max(sidebarScrolled + Math.sign(e.deltaY), 0), Math.floor(translators[lastActivePin?.lang ?? ""].length / 6))
                }}
            >
                {#if Object.keys(translators).includes(lastActivePin?.lang ?? "")}
                    {#each Object.entries(translators[lastActivePin?.lang ?? ""]) as [i, translator]}
                    {@const onCurrentPage = (+i >= sidebarScrolled * 6) && (+i < (sidebarScrolled + 1) * 6)}
                        <a 
                            href="https://github.com/{translator.github.username}" target="_blank" rel="noopener noreferrer" title="GitHub ({translator.github.username})"
                            class="group flex items-center gap-4{+i > 0 && !(+i % 6) ? " desktop:mt-4" : ""} [&_*]:origin-top-left [&_*]:duration-300 duration-500" style="transform: translateY({sidebarScrolled * +!$mobile * -34}rem);"
                        >
                            <img src="{getContributorAvatar(translator)}" alt="{translator.name}'s avatar" class="w-[4.5rem] mobile:w-16{onCurrentPage ? " motion-safe:group-hover:desktop:w-24" : ""}{translator.title=="ex" ? " saturate-0" : ""} rendering-crisp-edges rounded-xl">
                            <span>
                                <h3 class="font-bold mobile:text-lg{onCurrentPage ? " motion-safe:group-hover:desktop:text-4xl" : ""}">{translator.name}</h3>
                                <p class="text-base mobile:text-sm{onCurrentPage ? " motion-safe:group-hover:desktop:text-lg" : ""} font-semibold !text-mm-lightgray">{$_(`ui.titles.${translator.title ? translator.title+"_" : ""}translator`)}</p>
                            </span>
                        </a>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    
    <div class="desktop:absolute top-0 motion-safe:left-0 motion-reduce:right-0 h-full mobile:h-[335px] [&>span]:flex [&>span]:items-center [&>span]:h-full motion-reduce:[&>span]:w-full">
        <Marquee baseAnimDur={30000} animMin={0} animMax={(map?.getBoundingClientRect().width ?? 0) / 16} stopDur={1000} stopDist={1.5} backwards={true} bind:shouldPlay={mapShouldPlay}>
            {#each [...Array($reducedMotion ? 1 : 3).keys()] as _}
                <TranslatorMap bind:element={map} />
            {/each}
        </Marquee>
    </div>

    <p class="absolute right-0 bottom-0 text-sm bg-black bg-opacity-75 px-2 py-0.5">© <a href="https://www.planetminecraft.com/project/earth-1-750-1-19" class="underline">{$_("ui.mapcredit")}</a></p>
</div>
<div class="w-full flex mobile:flex-col {$lightMode ? "bg-secondary-light" : "bg-secondary-dark"}">
    <div role="list" class="group relative w-full mobile:h-[60vh] flex overflow-hidden" on:mouseenter={() => {hexesHovered=true}} on:mouseleave={() => {hexesHovered=false}}>
        {#each [...Array($mobile ? 3 : 5).keys()] as col}
            {#each [...Array(col%2 ? ($mobile ? 3 : 5) - +(col==3) : ($mobile ? 3 : 4) - +(col==4)).keys()] as row}
                <TesterHex col={col} row={row} bind:parentHovered={hexesHovered} />
            {/each}
        {/each}
    </div>
    <div class="mr-10 mobile:ml-10 py-8 min-w-fit flex flex-col gap-5 [&>*]:text-center">
        <h2>{$_("about.testers.heading")}</h2>
        <p>{@html $_("about.testers.desc")}</p>
    </div>
</div>
<div class="w-full py-8 flex mobile:flex-col-reverse items-center justify-between">
    <div class="w-fit ml-10 mobile:mr-10 flex flex-col gap-5 items-center [&>*]:text-center">
        <h2>{$_("about.joinus.heading")}</h2>
        <p>{@html $_("about.joinus.desc")}</p>
        
        <span class="mt-3 mobile:mt-2 rounded-full duration-1000 motion-safe:desktop:hover:-translate-y-2">
            <a
                href="{consts.SOCIALS.Discord.url}" target="_blank" rel="noopener noreferrer"
                class="py-4 px-6 flex items-center gap-3 bg-[#5865f2] shadow-xl shadow-transparent rounded-full ease-in-out [transition:box-shadow_1s] motion-safe:desktop:hover:shadow-[#5865f233]"
                bind:this={discordButton}
            >
                <img src="{consts.WEBSITE_ICONS.Discord}" alt="Discord logo" class="w-12 brightness-0 invert">
                <p class="font-bold text-2xl !text-white">{$_("ui.discord")}</p>
            </a>
        </span>
    </div>
    <div class="flex w-[50vw] mobile:h-48 desktop:-translate-y-8 justify-center motion-reduce:[&_*]:animate-duration-[0s]" use:inview={{threshold: .5}} on:inview_enter={() => {showJoinAnim = true}}>
        <span class="flex motion-reduce:gap-16{showJoinAnim ? " animate-join-gap" : ""}">
            {#each [...Array(2).keys()] as _}
                <User class="h-48 w-48 mobile:w-24 mobile:h-24" />
            {/each}
        </span>
        <User class="absolute h-48 w-48 mobile:w-24 mobile:h-24 motion-safe:opacity-0 motion-reduce:translate-y-16{showJoinAnim ? " animate-join-main" : ""}" />

        <p class="absolute -bottom-28 right-[15vw] h-24 w-24 flex justify-center items-center text-6xl font-bold bg-mm-red !text-white rounded-full select-none mobile:opacity-0 motion-safe:[scale:0%] motion-safe:animate-delay-[650ms]{showJoinAnim ? " animate-join-plusone" : ""}">+1</p>
    </div>
</div>
<div class="w-full py-8 flex mobile:flex-col {$lightMode ? "bg-secondary-light" : "bg-secondary-dark"}">
    <div class="w-full desktop:ml-10 mobile:mb-6 flex items-center mobile:justify-center">
        <Saos animation={$reducedMotion || $mobile ? "" : `showup .75s ease-out backwards`} once={true}>
            <img 
                src="{compassUnfocused || !compassCenter ? "https://minecraft.wiki/images/Compass_JE3_BE3.gif" : `https://raw.githubusercontent.com/misode/mcmeta/1.19.2-assets/assets/minecraft/textures/item/compass_${((31 + Math.round($compassTexture)) % 31).toString().padStart(2, "0")}.png`}"
                alt="{compassUnfocused || !compassCenter ? "Spinning compass" : `Compass in position ${(31 + Math.round($compassTexture)) % 31}`}" class="origin-bottom rendering-pixelated aspect-square w-[40vw] h-[40vw] mobile:h-64 mobile:w-64 min-w-[40vw] min-h-[40vw] mobile:min-h-64 mobile:min-w-64" bind:this={compass}
                use:inview={{unobserveOnEnter: true}} on:inview_enter={() => {
                    setTimeout(() => {compassCenter = calculateElementCenter(compass ?? undefined)}, 750)
                }}
            >
        </Saos>
    </div>
    <div class="mr-10 mobile:ml-10 min-w-fit flex flex-col gap-5 [&>*]:text-center">
        <h2>{$_("about.mission.heading")}</h2>
        <p>{@html $_("about.mission.desc")}</p>
    </div>
</div>