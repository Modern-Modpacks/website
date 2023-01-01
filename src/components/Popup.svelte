<script>
    // External vars
    export let modpack // Modpack info
    export let lang // Lang

    // Vars
    let active // If the popup is active
    let noanim = false // If the animation is disabled

    // Funcs
    export function activate(disableanim=false) { // Activate popup (external)
        document.body.id = "noscroll" // Disable scroll
        if(disableanim) {noanim=true} // Disable animation if disableanim is passed
        
        window.location.hash = modpack.abbr // Set hash to modpack's abbr

        active=true // Set if popup active to true
    }
    function disable() { // Deactivate popup
        document.body.id = "" // Enable scroll
        noanim=false // Enable animation
        
        history.pushState({}, "", "#") // Reset hash

        active=false // Set if popup active to false
    }
</script>

<style>
    :global(.disableanim) {
        transition: none !important;
    }

    #darken {
        position: fixed;
        left: 0;
        top: 0;

        z-index: 1;

        height: 100vh;
        width: 100vw;

        background-color: rgba(0, 0, 0, 0.6);
        opacity: 1;

        transition: opacity .3s;

        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
    .disabled {
        opacity: 0 !important;
        pointer-events: none;
    }

    #content {
        background-color: black;

        border: 3px solid white;
        border-bottom: none;
        border-top-left-radius: 3%;
        border-top-right-radius: 3%;

        width: 700px;
        height: 85%;

        transition: height .5s;

        overflow: hidden;
    }
    .invisable {
        height: 0% !important;
    }

    #banner {
        width: 100%;
        height: 20vh;

        background-color: rgba(0, 0, 0, 0.3);
        background-blend-mode: darken;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;

        display: flex;
        flex-direction: column;
    }

    #close {
        height: 25px;

        align-self: flex-end;

        margin: 20px;

        cursor: pointer;

        transition: transform .5s;
    }
    #close:hover {
        transform: rotate(90deg);
    }

    #desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #desc > h2, #desc > h3, #desc > p {
        margin-top: 0;
    }
    #desc > h1 {
        margin-bottom: 0;
        margin-top: 15px;
    }
    #desc > h2 {
        font-size: 1.25em;
        font-weight: 500;
    }
    #desc > h3 {
        font-size: 2em;
        font-weight: 500;

        margin-bottom: 15px;
    }
    #desc > p {
        font-size: 1.5em;
        text-align: left;

        padding-inline: 15px;
    }
    #desc > a {
        text-decoration: none;

        display: flex;
        justify-content: center;
        gap: 15px;
    }

    #ram {
        display: flex;
        gap: 50px;
    }
    #ram > p {
        margin-top: 0;
        margin-bottom: 50px;

        font-size: 1.5em;
    }

    #download {
        background-color: white;

        color: black;

        width: 50%;
        height: 70px;

        border-radius: 15px;
        border: 3px solid white;
        box-sizing: border-box;

        transition-property: background-color, color;
        transition-duration: .2s;
    }
    #download:hover {
        background-color: black;
        color: white;
    }
    #download > img {
        filter: brightness(0) invert(0);
        transition: filter .2s;
    }
    #download:hover img {
        filter: brightness(0) invert(1);
    }
    #download > h1 {
        font-size: 1.5em;
    }

    #source {
        color: white;

        margin-top: 20px;
        padding-inline: 50px;
    }
    #source > img {
        filter: invert(1);
    }
    #source > h2 {
        text-decoration: underline;
        text-decoration-color: transparent;
        transition: text-decoration-color .2s;

        margin-block: 0;
    }
    #source:hover h2 {
        text-decoration-color: white;
    }

    #download > img, #source > img {
        width: 1.25em;
    }

    @media (max-width: 850px) {
        #banner {
            height: 17.5vh;
        }

        #desc > h1 {
            font-size: 2em;
        }
        #desc > h2 {
            font-size: 1.5em;
        }
        #desc > p, #desc > h3  {
            font-size: 1.25em;
        }

        #ram > p {
            margin-bottom: 20px;

            font-size: 1em;
        }
    }
</style>

<div id="darken" class="{!active ? "disabled" : ""} {noanim ? "disableanim" : ""}">
    <div id="content" class="{!active ? "invisable" : ""} {noanim ? "disableanim" : ""}">
        <div id="banner" style="background-image: url({modpack.assets.banner});">
            <img src="/close.svg" alt="button" on:click={disable} id="close">
        </div>
        
        <div id="desc">
            <h1>{modpack.name}</h1>
            <h2>[{modpack.abbr}]</h2>

            <p>{lang.description.modpacks[modpack.abbr]}</p>

            <h3>{lang.difficulty}: {modpack.difficulty}/5</h3>

            <h3>{lang.ram}:</h3>
            <div id="ram">
                <p>{lang.minimum}:{"\n" + modpack.ram.minimum}</p>
                <p>{lang.recommended}:{"\n" + modpack.ram.recommended}</p>
            </div>

            <a id="download" href={modpack.links.cf}>
                <img src="https://gist.githubusercontent.com/thecodewarrior/110057b210551c4ecf2c9be6d58ff824/raw/38748511ca1eb5677f009092fb3fcd71cc76cdf0/logo.svg" alt="curseforge">
                <h1>{lang.links.download}</h1>
            </a>

            <a id="source" href={modpack.links.gh + "/modlist.md"}>
                <img src="data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjEgNGMwLS40NzgtLjM3OS0xLTEtMWgtMTZjLS42MiAwLTEgLjUxOS0xIDF2MTZjMCAuNjIxLjUyIDEgMSAxaDE2Yy40NzggMCAxLS4zNzkgMS0xem0tNCAxMS4yNWMwIC40MTQtLjMzNi43NS0uNzUuNzVoLTguNWMtLjQxNCAwLS43NS0uMzM2LS43NS0uNzVzLjMzNi0uNzUuNzUtLjc1aDguNWMuNDE0IDAgLjc1LjMzNi43NS43NXptMC0zLjI0OGMwIC40MTQtLjMzNi43NS0uNzUuNzVoLTguNWMtLjQxNCAwLS43NS0uMzM2LS43NS0uNzVzLjMzNi0uNzUuNzUtLjc1aDguNWMuNDE0IDAgLjc1LjMzNi43NS43NXptMC0zLjI1MmMwIC40MTQtLjMzNi43NS0uNzUuNzVoLTguNWMtLjQxNCAwLS43NS0uMzM2LS43NS0uNzVzLjMzNi0uNzUuNzUtLjc1aDguNWMuNDE0IDAgLjc1LjMzNi43NS43NXoiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvc3ZnPg==" alt="modlist">
                <h2>{lang.links.modlist}</h2>
            </a>

            <a id="source" href={modpack.links.gh}>
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==" alt="github">
                <h2>{lang.links.source}</h2>
            </a>
        </div>
    </div>
</div>