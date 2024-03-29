<script>
    // Imports
    import { onMount } from "svelte"
    import Socials from "./components/Socials.svelte"
    import Modpack from "./components/Modpack.svelte"
    import modpacks from "./json/modpacks.json"
    import mods from "./json/mods.json"
    import projects from "./json/projects.json"
    import contributors from "./json/contributors.json"
    import LangPicker from "./components/LangPicker.svelte";

    import eng from "./lang/en-US.json"

    // Consts and vars
    const random = (min, max) => Math.floor(Math.random() * (max-min) + min)
    const modpacklist = Array.from(modpacks.entries()) // Enum modpacks
    $: lang = eng

    // Modpack related-stuff
    const banners = [] // Banner images
    modpacks.forEach(pack => {
        if (pack.name!=null) {
            banners.push(pack.assets.banner)
        }
    })

    let nextcontribcount = 0
    $: nextcontrib = contributors[nextcontribcount % contributors.length]

    setInterval(() => {
        const duration = 1500
        const fgchildren = document.querySelector("#contributors > #fg").children

        if (!window.matchMedia("(max-width: 850px)").matches) {
            for (const c of fgchildren) {
                c.animate([
                    {transform: "translateX(0)"},
                    {transform: "translateX(-100vw)"}
                ], {duration: duration, easing: "cubic-bezier(0.33, 1, 0.68, 1)"})
                c.animate([
                    {transform: "translateX(-100vw)"},
                    {transform: "translateX(0)"}
                ], {duration: duration-500, delay: duration, easing: "cubic-bezier(0.32, 0, 0.67, 0)"})
            } // Add sliding animation
        }

        setTimeout(() => nextcontribcount++, duration)
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
                change_splash()
        }
        else { // Else
            document.getElementById("banner").style.animation = "none" // Stop the starting animation
            for (const e of document.getElementById("banner").children) { // Stop children's starting animations
                // @ts-ignore
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

    function change_splash() {
        splash = lang.splashes[random(0, lang.splashes.length)]
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    * {
        font-family: "Montserrat", monospace, sans-serif;
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
            transform: translateY(var(--move-percent));
        }
    }
    @keyframes scrollX {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(var(--move-percent));
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
        padding: 10px;
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
        padding: 0;

        animation: opacity .25s both;
        animation-delay: 1.5s;

        font-weight: bold;

        background-color: black;
        color: white;
    }
    #banner > h2 {
        margin-block: 0;

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
        background-image: linear-gradient(#5ea918, #f1af15, #8e2121);
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

    #hellish {
        padding: 0;
    }
    #hellish > a {
        height: 42vh;

        margin-left: auto;
        margin-right: 0;
    }
    #hellish > a > img {
        height: 100%;
        image-rendering: pixelated;

        margin-right: -15%;

        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
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
        width: 50vw;
        
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1vw;
    }
    #hellish > div > div img {
        height: 100px;
        border-radius: 5px;

        transition: transform .3s;
    }
    #hellish > div > div img:hover {
        transform: scale(110%); 
    }

    #ecosystem {
        position: relative;
        overflow: hidden;

        flex-direction: column;

        height: 45vh;
    }
    #ecosystem > #fg {
        align-self: flex-start;

        height: 100%;
        width: 60vw;
        z-index: 1;

        pointer-events: none;

        align-items: flex-start;
        padding-left: 50px;
        margin: 0;

        background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    }
    #ecosystem > #fg > p {
        pointer-events: all;
        width: 50%;
        font-size: 2vh;
    }
    #ecosystem > #bg {
        position: absolute;
        row-gap: 15px;
    }
    #ecosystem > #bg > .row {
        display: grid;
        grid-auto-flow: column;
        
        gap: 15px;
        overflow: hidden;

        padding: 0;
    }
    #ecosystem > #bg > .row > .button {
        width: 25vw;
        animation: scrollX 30s linear infinite;
    }
    #ecosystem > #bg > .row.offset > .button {
        translate: 17.5vw;
    }
    #ecosystem > #bg > .row:hover > .button {
        animation-play-state: paused;
    }
    #ecosystem > #bg > .row > .button > a {
        background-color: #222222;
        border-radius: 15px;
        width: 100%;

        text-decoration: none;

        transition: transform .15s;
    }
    #ecosystem > #bg > .row:hover > .button > a {
        transform: scale(90%);
    }
    #ecosystem > #bg > .row > .button > a:hover {
        transform: scale(110%);
    }
    #ecosystem > #bg > .row > .button > a > p {
        font-size: 2vh;
        text-wrap: nowrap;
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
        aspect-ratio: 1/1;
        width: 100%;

        animation: scroll 30s infinite linear;
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
        height: 20vh;
        border-radius: 50px;
    }
    #contributors > #fg > h2 {
        margin-bottom: 0;
    }
    #contributors > #fg > p {
        width: 30vw;
        font-size: 1.2em;
        text-align: start;

        margin-block: 10px;
    }
    #contributors > #fg > a > img {
        filter: invert(1);
    }
    #contributors > #fgtext {
        z-index: 1;
        width: 37vw;
        height: 100%;

        line-height: 20px;

        margin-right: 0;
        margin-left: auto;
        margin-block: 0;

        align-items: flex-end;

        background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    }
    #contributors > #fgtext > p {
        width: 70%;
        margin-right: 10%;

        font-size: 1em;
    }

    h1 {
        background-color: #0f0f0f;
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

        #hellish > a {
            margin-right: auto;
            margin-top: 25px;

            height: auto;
        }
        #hellish > a > img {
            margin-right: 0;

            border-radius: 20px;
        }
        #hellish p {
            margin-bottom: 0;
        }
        #hellish > div > div {
            width: 100vw;
            gap: 2vw;
        }
        #hellish > div > div img {
            height: 65px;
        }

        #ecosystem {
            height: auto;
        }
        #ecosystem > #fg {
            width: 100%;
            padding: 0;
            background-color: #000000;

            flex-wrap: wrap;
            align-content: center;
        }
        #ecosystem > #fg > p {
            font-size: inherit;
        }
        #ecosystem > #bg {
            position: relative;
            row-gap: 0;
        }
        #ecosystem > #bg > .row > .button > a {
            padding: 5px;
        }
        #ecosystem > #bg > .row > .button > a > p {
            font-size: .65em;
        }

        #contributors {
            height: auto;
            flex-direction: row;
        }
        #contributors > #bg {
            grid-template-columns: repeat(auto-fill, minmax(15vw, 1fr));
        }
        #contributors > #fg, #contributors > #fgtext {
            width: 100%;
            height: auto;

            background: rgba(0, 0, 0, .5);
        }
        #contributors > #fg {
            padding: 0;
            padding-top: 5%;

            align-items: center;

            z-index: 2;
        }
        #contributors > #fg > img {
            height: 150px;
            border-radius: 25px;
        }
        #contributors > #fg > p {
            text-align: center;
            width: 50%;
        }
        #contributors > #fgtext {
            padding-block: 0;
        }
        #contributors > #fgtext > p {
            font-size: 1.6vh;

            margin-inline: auto;
        }
    }
