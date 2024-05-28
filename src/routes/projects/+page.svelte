<script lang="ts">
    import { navigating, page } from "$app/stores";
    import consts from "$lib/scripts/consts"
    import { randomSplash, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { onMount } from "svelte"
    import { ChevronsDown } from "lucide-svelte"
    import { randomChoice } from "$lib/scripts/utils";
    import { _, json } from "svelte-i18n";
    import Modpack from "$lib/components/Modpack.svelte";
    import { tweened, type Tweened } from "svelte/motion";
    import { get } from "svelte/store";
    import { cubicIn, cubicInOut, cubicOut, sineOut } from "svelte/easing";

    let removeOpacity = (children : HTMLCollection | undefined, withAnimation : boolean) => {
        for (let child of children!) {
            removeOpacity(child.children, withAnimation)
            if (!withAnimation) child.classList?.add("!duration-0", "!delay-0")
            child.classList?.remove("opacity-0", "translate-y-10")
        }
    }

    $: if ($navigating?.to?.url==$page.url) setTimeout(() => scrollTo(0, innerHeight), 1)

    let maxScale : number = 100
    let minScale : number = 90
    let animations : {scale: Tweened<number>, scaleup: boolean}[] = [...Array(16).keys()].map(i => {return {scale: tweened(minScale - ((Math.floor(i / 4) + i % 4) * 5), {duration: 750, easing: sineOut}), scaleup: false}})

    let modpacksHovered : boolean = false

    onMount(() => {
        let nav = $navigating

        setTimeout(() => {
            let shouldShowOpacityAnim = !$scrollY && !nav && !$reducedMotion

            let title : HTMLElement | null = document.getElementById("title")
            let bg : HTMLElement | null = document.getElementById("bg")
            let arrowClasses : DOMTokenList | undefined = document.getElementById("arrow")?.classList

            if ($scrollY || nav) arrowClasses?.add("hidden")
            else {
                $randomSplash = randomChoice($json("splashes") as any[])

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
        <div class="absolute bg-[url('https://raw.githubusercontent.com/Modern-Modpacks/assets/main/continuouspixelanim.gif')] w-full h-full -z-10 object-cover" id="bg" />

        <img src="{consts.LOGO_URL}" class="w-64 h-64 rounded-xl opacity-0 translate-y-10 duration-[.5s]" alt="logo" draggable="false">
        <span class="w-[60%] flex flex-col gap-3">
            <h1 class="opacity-0 translate-y-10 duration-[.5s] delay-[.5s]">Modern Modpacks</h1>
            <h2 class="opacity-0 translate-y-10 duration-[.5s] delay-[.75s]">{$randomSplash}</h2>
        </span>
        <ChevronsDown class="absolute bottom-7 w-10 h-auto opacity-0 duration-[1s] delay-[2s] animate-float animate-duration-[5s]" id="arrow"/>
    </div>

    <div class="h-[45rem] my-16 mx-10 flex gap-24 [&>*]:text-center">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="grid grid-cols-4 gap-[4.5rem] w-[48rem] h-[48rem] aspect-square group"
            on:mouseenter={() => {modpacksHovered = true}} on:mouseleave={() => {modpacksHovered = false}}
        >
            {#each [...Array(16).keys()] as i}
                <Modpack index={i} scale={$reducedMotion ? null : animations[i].scale} bind:parentHover={modpacksHovered} />
            {/each}
        </div>
        <div class="flex flex-col gap-5 items-center">
            <h1>{$_("projects.modpacks.heading")}</h1>
            <p>{$_("projects.modpacks.desc")}</p>
        </div>
    </div>
</main>