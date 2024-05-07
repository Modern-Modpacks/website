<script lang="ts">
    import { navigating, page } from "$app/stores";
    import consts from "$lib/scripts/consts"
    import { randomSplash, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { onMount } from "svelte"
    import { ChevronsDown } from "lucide-svelte"
    import { randomChoice } from "$lib/scripts/utils";
    import { _, json } from "svelte-i18n";

    let removeOpacity = (children : HTMLCollection | undefined, withAnimation : boolean) => {
        for (let child of children!) {
            removeOpacity(child.children, withAnimation)
            if (!withAnimation) child.classList?.add("!duration-0", "!delay-0")
            child.classList?.remove("opacity-0", "translate-y-10")
        }
    }

    $: if ($navigating?.to?.url==$page.url) setTimeout(() => scrollTo(0, innerHeight), 1)

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

    <div class="h-[45rem] my-10 mx-10 flex [&>*]:flex-1 [&>*]:text-center">
        <div class="grid grid-cols-4 gap-16">
            {#each [...Array(16).keys()] as i}
                <img src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/BG/{('0'+(i+1)).slice(-2)}{consts.COLORS[i]}.png" alt="icon background">
            {/each}
        </div>
        <div class="flex flex-col gap-5 items-center">
            <h1>{$_("projects.modpacks.heading")}</h1>
            <p>{$_("projects.modpacks.desc")}</p>
        </div>
    </div>
</main>