</style>

<main>
    <div id="banner" style="background-image: url({banners[random(0, banners.length)]});">
        <LangPicker bind:lang={lang} change_splash={change_splash}/>
        <img src="https://avatars.githubusercontent.com/u/112729506?s=200&v=4" alt="logo" id="logo" draggable="false">
        <h1>Modern Modpacks</h1>
        <h2>{splash}</h2>
        <Socials splash={true}/>
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
                {#each Array.from(Array(5).keys()) as i}
                    <h2>{i+1} ({["Casual", "Advanced", "Difficult", "Professional", "Gregic"][i]})</h2>
                {/each}
            </div>
            <div id="scale"/>
            <div id="icons">
                {#each modpacklist as pack}
                    {#if pack[1].name!=null}
                        <img on:click={() => {popups[pack[1].abbr]()}} title={pack[1].name} style="grid-row: {Math.round((pack[1].difficulty-.5)*2)};" src="https://raw.githubusercontent.com/Modern-Modpacks/assets/main/icons/{("0" + (pack[0]+1)).slice(-2)}{pack[1].color}_{pack[1].abbr}.png" alt="{pack[1].name}">
                    {/if}
                {/each}
            </div>
        </div>

        <p>
            {@html lang.description.difficulty.join("\n\n")}
        </p>
    </div>

    <h1>{lang.headings.hellish}</h1>
    <div class="inline backwards" id="hellish">
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

    <h1>{lang.headings.ecosystem}</h1>
    <div class="inline" id="ecosystem">
        <div id="fg">
            <p>{@html lang.description.ecosystem.join("\n\n")}</p>
        </div>
        <div id="bg">
            {#each [...Array(3).keys()] as row}
                <div class="row {row%2==1 ? "offset" : ""}">
                    {#each [...Array(25).keys()].map(i => projects[(i+row)%projects.length]) as project}
                        <div class="button" style="--move-percent: calc({row%2==1 ? "-" : ""}{projects.length*100}% {row%2==1 ? "-" : "+"} {projects.length*15}px)">
                            <a href="{project.link}" title="{lang.description.projects[project.name.toLowerCase()]}">
                                <p>{project.icon} {project.name}</p>
                            </a>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <h1>{lang.headings.mission}</h1>
    <div class="inline backwards">
        <img class="bigicon" draggable="false" src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b3/Compass_JE3_BE3.gif" alt="compass">

        <p>{@html lang.description.mission.join("\n\n")}</p>
    </div>

    <h1>{lang.headings.contributors}</h1>
    <div id="contributors">
        <div id="bg" style="--move-percent: {contributors.length*100}%">
            {#each [...Array(contributors.length*100).keys()] as i}
                <img draggable="false" src="{contributors[i%contributors.length].pfp}" alt="avatar">
            {/each}
        </div>
        <div id="fg">
            <img src="{nextcontrib.pfp}" alt="avatar" draggable="false">
            <h2>{nextcontrib.name}</h2>
            <p>{lang.description.contributors[nextcontrib.name]}</p>
            <a href="{nextcontrib.link}">
                <img draggable="false" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==" alt="github">
            </a>
        </div>

        <div id="fgtext">
            <p>{@html lang.description.together.join("\n\n")}</p>
        </div>
    </div>

    <Socials splash={false}/>

    <h4>greg</h4>
</main>
