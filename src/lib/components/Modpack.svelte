<script lang="ts">
    import Saos from "saos"
    import consts from "$lib/scripts/consts"
    import { type Modpack } from "$lib/scripts/interfaces"
    import modpacks from "$lib/json/modpacks.json5"
    import { mousePos, popupOpened, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { type Tweened } from "svelte/motion"
    import ModpackPopup from "./ModpackPopup.svelte"
    import { _ } from "svelte-i18n"

    export let index : number
    export let scale : Tweened<number> | null = null // Animation shenanigans
    export let parentHover : boolean

    let element : HTMLElement
    let popupToggle : (() => void) | undefined // The toggle function of the attached popup

    let modpack : Modpack
    $: modpack = modpacks[index]
    let discovered : boolean
    $: discovered = !!Object.keys(modpack).length // Weather the modpack is accessible to the public or not
    let path : string
    $: path = `${('0'+(index+1)).slice(-2)}${consts.COLORS[index]}` // The pointer to the pack's icon on the github asset repo (https://github.com/Modern-Modpacks/assets)

    // More animation shenanigans, this one for the mouse follow anim
    let transformX : number
    $: transformX = ($mousePos.x - (element?.getBoundingClientRect().left + (element?.getBoundingClientRect().width / 2))) * mouseMoveMul * +(parentHover && !$popupOpened)
    let transformY : number
    $: transformY = ($mousePos.y - (element?.getBoundingClientRect().top + (element?.getBoundingClientRect().height / 2) + $scrollY)) * mouseMoveMul * +(parentHover && !$popupOpened)

    const mouseMoveMul = .05
</script>

<style>
    @keyframes -global-appear {
        from {
            @apply opacity-0
        }
        to {
            @apply opacity-100
        }
    }

    img {
        mask-image: var(--mask);
        mask-size: cover;
    }
</style>

{#if discovered}
    <div class="w-0 h-0 absolute" style="mask-image: url(https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/{path+"_"+modpack.abbr}.png);"/>
    <ModpackPopup bind:toggle={popupToggle} modpack={modpack} icon={`https://raw.githubusercontent.com/Modern-Modpacks/assets/main/Icons/1024px/${modpack.abbr}.png`} color={"mm-"+consts.COLORS[index]} partner={false} />
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Saos animation={$reducedMotion ? "" : `appear .25s ${.1*(index%4)}s backwards`} once={true}>
    <div
        class="flex justify-center duration-200 aspect-square"
        style="transform: translateX({transformX*+!$reducedMotion}px) translateY({transformY*+!$reducedMotion}px)"
        title="{discovered ? $_(`modpacks.${modpack.abbr?.toLowerCase()}.shortdesc`) : ""}"
        on:mouseenter={() => {parentHover=false}} on:mouseleave={() => {parentHover=true}}
        on:click={popupToggle}
    >
        <div
            bind:this={element}
            class="[&>img]:rounded-xl bg-cover relative motion-safe:duration-150 motion-safe:[&:not(:hover)]:group-hover:!scale-[90%] motion-safe:hover:!scale-{discovered ? 110 : 100} cursor-{discovered ? "pointer" : "not-allowed"} z-10 flex justify-center"
            style="transform: scale({scale!=null ? $scale : 100}%);"
        >
            <img src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/BG/{path}.png" alt="icon background">
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <img
                class="scale-[102%] duration-200 absolute rendering-pixelated peer z-10{discovered ? " motion-safe:hover:opacity-0" : ""}"
                src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG.png"
                style="--mask: url('https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/inverted/{index*+discovered}inverted.png');"
                alt="icon foreground inverted"
            >
            {#if discovered && !$reducedMotion}
                <img
                    class="scale-[102%] duration-200 absolute rendering-pixelated peer opacity-0 peer-hover:opacity-100"
                    src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG.png"
                    style="--mask: url('https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/{path}_{modpack.abbr}.png');"
                    alt="icon foreground"
                >
            {/if}
    
            <h3 class="absolute top-16 text-2xl font-bold -z-10 motion-safe:invisible peer-hover:!visible motion-safe:peer-hover:translate-y-[4.7rem] motion-reduce:translate-y-[4.7rem] motion-safe:duration-150">
                {modpack.name ?? ""}
            </h3>
        </div>
    </div>
</Saos>