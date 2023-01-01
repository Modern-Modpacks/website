<script>
    // Imports
    import { onMount } from "svelte"
    import Modpack from "./components/Modpack.svelte"
    import modpacks from "./json/modpacks.json"
    import mods from "./json/mods.json"
    import contributors from "./json/contributors.json"

    // Lang stuff
    import en_us from "./lang/en-US.json"
    const langs = {
        "en-US": en_us
    }
    
    let locale = navigator.language
    // locale = "en-US" // Un-comment for debuging purposes
    const lang = {...langs["en-US"], ...langs[locale]} // Get locale lang + english

    // Consts and vars
    const random = (min, max) => Math.floor(Math.random() * (max-min) + min)
    const modpacklist = Array.from(modpacks.entries()) // Enum modpacks
    const links = [
        {
            "title": "Discord",
            "url": "https://discord.gg/ZTTw4J6aYu",
            "img": "https://www.svgrepo.com/show/353655/discord-icon.svg"
        },

        {
            "title": "GitHub",
            "url": "https://github.com/Modern-Modpacks",
            "img": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="
        },

        {
            "title": "CurseForge",
            "url": "https://www.curseforge.com/members/modernmodpacks",
            "img": "https://gist.githubusercontent.com/thecodewarrior/110057b210551c4ecf2c9be6d58ff824/raw/38748511ca1eb5677f009092fb3fcd71cc76cdf0/logo.svg"
        },

        {
            "title": "YouTube",
            "url": "https://www.youtube.com/channel/UCgfqMIZPXL64d7HDhM8_Dfg",
            "img": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNjE1IDMuMTg0Yy0zLjYwNC0uMjQ2LTExLjYzMS0uMjQ1LTE1LjIzIDAtMy44OTcuMjY2LTQuMzU2IDIuNjItNC4zODUgOC44MTYuMDI5IDYuMTg1LjQ4NCA4LjU0OSA0LjM4NSA4LjgxNiAzLjYuMjQ1IDExLjYyNi4yNDYgMTUuMjMgMCAzLjg5Ny0uMjY2IDQuMzU2LTIuNjIgNC4zODUtOC44MTYtLjAyOS02LjE4NS0uNDg0LTguNTQ5LTQuMzg1LTguODE2em0tMTAuNjE1IDEyLjgxNnYtOGw4IDMuOTkzLTggNC4wMDd6Ii8+PC9zdmc+"
        },

        {
            "title": "Twitter",
            "url": "https://twitter.com/ModernModpacks",
            "img": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgNC41NTdjLS44ODMuMzkyLTEuODMyLjY1Ni0yLjgyOC43NzUgMS4wMTctLjYwOSAxLjc5OC0xLjU3NCAyLjE2NS0yLjcyNC0uOTUxLjU2NC0yLjAwNS45NzQtMy4xMjcgMS4xOTUtLjg5Ny0uOTU3LTIuMTc4LTEuNTU1LTMuNTk0LTEuNTU1LTMuMTc5IDAtNS41MTUgMi45NjYtNC43OTcgNi4wNDUtNC4wOTEtLjIwNS03LjcxOS0yLjE2NS0xMC4xNDgtNS4xNDQtMS4yOSAyLjIxMy0uNjY5IDUuMTA4IDEuNTIzIDYuNTc0LS44MDYtLjAyNi0xLjU2Ni0uMjQ3LTIuMjI5LS42MTYtLjA1NCAyLjI4MSAxLjU4MSA0LjQxNSAzLjk0OSA0Ljg5LS42OTMuMTg4LTEuNDUyLjIzMi0yLjIyNC4wODQuNjI2IDEuOTU2IDIuNDQ0IDMuMzc5IDQuNiAzLjQxOS0yLjA3IDEuNjIzLTQuNjc4IDIuMzQ4LTcuMjkgMi4wNCAyLjE3OSAxLjM5NyA0Ljc2OCAyLjIxMiA3LjU0OCAyLjIxMiA5LjE0MiAwIDE0LjMwNy03LjcyMSAxMy45OTUtMTQuNjQ2Ljk2Mi0uNjk1IDEuNzk3LTEuNTYyIDIuNDU3LTIuNTQ5eiIvPjwvc3ZnPg=="
        },

        {
            "title": "E-Mail",
            "url": "mailto:info@modernmodpacks.site",
            "img": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMTIuNzEzbC0xMS45ODUtOS43MTNoMjMuOTcxbC0xMS45ODYgOS43MTN6bS01LjQyNS0xLjgyMmwtNi41NzUtNS4zMjl2MTIuNTAxbDYuNTc1LTcuMTcyem0xMC44NSAwbDYuNTc1IDcuMTcydi0xMi41MDFsLTYuNTc1IDUuMzI5em0tMS41NTcgMS4yNjFsLTMuODY4IDMuMTM1LTMuODY4LTMuMTM1LTguMTEgOC44NDhoMjMuOTU2bC04LjExLTguODQ4eiIvPjwvc3ZnPg=="
        }
    ] // Social links

    // Modpack related-stuff
    const banners = [] // Banner images
    const potatoes = [] // Packs that require 4GBs of RAM or less
    modpacks.forEach(pack => {
        if (pack.name!=null) {
            banners.push(pack.assets.banner)
            pack.ram.minimum <= 4 ? potatoes.push(pack) : null
        }
    })
    let randomcontrib = contributors[random(0, contributors.length)]
    setInterval(() => {
        const fgchildren = document.getElementById("fg").children
        for (const c of fgchildren) {c.classList.add("animate-fg")} // Add sliding animation

        setTimeout(() => {
            const contriblist = contributors.length>1 ? contributors.filter(c => c.name!=randomcontrib.name) : contributors
            randomcontrib = contriblist[random(0, contriblist.length)]
            setTimeout(() => {
                for (const c of fgchildren) {c.classList.remove("animate-fg")} // Remove sliding animation
            }, 1000)
        }, 1000)
    }, 10000)

    // Page-reload related stuff
    let splash = null // Banner splash
    let popups = {} // Popup open functions
    let popup = window.location.hash.replace("#", "") // Get opened popup

    // On page load
    onMount(() => {
        if (window.scrollY==0 && !Object.keys(popups).includes(popup)) { // If window is not scrolled by y or there's no valid popup, play the starting animation
            document.body.id = "noscroll" // Disable scroll
            setTimeout(() => {document.body.id = ""}, 2000); // Enable scroll in 2 seconds
            
            // And pick a new splash
            if (localStorage.getItem("splash")!=null)
                splash = lang.splashes[random(0, lang.splashes.length)]
        }
        else { // Else
            document.getElementById("banner").style.animation = "none" // Stop the starting animation
            for (const e of document.getElementById("banner").children) { // Stop children's starting animations
                e.style.animation = "none"
            }
            splash = localStorage.getItem("splash") // Set splash to previous splash

            Object.keys(popups).includes(popup) && popups[popup](true) // Open popup
        }

        if (splash==null) { // If it's the first time you visit the website, set splash to welcome_splash
            splash = lang.welcome_splash
        }

        localStorage.setItem("splash", splash) // Store splash in local storage
    })
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');

    * {
        font-family: "Reem Kufi Fun", monospace, sans-serif;
        color: white;
        text-align: center;
        font-weight: 300;
    }

    :global(body)::-webkit-scrollbar {
        display: none;
    }

    :global(body) {
        overflow-x: hidden;

        background-color: black;
    }
    :global(#noscroll) {
        overflow-y: hidden;
    }

    main {
        position: absolute;
        left: 0;
        top: 0;
    }

    @keyframes bg_color {
        from {
            background-color: rgba(0, 0, 0, 1);
        }
        to {
            background-color: rgba(0, 0, 0, 0.5);
        }
    }
    @keyframes shrink {
        from {
            height: 100vh;
        }
        to {
            height: 50vh;
        }
    }
    @keyframes opacity {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes float {
        from {
            margin-top: -15px;
        }
        to {
            margin-top: 15px;
        }
    }
    @keyframes scroll {
        from {
            transform: translateY(0%);
        }
        to {
            transform: translateY(100%);
        }
    }
    @keyframes slide {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-100vw);
        }
    }

    div {
        width: 100vw;
        padding-block: 20px;

        background-color: black;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    h1 {
        margin: 0;
        font-size: 3em;
    }
    h1, h2 {
        font-weight: 700;
    }
    h4 {
        position: absolute;
        
        bottom: 0;
        left: 0;
        right: 0;
        margin-bottom: 0;
        margin-inline: auto;

        color: #0f0f0f;
        font-size: .7em;

        cursor: default;
    }
    p {
        white-space: pre-line;

        font-size: 1.5em;
    }
    :global(b) {
        font-weight: 600;
    }

    .bigicon {
        height: 15vw;
    }

    #banner {
        height: 50vh;

        background-size: cover;
        background-blend-mode: darken;
        background-position: center;

        animation: bg_color 1.5s, shrink .5s 2s both;
        animation-iteration-count: 1;
        background-color: rgba(0, 0, 0, 0.5);
    }
    #logo {
        width: 25vh;
        height: auto;
        image-rendering: pixelated;

        border-radius: 10%;

        animation: opacity .5s both;
        animation-delay: 1s;
    }
    #banner > h1 {
        margin: 10px;

        animation: opacity .25s both;
        animation-delay: 1.5s;

        font-weight: bold;

        background-color: black;
        color: white;
    }
    #banner > h2 {
        margin-top: 0;

        animation: opacity .25s both;
        animation-delay: 1.75s;

        font-weight: normal;
        text-align: center;
    }

    #modpacks {
        display: grid;
        grid-template-columns: repeat(4, 100px);

        column-gap: 3em;

        align-items: start;
    }

    .inline {
        flex-direction: row;
        justify-content: space-around;
    }
    .inline > * {
        margin-inline: 25px;
    }
    .backwards {
        flex-direction: row-reverse;
    }
    
    #difficulty > div {
        flex-direction: row;
        gap: 15px;
        width: 60vw;
    }
    #difficulty > div > div {
        height: 75vh;
        width: auto;

        padding: 0;

        justify-content: space-between;
    }
    #difficulty > div > div > h2 {
        margin: 0;
    }
    #scale {
        background-image: linear-gradient(#8e2121, #f1af15, #5ea918);
        border-radius: 15px;
        width: 20px !important;
    }
    #icons {
        display: grid;
        grid-template-rows: repeat(9, 1fr);

        column-gap: 5px;
        row-gap: 7%;
    }
    #icons > img {
        width: 30px;
        border-radius: 5px;
        cursor: pointer;
    }

    #potatoes {
        width: auto;

        flex-direction: column;
    }
    #potatoes > div {
        width: 100%;
        padding-block: 0;

        flex-direction: row;
        column-gap: 20px;

        cursor: pointer;
    }
    #potatoes > div > img {
        height: 50px;
        border-radius: 5px;
    }

    #hellish {
        padding: 0;
    }
    #hellish > a {
        height: 42vh;

        margin-left: 0;
        margin-right: auto;
    }
    #hellish > a > img {
        height: 100%;
        image-rendering: pixelated;

        margin-left: -15%;

        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
    }
    :global(#hellish a) {
        text-decoration: none;
        color: white;
    }
    #hellish > div {
        width: auto;
        padding: 0;
    }
    #hellish > div > div {
        width: 30vw;
        
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2vw;
    }
    #hellish > div > div img {
        height: 50px;
        border-radius: 5px;
    }

    #contributors {
        position: relative;

        height: 50vh;
        overflow: hidden;

        padding-block: 0;

        flex-wrap: wrap;
    }
    #contributors > #bg {
        position: absolute;

        height: 100%;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10vw, 1fr));
        grid-auto-rows: 1fr;

        align-content: center;
    }
    #contributors > #bg > img {
        object-fit: cover;
        width: 100%;
        max-height: 100%;

        animation: scroll 10s infinite linear;
    }
    #contributors > #fg {
        width: 60vw;
        height: 100%;

        z-index: 1;
        padding-left: 20px;

        align-self: flex-start;
        align-items: flex-start;

        background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    }
    #contributors > #fg > img {
        height: 250px;
        border-radius: 50px;
    }
    #contributors > #fg > h2 {
        margin-bottom: 0;
    }
    #contributors > #fg > p {
        width: 30vw;
        text-align: start;

        margin-block: 10px;
    }
    #contributors > #fg > a > img {
        filter: invert(1);
    }
    :global(.animate-fg) {
        animation: slide 1s alternate infinite;
    }
    #contributors > #fgtext {
        z-index: 1;
        width: 40vw;
        height: 100%;

        margin-right: 0;
        margin-left: auto;
        margin-block: 0;

        align-items: flex-end;

        background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    }
    #contributors > #fgtext > p {
        width: 70%;
        margin-right: 10%;

        font-size: 1.15em;
    }

    h1, #socials {
        background-color: #0f0f0f;
    }
    #socials {
        flex-direction: row;
        align-items: center;
        gap: 20px;

        padding-block: 20px;
    }
    #socials > a {
        height: 35px;
        width: 35px;
    }
    #socials > a > img {
        height: 100%;
        width: 100%;

        filter: brightness(0) invert(1);
        transition: filter .2s;
    }
    #socials > a:hover img {
        filter: brightness(0) invert(.5);
    }

    @media (max-width: 850px) {
        p {
            font-size: 1.2em;
        }
        h1 {
            font-size: 2em;
        }

        .bigicon {
            height: 45vw;
        }

        .inline {
            flex-direction: column;
        }

        #modpacks {
            grid-template-columns: repeat(4, 50px);
            grid-auto-rows: 100px;
        }

        #difficulty > div > div {
            height: 50vh;
        }

        #potatoes > div > img {
            height: 50px;
        }

        #hellish > a {
            margin-left: auto;
            margin-top: 25px;

            height: auto;
        }
        #hellish > a > img {
            margin-left: 0;

            border-radius: 20px;
        }
        #hellish p {
            margin-bottom: 0;
        }

        #contributors {
            height: 90vh;
            flex-direction: row;
        }
        #contributors > #bg {
            grid-template-columns: repeat(auto-fill, minmax(15vw, 1fr));
        }
        #contributors > #fg, #contributors > #fgtext {
            width: 100%;
            height: 50%;

            background: rgba(0, 0, 0, .5);
        }
        #contributors > #fg {
            padding: 0;
            padding-top: 12%;

            align-items: center;
        }
        #contributors > #fg > img {
            height: 200px;
        }
        #contributors > #fg > p {
            text-align: center;
            width: 50%;
        }
        :global(.animate-fg) {
            animation: none;
        }
        #contributors > #fgtext {
            padding-top: 0;
        }
        #contributors > #fgtext > p {
            font-size: 1.6vh;

            margin-inline: auto;
        }
    }
