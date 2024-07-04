<script lang="ts">
    import { navigating, page } from "$app/stores"
    import consts, { icons } from "$lib/scripts/consts"
    import { mobile, previousRandomBanner, randomSplash, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { onMount } from "svelte"
    import { ChevronsDown } from "lucide-svelte"
    import { randomChoice } from "$lib/scripts/utils"
    import { _, json } from "svelte-i18n"
    import Modpack from "$lib/components/Modpack.svelte"
    import { type Modpack as MPack, type Mod, type Project } from "$lib/scripts/interfaces"
    import { writable, type Writable } from "svelte/store"
    import modpacks from "$lib/json/modpacks.json5"
    import partneredModpacks from "$lib/json/partner_modpacks.json5"
    import projs from "$lib/json/projects.json5"
    import PartnerModpack from "$lib/components/PartnerModpack.svelte"
    import SocialBar from "$lib/components/SocialBar.svelte"
    import ModContextMenu from "$lib/components/ModContextMenu.svelte"
    import { inview } from "svelte-inview";
    import Marquee from "$lib/components/Marquee.svelte";
    import ModIcon from "$lib/components/ModIcon.svelte";
    import BreathingIcon from "$lib/components/BreathingIcon.svelte";

    // This function gets triggered on first page load, does the little appearance animation (if allowed of course)
    let removeOpacity = (children : HTMLCollection | undefined, withAnimation : boolean) => {
        for (let child of children!) {
            removeOpacity(child.children, withAnimation)
            if (!withAnimation && child.id!="animinheader") child.classList?.add("!duration-0", "!delay-0")
            child.classList?.remove("opacity-0", "translate-y-10")
        }
    }

    // Scroll a page down if navigating from another page, hiding the header
    $: if ($navigating?.to?.url==$page.url) setTimeout(() => scrollTo(0, innerHeight), 1)

    // Modpacks, mods, and projects; chewed for typescript's enjoyment
    let packs : MPack[] = modpacks
    let mods : Mod[] | null
    let projects : Project[] = projs

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

    let modpacksHovered : boolean = false // Weather or not the left of the modpack section is hovered, activates the following mouse effect
    let shouldModsAnimPlay : Writable<boolean> = writable<boolean>(false) // Weather or not the spin animation for the mods section should play

    // Stuff needed for the mods anim
    const layerFirst = 8 // How many items are on the first circle layer
    const layerAdd = 2 // How many items to add per circle layer
    const layerCount = 2 // How many layers are visible

    let contextMenuAboutToBeClosed : boolean = true
    let spinAnimHovered : boolean = false

    let partnerQueueLen : number | null // The length of the partnered modpacks section
    let modContextMenu : ModContextMenu | null // The context menu element covering the left half of the HM section
    let sideProjectsInView : Writable<boolean> = writable(false) // Weather the side projects section is visible in viewport or not, used to start the marquee animation

    onMount(() => {
        let nav = $navigating // idk
        
        fetch(consts.MODRINTH_API_ENDPOINT).then(async res => {
            mods = await res.json() // Fetch mods and store
        })

        setTimeout(() => {
            partnerQueueLen = $reducedMotion ? partneredModpacks.length : Math.max(partneredModpacks.length+8, 8) // Calculate the length of partnered packs; if no anim then match the amount of partnered packs, if yes anim then either the amount of packs+8 or just 8, whichever is bigger
            if ($reducedMotion) generateBanner(possibleBanners.filter(b => !b.endsWith(".gif"))) // Generate the banner for the second time if reducedmotion is enabled, remove all gifs to not make the users dizzy

            let shouldShowOpacityAnim = !$scrollY && !nav && !$reducedMotion // If the previously mentioned appearance anim should play; stop if reducedmotion, navigating, or reload after already scrolled 

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
                if (!$reducedMotion && !$mobile) {
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
    })
</script>

<main>
    <div class="w-[100vw] h-[100vh] mobile:h-[87.5vh] relative bg-black bg-opacity-50 flex mobile:flex-col mobile:[&>*]:text-center gap-10 mobile:gap-6 items-center justify-center" id="title">
        <div class="absolute w-full h-full -z-10 object-cover mobile:bg-center" style="background-image: url('{banner}');" id="bg" />

        <img src="{consts.LOGO_URL}" class="w-64 h-64 mobile:w-52 mobile:h-52 rounded-xl opacity-0 translate-y-10 duration-[.5s]" alt="logo">
        <span class="w-[60%] mobile:w-full flex flex-col mobile:items-center gap-3">
            <h1 class="opacity-0 translate-y-10 duration-[.5s] delay-[.5s]">Modern Modpacks</h1>
            <h3 class="opacity-0 translate-y-10 duration-[.5s] delay-[.75s]">{$randomSplash}</h3>
            <SocialBar header={true} />
        </span>
        <ChevronsDown class="mobile:hidden absolute bottom-7 w-10 h-auto opacity-0 duration-[1s] delay-[2s] animate-float animate-duration-[5s]" id="arrow"/>
    </div>

    <div class="pt-16 mobile:pt-8 pb-8 px-10 mobile:px-5 bg-primary-dark flex mobile:flex-col mobile:gap-8 justify-between items-center [&>*]:text-center">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="grid grid-cols-4 gap-[4vw] w-[40vw] h-[40vw] mobile:w-full mobile:h-full aspect-square group"
            on:mouseenter={() => {modpacksHovered = true}} on:mouseleave={() => {modpacksHovered = false}}
        >
            {#each [...Array(16).keys()] as i}
                <Modpack index={i} bind:parentHover={modpacksHovered} />
            {/each}
        </div>
        <div class="flex flex-col gap-5 items-center w-[50%] mobile:w-full">
            <h2>{$_("projects.modpacks.heading")}</h2>
            <p>{@html $_("projects.modpacks.desc")}</p>
        </div>
    </div>

    <div class="py-8 desktop:pl-10 motion-reduce:pr-10 bg-secondary-dark flex mobile:flex-col-reverse justify-between gap-10 mobile:relative mobile:z-30 mobile:[&>*]:text-center">
        <div>
            <h2>{@html $_("projects.partner.heading")}</h2>
            <p class="mt-3 max-w-full">{@html $_("projects.partner.desc")}</p>
        </div>
        <div
            class="flex [&>span]:flex [&>span]:items-center [&>span]:gap-6 [&>span]:w-[50vw]" 
            style="{!$reducedMotion ? "mask-image: linear-gradient(to right, transparent, black 30%, black 70%, transparent 100%);" : ""}"
        >
            <Marquee baseAnimDur={2500 * ((partnerQueueLen ?? 0) - 6)} animMin={0} animMax={11.5 * ((partnerQueueLen ?? 0) - 6)} stopDur={600}>
                {#each [...Array(partnerQueueLen).keys()] as i}
                    <PartnerModpack modpack={partneredModpacks[i % partneredModpacks.length]} />
                {/each}
            </Marquee>
        </div>
    </div>

    <div class="bg-primary-dark desktop:pr-10 flex mobile:flex-col justify-between [&>*]:text-center">
        <div class="min-w-[50%] mobile:min-w-full mobile:h-[50vh] relative flex flex-col justify-center items-center">
            <div class="absolute desktop:w-[120vw] mobile:h-[100vh] mobile:w-full h-full bg-[radial-gradient(circle,_#0c0c0c_0%,_transparent_55%)] flex justify-center items-center">
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <div
                    class="h-full mobile:w-full w-[50%] relative overflow-hidden [&>span]:h-24 [&>span]:w-24 [&>span]:absolute [&>span]:cursor-pointer [&>span]:left-0 [&>span]:right-0 [&>span]:top-0 [&>span]:bottom-0 [&>span]:mx-auto [&>span]:my-auto [&_img]:rounded-md motion-safe:desktop:[&_img:hover]:!scale-[1.15] [&_img]:duration-200"
                    on:mouseover={() => {spinAnimHovered = true; if (!$mobile) $shouldModsAnimPlay = false}} on:mouseleave={() => {spinAnimHovered = false; if (contextMenuAboutToBeClosed) $shouldModsAnimPlay = true}}
                    use:inview={{unobserveOnEnter: true}} on:inview_enter={() => {$shouldModsAnimPlay = true}}
                >
                    <ModContextMenu bind:this={modContextMenu} bind:aboutToClose={contextMenuAboutToBeClosed} bind:spinAnimHovered={spinAnimHovered} bind:shouldSpinAnimPlay={shouldModsAnimPlay} />
                    {#each [...Array((layerFirst * layerCount) + (layerAdd * (layerCount - 1))).keys()] as i}
                        <ModIcon modNumber={i} layerFirst={layerFirst} layerAdd={layerAdd} modContextMenu={modContextMenu} mods={mods} bind:shouldAnimPlay={shouldModsAnimPlay} />
                    {/each}
                </div>
            </div>
            <div class="group z-10 mobile:flex mobile:flex-col mobile:items-center">
                <BreathingIcon duration={2000} minScale={95} maxScale={100} class="duration-100 motion-safe:desktop:group-hover:!scale-100">
                    <img src="{consts.HM_LOGO_URL}" alt="hellish mods logo" title="Hellish Mods" class="w-48 mobile:w-24 rendering-pixelated rounded-md">
                </BreathingIcon>
                <div class="mt-5 mobile:mt-3 flex justify-center gap-5 mobile:gap-4 [&>span]:block [&>span]:w-10 mobile:[&>span]:w-8 [&>span]:h-10 mobile:[&>span]:h-8 [&>span]:duration-200 motion-safe:desktop:[&>span:hover]:!scale-[1.15] motion-safe:desktop:[&>span:not(:hover)]:group-hover:!scale-100 [&_img]:brightness-0 [&_img]:invert">
                    {#each Object.entries([
                        {link: "https://curseforge.com/members/hellishmods", title: "CurseForge"},
                        {link: consts.SOCIALS.modrinth.url, title: "Modrinth"},
                        {link: "https://github.com/Hellish-Mods", title: "GitHub"}
                    ]) as [i, social]}
                        <BreathingIcon duration={2000} minScale={80} maxScale={100} delay={500 * +i}>
                            <a href="{social.link}" target="_blank" rel="noopener noreferrer">
                                <img src="{icons[social.title.toLowerCase()]}" alt="logo icon {social.title.toLowerCase()}" title="{social.title}">
                            </a>
                        </BreathingIcon>
                    {/each}
                </div>
            </div>
        </div>
        <div class="py-8 mobile:px-5 z-30 flex flex-col gap-5 items-center w-[50%] mobile:w-full pointer-events-none [&>*]:pointer-events-auto bg-gradient-to-l mobile:bg-gradient-to-t from-primary-dark from-90%">
            <h2>{$_("projects.hellish.heading")}</h2>
            <p>{@html $_("projects.hellish.desc")}</p>
        </div>
    </div>

    <div class="h-[65vh] mobile:h-fit bg-secondary-dark relative flex mobile:flex-col justify-center items-center [&>*]:text-center">
        {#if !$reducedMotion}
            <div 
                class="
                    desktop:absolute w-full mobile:h-[40vh] h-full flex flex-col justify-evenly mobile:justify-between mobile:pt-8
                    [&>span]:flex [&>span]:gap-8
                    [&_a]:h-[8.5vh] [&_a]:min-w-96 [&_a]:flex [&_a]:justify-center [&_a]:items-center [&_a]:bg-primary-dark [&_a]:rounded-xl [&_a]:font-bold [&_a]:text-2xl
                    [&_a]:duration-200 desktop:[&_a:hover]:scale-110
                "
                use:inview={{unobserveOnEnter: true}} on:inview_enter={() => {$sideProjectsInView = true}}
            >
                {#each [...Array(3).keys()] as row}
                    <Marquee backwards={!!(row%2)} baseAnimDur={projects.length * 3500 * ($mobile ? 1.15 : 1)} animMin={0} animMax={26 * projects.length} firstAnimLength={26 * 5} stopDur={500} bind:inview={sideProjectsInView}>
                        {#each [...Array(projects.length * 2).keys()] as i}
                        {@const project = projects[(i + (row * 2)) % projects.length]}
                            <a href="{project.link}" target="_blank" rel="noopener noreferrer" title="{$_("sideprojects."+project.id)}">
                                {project.name} {project.icon}
                            </a>
                        {/each}
                    </Marquee>
                {/each}
            </div>
        {/if}
        <div class="h-full w-full px-16 mobile:my-8 z-10 pointer-events-none [&>*]:pointer-events-auto flex flex-col gap-5 items-center justify-center desktop:bg-[radial-gradient(circle,_#0c0c0c_10%,_transparent_65%)]">
            <h2>{$_("projects.ecosystem.heading")}</h2>
            <p>{@html $_("projects.ecosystem.desc")}</p>
        </div>
    </div>
</main>