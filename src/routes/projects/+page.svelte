<script lang="ts">
    import { navigating } from "$app/stores";
    import consts from "$lib/scripts/consts"
    import { randomSplash, scrollY } from "$lib/scripts/stores"
    import { onMount } from "svelte"
    import { ChevronsDown } from "lucide-svelte"
    import { randomChoice } from "$lib/scripts/utils";
    import { _, json } from "svelte-i18n";

    let removeOpacity = (children : HTMLCollection | undefined, withAnimation : boolean) => {
        for (let child of children!) {
            removeOpacity(child.children, withAnimation)
            if (!withAnimation) child.classList?.add("!duration-0", "!delay-0")
            child.classList?.remove("opacity-0")
        }
    }

    $: if ($navigating) setTimeout(() => scrollTo(0, innerHeight), 1)

    onMount(() => {
        let title : HTMLElement | null = document.getElementById("title")
        let arrowClasses : DOMTokenList | undefined = document.getElementById("arrow")?.classList

        if ($scrollY) arrowClasses?.add("hidden")
        else {
            if (!$navigating) $randomSplash = randomChoice($json("splashes") as any[])

            document.body.classList.add("overflow-y-hidden")
            setTimeout(() => {document.body.classList.remove("overflow-y-hidden")}, 1500)
        }

        removeOpacity(title?.children, !$scrollY)

        document.addEventListener("scroll", () => {
            arrowClasses?.remove("duration-[1s]", "delay-[2.5s]")
            arrowClasses?.add("duration-[.25s]", "opacity-0", "scale-0")
        })
    })
</script>

<main>
    <div class="w-[100vw] h-[100vh] bg-black flex gap-10 items-center justify-center" id="title">
        <img src="{consts.LOGO_URL}" class="w-64 h-64 rounded-xl opacity-0 duration-[.5s]" alt="logo">
        <span class="w-[60%] flex flex-col gap-3">
            <h1 class="opacity-0 duration-[.5s] delay-[.5s]">Modern Modpacks</h1>
            <h2 class="opacity-0 duration-[.5s] delay-[.75s]">{$randomSplash}</h2>
        </span>
        <ChevronsDown class="absolute bottom-7 w-10 h-auto opacity-0 duration-[1s] delay-[2.5s] animate-float animate-duration-[5s]" id="arrow"/>
    </div>

    <div class="h-[45rem] my-10 mx-10 flex [&>*]:flex-1 [&>*]:text-center">
        <div>
            
        </div>
        <div class="flex flex-col gap-5 items-center">
            <h1>{$_("projects.modpacks.heading")}</h1>
            <p>{$_("projects.modpacks.desc")}</p>
        </div>
    </div>
</main>