<script>
    // Imports
    import { onMount } from "svelte"
    import Modpack from "./components/Modpack.svelte"
    import splashes from "./json/splashes.json"
    import modpacks from "./json/modpacks.json"

    // Consts and vars
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
                splash = splashes[Math.floor(Math.random() * splashes.length)]
        }
        else { // Else
            document.getElementById("banner").style.animation = "none" // Stop the starting animation
            for (const e of document.getElementById("banner").children) { // Stop children's starting animations
                e.style.animation = "none"
            }
            splash = localStorage.getItem("splash") // Set splash to previous splash

            Object.keys(popups).includes(popup) && popups[popup](true) // Open popup
        }

        if (splash==null) { // If it's the first time you visit the website, set splash to "Welcome!"
            splash = "Welcome!"
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
    }

    :global(body)::-webkit-scrollbar {
        display: none;
    }

    :global(body) {
        overflow-x: hidden;
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
    }
    h4 {
        background-color: black;
        margin: 0;

        color: black;
        font-size: 0.5em;

        cursor: default;
    }
    p {
        white-space: pre-line;

        font-size: 1.25em;
    }

    #banner {
        height: 50vh;

        background-image: url("https://raw.githubusercontent.com/Modern-Modpacks/assets/main/banner.png");
        background-size: cover;
        background-blend-mode: darken;

        animation: bg_color 1.5s, shrink .5s 2s both;
        animation-iteration-count: 1;
        background-color: rgba(0, 0, 0, 0.5);
    }
    #logo {
        width: 200px;
        height: auto;
        border-radius: 10%;

        animation: opacity .5s both;
        animation-delay: 1s;
    }
    #banner > h1 {
        margin: 10px;

        animation: opacity .25s both;
        animation-delay: 1.5s;

        font-weight: bold;
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

    #difficulty {
        flex-direction: row;
        justify-content: space-evenly;

        padding-top: 0;
    }
    #difficulty > * {
        flex-grow: 1;
        flex-basis: 0;

        margin-inline: 25px;
    }
    #difficulty > p {
        font-size: 1.15em;
    }

    #difficulty > div {
        flex-direction: row;
        gap: 15px;
    }
    #difficulty > div > div {
        height: 60vh;
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
    }
    #icons > img {
        width: 30px;
        border-radius: 5px;
        cursor: pointer;
    }

    #socials {
        flex-direction: row;
        gap: 20px;

        padding-top: 0;
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
            font-size: 1em;
        }

        #modpacks {
            grid-template-columns: repeat(4, 50px);
        }

        #difficulty {
            flex-direction: column;
        }
    }
</style>

<main>
    <div id="banner">
        <img src="https://avatars.githubusercontent.com/u/112729506?s=200&v=4" alt="logo" id="logo" draggable="false">
        <h1>Modern Modpacks</h1>
        <h2>{splash}</h2>
    </div>
    
    <div>
        <h1>Modern Modpacks makes expert modpacks for 1.16.5</h1>
    </div>

    <div id="modpacks">
        {#each modpacklist as modpack}
            <Modpack modpack={modpack[1]} index={modpack[0]} bind:click={popups[modpack[1].abbr]}/>
        {/each}
    </div>

    <div>
        <h1>Q&A</h1>
        <p>
            Q: Why not the latest version?
            <b>A: We belive that people should stop hopping from version to version and stick to one LTS release.</b>
            
            Q: Why not 1.19.2?
            <b>A: The chat reporting feature is a deal breaker for us. We won't ever update past 1.19</b>

            Q: Why not 1.18.2?
            <b>A: 1.18 is not optimized as much as 1.16.5, even with performance mods.</b>

            Q: Why not 1.12.2?
            <b>A: 1.12.2 was released back in 2017 and has lived long enough to be replaced with something more new,
            like 1.16.5 which was released in 2020!</b>

            Q: Why not 1.7.10?
            <b>A: bruh.</b>

            Q: Why expert and not kitchen sinks?
            <b>A: While kitchen sinks can be fun in their own way, experts are in many cases more fun to play.</b>

            Q: How many modpacks will there be?
            <b>A: We plan on making 16 modpacks, each with their own theme and challenge.
               Each modpack is based on a single minecraft dye color, so that's why there are 16 of them!</b>

            Q: Fabric/Quilt?
            <b>A: Maybe someday. But we're only forge for now.</b>
        </p>
    </div>

    <div>
        <h1>Difficulty</h1>
    </div>
    <div id="difficulty">
        <div>
            <div>
                {#each Array.from(Array(5).keys()).reverse() as i}
                    <h2>{i+1} ({["Vanila+", "Casual", "Harder", "Professional", "Extreme"][i]})</h2>
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
            <b>Difficulty</b> does NOT mean how tedious and un-fun the modpack is, all it means is how much previous modded experience you should have to play the modpack and not get confused.
        
            <b>1 (Vanila+)</b> - Easy vanila+ modpack, the only experience you need to have is playing basic minecraft. FTB Chocolate and other vanila+ packs would be rated like this.

            <b>2 (Casual)</b> - If you're a beginner, start with these modpacks. Easy to understand but not as lightweight as Vanila+ modpacks. Create: Above and Beyond is a modpack that comes to mind.

            <b>3 (Harder)</b> - A typical expert experience. Something like Enigmatica 6/2 Expert and Not Too Complicated 1/2 would qualify as this. 
        
            <b>4 (Professional)</b> - These modpacks are somewhat hard to understand, but once you get how they work, you can get through them pretty easily. Divine Journey 1/2 would be the best comparison here.

            <b>5 (Extreme)</b> - The hardest difficulty of modpacks. If you like a challenge, try one of these. RLCraft and Gregtech: New Horizons are some of the examples of difficulty 5.
        </p>
    </div>

    <div>
        <h1>How can I help?</h1>
        <p>
            <b>There are a couple of ways.</b>
            
            Firstly you can open a pull request or an issue on our github (linked down below).

            If you are willing to spend more time on this project, you can also become a member of Modern Modpacks.
            Right now we are searching for:
            - Pixel artists
            - KubeJS coders
            - Quest creators
            - Translators 
            If you fit in one of those groups, or belive you can also help in a different way, contact G_cat#2267
            on discord, or info@modernmodpacks.site through email.
            <b>REMEMBER THO</b>, membership is NOT employment. This is a voluntary thing 
            and you WON'T be paid anything.

            And lastly, you can just tell other people about our project! We want people to know about us, and 
            simply by sharing this website with others you can help us a ton!
        </p>
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
