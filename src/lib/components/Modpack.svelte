<script lang="ts">
    import Saos from "saos"
    import consts from "$lib/scripts/consts"
    import { type Modpack } from "$lib/scripts/interfaces"
    import modpacks from "$lib/json/modpacks.json5"
    import { mobile, mousePos, popupOpenedBy, popupOpenedByPartner, reducedMotion, scrollY, upsideDownLocale } from "$lib/scripts/stores"
    import ModpackPopup from "./ModpackPopup.svelte"
    import { _ } from "svelte-i18n"
    import BreathingIcon from "./BreathingIcon.svelte";
    import { calculateElementCenter } from "$lib/scripts/utils";

    export let index : number
    export let parentHover : boolean

    let element : HTMLElement
    let popupToggle : (() => void) | undefined // The toggle function of the attached popup

    let modpack : Modpack
    $: modpack = modpacks[index]
    let discovered : boolean
    $: discovered = !!Object.keys(modpack).length // Whether the modpack is accessible to the public or not
    let path : string
    $: path = `${('0'+(index+1)).slice(-2)}${consts.COLORS[index]}` // The pointer to the pack's icon on the github asset repo (https://github.com/Modern-Modpacks/assets)

    let thisPackOpened : boolean // Whether this pack is opened
    $: thisPackOpened = $popupOpenedBy!=null && $popupOpenedBy.abbr==modpack.abbr

    // Mouse follow animation shenanigans
    let transformX : number
    $: transformX = ($mousePos.x - calculateElementCenter(element).x) * mouseMoveMul * +(parentHover && !$popupOpenedBy)
    let transformY : number
    $: transformY = ($mousePos.y - calculateElementCenter(element).y) * mouseMoveMul * +(parentHover && !$popupOpenedBy)

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
        style="transform: translateX({transformX * +(!$reducedMotion && !$mobile)}px) translateY({transformY * +(!$reducedMotion && !$mobile)}px);"
        title="{discovered ? $_(`modpacks.${modpack.abbr?.toLowerCase()}.shortdesc`) : ""}"
        on:mouseenter={() => {parentHover=false}} on:mouseleave={() => {parentHover=true}}
        on:click={popupToggle}
    >
        <BreathingIcon 
            duration={2000} minScale={90} maxScale={100} delay={(Math.floor(index / 4) + index % 4) * 500}
            class="
                w-full h-full [&>img]:rounded-xl bg-cover relative motion-safe:duration-150 cursor-{discovered ? "pointer" : "not-allowed"} z-10 flex justify-center
                {$popupOpenedBy!=null && !$popupOpenedByPartner ? (thisPackOpened ? "motion-safe:desktop:!scale-110" : "motion-safe:desktop:!scale-[90%]") : `motion-safe:desktop:[&:not(:hover)]:group-hover:!scale-[90%] motion-safe:desktop:hover:!scale-${discovered ? 110 : 100}`}
            "
            bind:element={element}
        >
        <!-- $popupOpenedBy.abbr==modpack.abbr -->
            <img src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/BG/{path}.png" alt="{consts.COLORS[index]} background">
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <img
                class="scale-[102%] duration-200 absolute rendering-pixelated peer z-10{discovered ? ` motion-safe:desktop${thisPackOpened ? "" : ":hover"}:opacity-0` : ""}"
                src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG.png"
                style="--mask: url('https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/inverted/{index * +discovered}inverted.png');"
                alt="{modpack.name} icon inverted"
            >
            {#if discovered && !$reducedMotion}
                <img
                    class="scale-[102%] duration-200 absolute rendering-pixelated peer opacity-0 desktop{thisPackOpened ? "" : ":peer-hover"}:opacity-100"
                    src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG.png"
                    style="--mask: url('https://raw.githubusercontent.com/Modern-Modpacks/assets/main/FG/{path}_{modpack.abbr}.png');"
                    alt="{modpack.name} icon"
                >
            {/if}

            {#if !$mobile}
                {@const translateAmount = 4 * ($upsideDownLocale ? -1 : 1)}

                <h3 class="absolute bottom-0 text-2xl font-bold -z-10 motion-safe:invisible {thisPackOpened ? "" : "peer-hover:"}!visible motion-safe{thisPackOpened ? "" : ":peer-hover"}:translate-y-[{translateAmount}rem] motion-reduce:translate-y-[{translateAmount}rem] motion-safe:duration-150">
                    {modpack.name ?? ""}
                </h3>
            {/if}
        </BreathingIcon>
    </div>
</Saos>