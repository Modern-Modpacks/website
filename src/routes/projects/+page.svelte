<script lang="ts">
    import { navigating, page } from "$app/stores"
    import consts, { icons } from "$lib/scripts/consts"
    import { previousRandomBanner, randomSplash, reducedMotion, scrollY } from "$lib/scripts/stores"
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
                <Modpack index={i} bind:parentHover={modpacksHovered} />
            {/each}
        </div>
        <div class="flex flex-col gap-5 items-center w-[50%]">
            <h2>{$_("projects.modpacks.heading")}</h2>
            <p>{@html $_("projects.modpacks.desc")}</p>
        </div>
    </div>

    <div class="py-8 pl-10 motion-reduce:pr-10 bg-secondary-dark flex justify-between">
        <div class="min-w-[50rem]">
            <h2>{@html $_("projects.partner.heading")}</h2>
            <p class="mt-3">{@html $_("projects.partner.desc")}</p>
        </div>
        <div
            class="flex [&>span]:flex [&>span]:items-center [&>span]:gap-6" 
            style="{!$reducedMotion ? "mask-image: linear-gradient(to right, transparent, black 30%, black 70%, transparent 100%);" : ""}"
        >
            <Marquee baseAnimDur={2500 * ((partnerQueueLen ?? 0) - 6)} animMin={0} animMax={11.5 * ((partnerQueueLen ?? 0) - 6)} stopDur={600}>
                {#each [...Array(partnerQueueLen).keys()] as i}
                    <PartnerModpack modpack={partneredModpacks[i % partneredModpacks.length]} />
                {/each}
            </Marquee>
        </div>
    </div>

    <div class="bg-primary-dark flex justify-between [&>*]:text-center">
        <div class="min-w-[50%] relative flex flex-col justify-center items-center">
            <div class="absolute w-[120vw] h-full bg-[radial-gradient(circle,_#0c0c0c_0%,_transparent_55%)] flex justify-center items-center">
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <div
                    class="h-full w-[50%] relative overflow-hidden [&>span]:h-24 [&>span]:w-24 [&>span]:absolute [&>span]:cursor-pointer [&>span]:left-0 [&>span]:right-0 [&>span]:top-0 [&>span]:bottom-0 [&>span]:mx-auto [&>span]:my-auto [&_img]:rounded-md motion-safe:[&_img:hover]:!scale-[1.15] [&_img]:duration-200"
                    on:mouseover={() => {spinAnimHovered = true; $shouldModsAnimPlay = false}} on:mouseleave={() => {spinAnimHovered = false; if (contextMenuAboutToBeClosed) $shouldModsAnimPlay = true}}
                    use:inview={{unobserveOnEnter: true}} on:inview_enter={() => {$shouldModsAnimPlay = true}}
                >
                    <ModContextMenu bind:this={modContextMenu} bind:aboutToClose={contextMenuAboutToBeClosed} bind:spinAnimHovered={spinAnimHovered} bind:shouldSpinAnimPlay={shouldModsAnimPlay} />
                    {#each [...Array((layerFirst * layerCount) + (layerAdd * (layerCount - 1))).keys()] as i}
                        <ModIcon modNumber={i} layerFirst={layerFirst} layerAdd={layerAdd} modContextMenu={modContextMenu} mods={mods} bind:shouldAnimPlay={shouldModsAnimPlay} />
                    {/each}
                </div>
            </div>
            <div class="group z-10">
                <BreathingIcon duration={2000} minScale={95} maxScale={100} class="duration-100 motion-safe:group-hover:!scale-100">
                    <img src="{consts.HM_LOGO_URL}" alt="hellish mods logo" title="Hellish Mods" class="w-48 h-48 rendering-pixelated rounded-md">
                </BreathingIcon>
                <div class="mt-5 flex justify-center gap-5 [&>span]:block [&>span]:w-10 [&>span]:duration-200 motion-safe:[&>span:hover]:!scale-[1.15] motion-safe:[&>span:not(:hover)]:group-hover:!scale-100 [&_img]:brightness-0 [&_img]:invert">
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
        <div class="py-8 z-30 flex flex-col gap-5 items-center w-[50%] pointer-events-none [&>*]:pointer-events-auto bg-gradient-to-l from-primary-dark from-90%">
            <h2>{$_("projects.hellish.heading")}</h2>
            <p>{@html $_("projects.hellish.desc")}</p>
        </div>
    </div>

    <div class="h-[65vh] bg-secondary-dark relative flex justify-center items-center [&>*]:text-center">
        {#if !$reducedMotion}
            <div class="
                absolute w-full h-full flex flex-col justify-evenly
                [&>span]:flex [&>span]:gap-8
                [&_a]:block [&_a]:h-20 [&_a]:min-w-96 [&_a]:bg-primary-dark [&_a]:rounded-xl
                [&_a]:duration-200 [&_a:hover]:scale-110
            ">
                {#each [...Array(3).keys()] as row}
                    <Marquee backwards={!!(row%2)} baseAnimDur={projects.length * 3500} animMin={0} animMax={26 * projects.length} stopDur={500}>
                        {#each [...Array(projects.length * 2).keys()] as i}
                        {@const project = projects[i % projects.length]}
                            <a href="{project.link}" target="_blank" rel="noopener noreferrer">
                                {project.name} {project.icon}
                            </a>
                        {/each}
                    </Marquee>
                {/each}
            </div>
        {/if}
        <div class="h-full w-full rounded-full px-16 z-10 pointer-events-none [&>*]:pointer-events-auto flex flex-col gap-5 items-center justify-center bg-[radial-gradient(circle,_#0c0c0c_0%,_transparent_55%)]">
            <h2>{$_("projects.ecosystem.heading")}</h2>
            <p>{@html $_("projects.ecosystem.desc")}</p>
        </div>
    </div>
</main>