</style>

<main>
    <div id="banner" style="background-image: url({banners[random(0, banners.length)]});">
        <img src="https://avatars.githubusercontent.com/u/112729506?s=200&v=4" alt="logo" id="logo" draggable="false">
        <h1>Modern Modpacks</h1>
        <h2>{splash}</h2>
    </div>
    
    <h1>{lang.headings.modpacks}</h1>
    <div id="modpacks">
        {#each modpacklist as modpack}
            <Modpack modpack={modpack[1]} index={modpack[0]} lang={lang} bind:click={popups[modpack[1].abbr]}/>
        {/each}
    </div>

    <h1>{lang.headings.difficulty}</h1>
    <div id="difficulty" class="inline">
        <div>
            <div>
                {#each Array.from(Array(5).keys()).reverse() as i}
                    <h2>{i+1} ({["Vanila+", "Casual", "Expert", "Professional", "Gregic"][i]})</h2>
                {/each}
            </div>
            <div id="scale"/>
            <div id="icons">
                {#each modpacklist as pack}
                    {#if pack[1].name!=null}
                        <img on:click={() => {popups[pack[1].abbr]()}} title={pack[1].name} style="grid-row: {10 - Math.round((pack[1].difficulty-.5)*2)};" src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/icons/{("0" + (pack[0]+1)).slice(-2)}{pack[1].color}_{pack[1].abbr}.png" alt="{pack[1].name}">
                    {/if}
                {/each}
            </div>
        </div>

        <p>
            {@html lang.description.difficulty.join("\n\n")}
        </p>
    </div>

    <h1>{lang.headings.potato}</h1>
    <div class="inline backwards">
        <img class="bigicon" draggable="false" src="potato.png" alt="potato">
        
        <div id="potatoes">
            <p>{@html lang.description.potato}</p>

            {#each potatoes as potato}
                <div on:click={() => {popups[potato.abbr]()}}>
                    <img src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/Icons/1024px/{potato.abbr}.png" alt="icon">
                    <h2>{potato.name}</h2>
                </div>
            {/each}
        </div>
    </div>

    <h1>{lang.headings.hellish}</h1>
    <div class="inline" id="hellish">
        <a href="https://github.com/Hellish-Mods">
            <img draggable="false" src="https://avatars.githubusercontent.com/u/118846598?s=200&v=4" alt="logo">
        </a>
    
        <div>
            <p>{@html lang.description.hellish}</p>

            <div>
                {#each mods as mod}
                    <a href={mod.link} title={mod.name}>
                        <img src={mod.image} alt="modicon">
                    </a>
                {/each}
            </div>
        </div>
    </div>

    <h1>{lang.headings.mission}</h1>
    <div class="inline backwards">
        <img class="bigicon" draggable="false" src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b3/Compass_JE3_BE3.gif" alt="compass">

        <p>{@html lang.description.mission.join("\n\n")}</p>
    </div>

    <h1>{lang.headings.contributors}</h1>
    <div id="contributors">
        <div id="bg">
            {#each [...Array(150).keys()] as i}
                <img draggable="false" src="{contributors[i%contributors.length].pfp}" alt="avatar">
            {/each}
        </div>
        <div id="fg">
            <img src="{randomcontrib.pfp}" alt="avatar" draggable="false">
            <h2>{randomcontrib.name}</h2>
            <p>{lang.description.contributors[randomcontrib.name]}</p>
            <a href="{randomcontrib.link}">
                <img draggable="false" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==" alt="github">
            </a>
        </div>

        <div id="fgtext">
            <p>{@html lang.description.together.join("\n\n")}</p>
        </div>
    </div>

    <div id="socials">
        {#each links as link}
            <a href={link.url} draggable="false">
                <img src={link.img} alt={link.title} title={link.title} draggable="false">
            </a>
        {/each}
    </div>

    <h4>greg</h4>
</main>
