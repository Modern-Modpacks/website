<script lang="ts">
    import consts from "$lib/scripts/consts"
    import { type Modpack } from "$lib/scripts/interfaces";
    import modpacks from "$lib/json/modpacks.json"
    import { mousePos, popupOpened, reducedMotion, scrollY } from "$lib/scripts/stores"
    import { type Tweened } from "svelte/motion"
    import ModpackPopup from "./ModpackPopup.svelte";

    export let index : number
    export let scale : Tweened<number> | null = null
    export let parentHover : boolean

    let element : HTMLElement
    let popupToggle : (() => void) | undefined

    let modpack : Modpack
    $: modpack = modpacks[index]
    let discovered : boolean
    $: discovered = !!Object.keys(modpack).length
    let path : string
    $: path = `${('0'+(index+1)).slice(-2)}${consts.COLORS[index]}`

    let transformX : number
    $: transformX = ($mousePos.x - (element?.getBoundingClientRect().left + (element?.getBoundingClientRect().width / 2))) * mouseMoveMul * +(parentHover && !$popupOpened)
    let transformY : number
    $: transformY = ($mousePos.y - (element?.getBoundingClientRect().top + (element?.getBoundingClientRect().height / 2) + $scrollY)) * mouseMoveMul * +(parentHover && !$popupOpened)

    let inverted : boolean = true
    const mouseMoveMul = .05
</script>

<style>
    img {
        mask-image: var(--mask);
        mask-size: cover;
    }
</style>

{#if discovered}
    <div class="w-0 h-0 absolute" style="mask-image: url(https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/{path+"_"+modpack.abbr}.png);"/>
    <ModpackPopup bind:toggle={popupToggle} />
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
    class="flex justify-center duration-200"
    style="transform: translateX({transformX*+!$reducedMotion}px) translateY({transformY*+!$reducedMotion}px)"
    on:mouseenter={() => {parentHover=false}} on:mouseleave={() => {parentHover=true}}
    on:click={popupToggle}
>
    <div
        bind:this={element}
        class="[&>img]:rounded-xl bg-cover relative motion-safe:duration-150 motion-safe:[&:not(:hover)]:group-hover:!scale-[90%] motion-safe:hover:!scale-{discovered ? 110 : 100} cursor-{discovered ? "pointer" : "[not-allowed]"} z-10 flex justify-center"
        style="transform: scale({scale!=null ? $scale : 100}%);"
    >
        <img src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/BG/{path}.png" alt="icon background">
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <img
            class="scale-[102%] duration-[250ms] absolute rendering-pixelated peer" src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG.png" style="--mask: url('https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/{inverted ? "inverted/" : ""}{inverted ? `${index*+discovered}inverted` : path+"_"+modpack.abbr}.png');" draggable="false" alt="icon foreground"
            on:mouseenter={() => {inverted = !discovered || $reducedMotion}} on:mouseleave={() => {inverted = true}}
        >
    
        <h3 class="absolute top-16 text-2xl font-bold -z-10 motion-safe:invisible peer-hover:!visible motion-safe:peer-hover:translate-y-[4.7rem] motion-reduce:translate-y-[4.7rem] motion-safe:duration-150">
            {modpack.name ?? ""}
        </h3>
    </div>
</div>