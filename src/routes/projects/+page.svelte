<script lang="ts">
    import { navigating, page } from "$app/stores"
    import consts from "$lib/scripts/consts"
    import { previousRandomBanner, randomSplash, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { onMount } from "svelte"
    import { ChevronsDown } from "lucide-svelte"
    import { randomChoice } from "$lib/scripts/utils"
    import { _, json } from "svelte-i18n"
    import Modpack from "$lib/components/Modpack.svelte"
    import { type Modpack as MPack } from "$lib/scripts/interfaces"
    import { tweened, type Tweened } from "svelte/motion"
    import { get } from "svelte/store"
    import { sineOut } from "svelte/easing"
    import modpacks from "$lib/json/modpacks.json5"
    import partneredModpacks from "$lib/json/partner_modpacks.json5"
    import PartnerModpack from "$lib/components/PartnerModpack.svelte"
    import SocialBar from "$lib/components/SocialBar.svelte"

    let removeOpacity = (children : HTMLCollection | undefined, withAnimation : boolean) => {
        for (let child of children!) {
            removeOpacity(child.children, withAnimation)
            if (!withAnimation && child.id!="social") child.classList?.add("!duration-0", "!delay-0")
            child.classList?.remove("opacity-0", "translate-y-10")
        }
    }

    $: if ($navigating?.to?.url==$page.url) setTimeout(() => scrollTo(0, innerHeight), 1)

    let packs : MPack[] = modpacks
    let banner : string | null
    let generateBanner = (pool : string[]) => {
        banner = pool[Math.floor(Math.random() * pool.length)]
    }

    let possibleBanners : string[] = consts.ADDITIONAL_BANNERS
    packs.forEach(p => {
        if (p.banner) possibleBanners.push(p.banner)
    })
    generateBanner(possibleBanners)

    let maxScale : number = 100
    let minScale : number = 90
    let animations : {scale: Tweened<number>, scaleup: boolean}[] = [...Array(16).keys()].map(i => {return {scale: tweened(minScale - ((Math.floor(i / 4) + i % 4) * 5), {duration: 750, easing: sineOut}), scaleup: false}})

    let modpacksHovered : boolean = false

    let partnerQueueLen : number | null
    let partnerModpacks : HTMLElement | null

    onMount(() => {
        let nav = $navigating

        setTimeout(() => {
            partnerQueueLen = $reducedMotion ? partneredModpacks.length : Math.max(partneredModpacks.length+2, 8)
            if ($reducedMotion) generateBanner(possibleBanners.filter(b => !b.endsWith(".gif")))

            let shouldShowOpacityAnim = !$scrollY && !nav && !$reducedMotion

            let title : HTMLElement | null = document.getElementById("title")
            let bg : HTMLElement | null = document.getElementById("bg")
            let arrowClasses : DOMTokenList | undefined = document.getElementById("arrow")?.classList

            if ($scrollY || nav) {
                banner = $previousRandomBanner
                arrowClasses?.add("hidden")
            }
            else {
                $randomSplash = randomChoice($json("splashes") as any[])
                $previousRandomBanner = banner!

                if (!$reducedMotion) {
                    document.body.classList.add("overflow-y-hidden")
                    setTimeout(() => {document.body.classList.remove("overflow-y-hidden")}, 2500)
                }
            }

            setTimeout(() => {removeOpacity(title?.children, shouldShowOpacityAnim)}, !shouldShowOpacityAnim ? 0 : 500)

            document.addEventListener("scroll", () => {
                arrowClasses?.remove("duration-[1s]", "delay-[2s]")
                arrowClasses?.add(`duration-[${$reducedMotion ? '0s' : '.25s'}]`, "opacity-0", "scale-0")

                if ($reducedMotion) return

                bg!.style.backgroundPositionY = `${Math.max($scrollY*.5-10, 0)}px`
            })
        }, 1)

        setInterval(() => {
            animations.forEach(anim => {
                anim.scale.set(get(anim.scale) + (anim.scaleup ? 1 : -1))

                if ((anim.scaleup && get(anim.scale)>maxScale)) anim.scaleup = false
                else if (get(anim.scale)<minScale) anim.scaleup = true
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

    <div class="pt-16 pb-8 pl-10 bg-primary-dark flex gap-32 [&>*]:text-center">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="grid grid-cols-4 gap-[4.5rem] min-w-[770px] min-h-[770px] aspect-square group"
            on:mouseenter={() => {modpacksHovered = true}} on:mouseleave={() => {modpacksHovered = false}}
        >
            {#each [...Array(16).keys()] as i}
                <Modpack index={i} scale={$reducedMotion ? null : animations[i].scale} bind:parentHover={modpacksHovered} />
            {/each}
        </div>
        <div class="flex flex-col gap-5 items-center">
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

    <div class="py-8 px-10 h-[95vh] bg-black flex items-center justify-center [&>*]:text-center">
        <div>

        </div>
        <div class="bg-[radial-gradient(circle,_#1c1c1c_0%,_transparent_80%)] h-[95%] p-16 aspect-square rounded-full flex flex-col gap-5 items-center justify-center">
            <h2>{$_("projects.hellish.heading")}</h2>
            <p class="w-[90%]">{$_("projects.hellish.desc")}</p>

            <span class="flex gap-4 items-center [&>a]:duration-200 [&_img]:brightness-0 [&_img]:invert">
                <a href="{consts.HELLISH_URL}" target="_blank" rel="noopener noreferrer" class="hover:scale-125"><img src="{consts.WEBSITE_ICONS.curseforge}" alt="logo curseforge" class="h-12"></a>
                <a href="{consts.SOCIALS.modrinth.url}" target="_blank" rel="noopener noreferrer" class="hover:scale-125"><img src="{consts.WEBSITE_ICONS.modrinth}" alt="logo curseforge" class="h-10"></a>
            </span>
        </div>
    </div>
</main>