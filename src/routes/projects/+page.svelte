<script lang="ts">
    import { navigating, page } from "$app/stores"
    import consts, { icons } from "$lib/scripts/consts"
    import { previousRandomBanner, randomSplash, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { onMount } from "svelte"
    import { ChevronsDown } from "lucide-svelte"
    import { randomChoice } from "$lib/scripts/utils"
    import { _, json } from "svelte-i18n"
    import Modpack from "$lib/components/Modpack.svelte"
    import { type Modpack as MPack, type TweenedAnim } from "$lib/scripts/interfaces"
    import { tweened, type Tweened } from "svelte/motion"
    import { get } from "svelte/store"
    import { sineOut } from "svelte/easing"
    import modpacks from "$lib/json/modpacks.json5"
    import partneredModpacks from "$lib/json/partner_modpacks.json5"
    import PartnerModpack from "$lib/components/PartnerModpack.svelte"
    import SocialBar from "$lib/components/SocialBar.svelte"

    // This function gets triggered on first page load, does the little appearance animation (if allowed of course)
    let removeOpacity = (children : HTMLCollection | undefined, withAnimation : boolean) => {
        for (let child of children!) {
            removeOpacity(child.children, withAnimation)
            if (!withAnimation && child.id!="social") child.classList?.add("!duration-0", "!delay-0")
            child.classList?.remove("opacity-0", "translate-y-10")
        }
    }

    // Scroll a page down if navigating from another page, hiding the header
    $: if ($navigating?.to?.url==$page.url) setTimeout(() => scrollTo(0, innerHeight), 1)

    let packs : MPack[] = modpacks // Modpacks, chewed for typescript's enjoyment
    let banner : string | null // The banner's background
    let generateBanner = (pool : string[]) => { // A function to randomly generate said background
        banner = pool[Math.floor(Math.random() * pool.length)]
    }

    // Generate the banner for the first time, using custom banners and ones from modpack pages
    let possibleBanners : string[] = consts.ADDITIONAL_BANNERS
    packs.forEach(p => {
        if (p.banner) possibleBanners.push(p.banner)
    })
    generateBanner(possibleBanners)

    // The breathe animations for modpacks, the hellish mods logo, and the social buttons below said logo
    // This would be replaced with css if browsers sucked less
    let animations : TweenedAnim[] = [...Array(16).keys()].map(i => {return {scale: tweened(100, {duration: 2000, delay: (Math.floor(i / 4) + i % 4) * 500, easing: sineOut}), scaleup: false, maxScale: 100, minScale: 90}})
    let HMIconAnims : TweenedAnim[] = []
    for (let i = 0; i < 3; i++) HMIconAnims.push({scale: tweened(100, {duration: 2000, delay: 500*i}), scaleup: true, maxScale: 100, minScale: 80})
    animations = [...animations, {scale: tweened(100, {duration: 2000}), scaleup: true, maxScale: 100, minScale: 95}, ...HMIconAnims]

    let modpacksHovered : boolean = false // Weather or not the left of the modpack section is hovered, activates the following mouse effect

    let partnerQueueLen : number | null // The length of the partnered modpacks section
    let partnerModpacks : HTMLElement | null // The partnered modpacks chain element, used to determine the length needed to be scrolled

    // Blame svelte not me
    // "Stores must be declared at the top level of the component" my ass
    let HMLogoAnim : Tweened<number>
    $: HMLogoAnim = animations[16].scale
    let CFHMLogoAnim : Tweened<number>
    $: CFHMLogoAnim = animations[17].scale
    let MRHMLogoAnim : Tweened<number>
    $: MRHMLogoAnim = animations[18].scale
    let GHHMLogoAnim : Tweened<number>
    $: GHHMLogoAnim = animations[19].scale

    // Constants used for the spin animation in the HM section
    const defaultRotDuration = 5000 // Default rotation duration
    const rotDurationAdd = 3000 // How many ms is added per layer

    // Instantiate the tweened's for all mod elements
    let rotOffsets : {anim: Tweened<number>, duration : number}[] = []
    for (let i = 0; i < 15; i++) { // TODO: change the number of layers possible
        let rotDuration : number = defaultRotDuration + (rotDurationAdd * i)
        rotOffsets.push({anim: tweened(0, {duration: rotDuration}), duration: rotDuration})
    }
    let rotOffsetNumbers : number[] = Array.from({length: rotOffsets.length}, () => 0) // Dear god svelte, kids are watching

    let doABarrelRoll = (layer: number) => {rotOffsets[layer].anim.set((get(rotOffsets[layer].anim) + 1) % 360)} // Spin a layer of the animation, whee
    let getLayer = (layerNum: number, layerMax: number, layerAdd : number, i: number): number => { // Get a layer based on super complex math :5head:
        if (i<layerMax) return layerNum
        return getLayer(layerNum + 1, layerMax + layerAdd, layerAdd, i - layerMax) // Each layer is `layerAdd` elements more than the last one, usually this is set to 2
    }

    onMount(() => {
        let nav = $navigating // idk

        setTimeout(() => {
            partnerQueueLen = $reducedMotion ? partneredModpacks.length : Math.max(partneredModpacks.length+2, 8) // Calculate the length of partnered packs; if no anim then match the amount of partnered packs, if yes anim then either the amount of packs+2 or just 8, whichever is bigger
            if ($reducedMotion) generateBanner(possibleBanners.filter(b => !b.endsWith(".gif"))) // Generate the banner for the second time if reducedmotion is enabled, remove all gifs to not make the users dizzy

            let shouldShowOpacityAnim = !$scrollY && !nav && !$reducedMotion // If the previously mentioned appearance anim should play; stop if reducedmotion, navigating, or reload after already scrolled 

            // You spin me right round
            // Baby right round
            // Like a record baby
            // Round round, round round
            for (let i = 0; i < rotOffsets.length; i++) {
                doABarrelRoll(i)
                setInterval(() => doABarrelRoll(i), rotOffsets[i].duration)
            }

            // Different elements and classlists of elements in the header
            let title : HTMLElement | null = document.getElementById("title")
            let bg : HTMLElement | null = document.getElementById("bg")
            let arrowClasses : DOMTokenList | undefined = document.getElementById("arrow")?.classList

            // Keep the banner and the splash text if navigating, otherwise generate new ones
            if ($scrollY || nav) {
                banner = $previousRandomBanner
                arrowClasses?.add("hidden")
            }
            else {
                $randomSplash = randomChoice($json("splashes") as any[])
                $previousRandomBanner = banner!

                // If appearance anim is playing, make the user wait a bit and enjoy the beauty
                if (!$reducedMotion) {
                    document.body.classList.add("overflow-y-hidden")
                    setTimeout(() => {document.body.classList.remove("overflow-y-hidden")}, 2500)
                }
            }

            setTimeout(() => {removeOpacity(title?.children, shouldShowOpacityAnim)}, !shouldShowOpacityAnim ? 0 : 500) // Play the actual appearance anim

            // Remove banner down arrows on first scroll, and apply parallax effect to the bg if reducedmotion isn't enabled
            document.addEventListener("scroll", () => {
                arrowClasses?.remove("duration-[1s]", "delay-[2s]")
                arrowClasses?.add(`duration-[${$reducedMotion ? '0s' : '.25s'}]`, "opacity-0", "scale-0")

                if ($reducedMotion) return

                bg!.style.backgroundPositionY = `${Math.max($scrollY*.5-10, 0)}px`
            })
        }, 1)

        // Update breathing animations
        for (let i = 0; i < animations.length; i++) {
            let anim = animations[i]
            setInterval(() => {
                anim.scale.set(anim.scaleup ? anim.maxScale : anim.minScale)
                anim.scaleup = !anim.scaleup
            }, 2000)
        }

        setInterval(() => {
            for (let i = 0; i < rotOffsets.length; i++) rotOffsetNumbers[i] = get(rotOffsets[i].anim) // Svelte fuck off. Look at what you did
        }, 1)
    })
</script>

<main>
    <div class="w-[100vw] h-[100vh] relative bg-black bg-opacity-50 flex gap-10 items-center justify-center" id="title">
        <div class="absolute w-full h-full -z-10 object-cover" style="background-image: url('{banner}');" id="bg" />

        <img src="{consts.LOGO_URL}" class="w-64 h-64 rounded-xl opacity-0 translate-y-10 duration-[.5s]" alt="logo">
        <span class="w-[60%] flex flex-col gap-3">
            <h1 class="opacity-0 translate-y-10 duration-[.5s] delay-[.5s]">Modern Modpacks</h1>
            <h3 class="opacity-0 translate-y-10 duration-[.5s] delay-[.75s]">{$randomSplash}</h3>
            <SocialBar header={true} />
        </span>
        <ChevronsDown class="absolute bottom-7 w-10 h-auto opacity-0 duration-[1s] delay-[2s] animate-float animate-duration-[5s]" id="arrow"/>
    </div>

    <div class="pt-16 pb-8 px-10 bg-primary-dark flex justify-between [&>*]:text-center">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="grid grid-cols-4 gap-[4.5rem] min-w-[770px] min-h-[770px] aspect-square group"
            on:mouseenter={() => {modpacksHovered = true}} on:mouseleave={() => {modpacksHovered = false}}
        >
            {#each [...Array(16).keys()] as i}
                <Modpack index={i} scale={$reducedMotion ? null : animations[i].scale} bind:parentHover={modpacksHovered} />
            {/each}
        </div>
        <div class="flex flex-col gap-5 items-center w-[50%]">
            <h2>{$_("projects.modpacks.heading")}</h2>
            <p>{@html $_("projects.modpacks.desc")}</p>
        </div>
    </div>

    <div class="py-8 pl-10 bg-secondary-dark flex justify-between">
        <div class="w-[75rem]">
            <h2>{@html $_("projects.partner.heading")}</h2>
            <p class="mt-3">{@html $_("projects.partner.desc")}</p>
        </div>
        <div class="flex" style="mask-image: linear-gradient(to right, transparent, black 30%, black 70%, transparent 100%);">
            <div
                class="flex items-center gap-6 motion-safe:animate-marquee hover:animate-pause motion-reduce:overflow-x-scroll"
                style="--scroll-amount: -{10.5*partneredModpacks.length}rem; --scroll-time: {.5 * (partnerQueueLen ?? 0)}s"
                bind:this={partnerModpacks}
                on:wheel={e => {
                    if (!$reducedMotion || partnerModpacks==null) return
                    e.preventDefault()

                    partnerModpacks.scrollLeft += e.deltaY
                }}
            >
                {#each [...Array(partnerQueueLen).keys()] as i}
                    <PartnerModpack modpack={partneredModpacks[i % partneredModpacks.length]} />
                {/each}
            </div>
        </div>
    </div>

    <div class="pr-10 bg-primary-dark flex justify-between [&>*]:text-center">
        <div class="min-w-[50%] relative flex flex-col justify-center items-center">
            <div class="absolute w-[120vw] h-full bg-[radial-gradient(circle,_#0c0c0c_0%,_transparent_55%)] flex justify-center items-center">
                <div class="h-full w-full relative overflow-hidden [&>span]:h-24 [&>span]:w-24 [&>span]:absolute [&>span]:left-0 [&>span]:right-0 [&>span]:top-0 [&>span]:bottom-0 [&>span]:mx-auto [&>span]:my-auto [&_h2]:text-sm"> 
                    <!-- animate-spin [&>img]:animate-unspin -->
                    {#each [...Array(90).keys()] as i}
                        {@const layerFirst = 8}
                        {@const layerAdd = 2}
                        {@const layer = getLayer(0, layerFirst, layerAdd, i)}
                        {@const itemsInLayer = layerFirst + (layerAdd * layer)}
                        {@const rotAmount = (360 / itemsInLayer) * (i + rotOffsetNumbers[layer]) * (layer % 2 ? 1 : -1)}
                        {@const radius = 250 + ((layer+1) ** 7)}

                        <span style="transform: scale({100 + (20 * layer)}%) rotate({rotAmount}deg) translate({radius}px) rotate({-rotAmount}deg);">
                            <img src="{consts.HM_LOGO_URL}" alt="">
                            <h2>{i}</h2>
                        </span>
                    {/each}
                </div>
            </div>
            <div class="group z-10">
                <img src="{consts.HM_LOGO_URL}" alt="hellish mods logo" title="Hellish Mods" class="w-48 h-48 rendering-pixelated rounded-md motion-safe:group-hover:!scale-100 duration-100" style="transform: scale({$reducedMotion ? 100 : $HMLogoAnim}%);">
                <div class="mt-5 flex justify-center gap-5 [&>a]:block [&>a]:w-10 [&>a]:motion-safe:duration-200 [&_img]:brightness-0 [&_img]:invert">
                    {#each [
                        {link: "https://curseforge.com/members/hellishmods", title: "CurseForge", anim: $CFHMLogoAnim},
                        {link: consts.SOCIALS.modrinth.url, title: "Modrinth", anim: $MRHMLogoAnim},
                        {link: "https://github.com/Hellish-Mods", title: "GitHub", anim: $GHHMLogoAnim}
                    ] as social}
                        <a href="{social.link}" target="_blank" rel="noopener noreferrer" class="motion-safe:hover:!scale-[1.15] motion-safe:[&:not(:hover)]:group-hover:!scale-100" style="transform: scale({$reducedMotion ? 100 : social.anim}%);">
                            <img src="{icons[social.title.toLowerCase()]}" alt="logo icon {social.title.toLowerCase()}" title="{social.title}">
                        </a>
                    {/each}
                </div>
            </div>
        </div>
        <div class="py-8 z-10 flex flex-col gap-5 items-center w-[50%] bg-gradient-to-l from-primary-dark from-90%">
            <h2>{$_("projects.hellish.heading")}</h2>
            <p>{@html $_("projects.hellish.desc")}</p>
        </div>
    </div>
</main>