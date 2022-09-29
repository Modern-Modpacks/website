<script>
    // Imports
    import Popup from "./Popup.svelte";

    // External vars
    export let modpack
    export let index
    export let click

    // Consts and vars
    const discovered = modpack.name!=null
    let inverted = true
</script>

<style>
    h1 {
        font-size: 1.25em;
        text-align: center;
    }
    img {
        width: 100%;

        mask-image: var(--mask);
        -webkit-mask-image: var(--mask);
        mask-size: cover;
        -webkit-mask-size: cover;

        transition-property: mask-image, -webkit-mask-image;
        transition-duration: 0.2s;
    }

    #wrap {
        display: flex;
        flex-direction: column;
    }
    #logo {
        height: 100px;
        border-radius: 10%;

        background-size: cover;
    }
</style>

<div id="wrap" title="{discovered ? modpack.shortdesc : ""}" style="cursor: {discovered ? "pointer" : "not-allowed"};" on:click={() => {discovered && click()}}>
    <div on:mouseover={() => {discovered ? inverted=false : ""}} on:mouseleave={() => {discovered ? inverted=true : ""}} id="logo" style="background-image: url(https://github.com/Modern-Modpacks/assets/raw/main/BG/{("0"+(index+1)).slice(-2)}{modpack.color}.png)">
        <img draggable="false" style="--mask: url(/masks/{discovered ? index : "null"}{inverted ? "inverted" : ""}.png);" src="https://github.com/Modern-Modpacks/assets/raw/main/FG.png" alt="foreground">
    </div>
    <h1>{modpack.name!=null ? modpack.name : "???"}</h1>
</div>

<Popup modpack={modpack} bind:activate={click}/>