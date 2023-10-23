<script>
    import en_us from "../lang/en-US.json"
    import ru_ru from "../lang/ru-RU.json"
    const langs = {
        "en-US": en_us,
        "ru-RU": ru_ru
    }

    export let change_splash

    let selected_lang = localStorage.getItem("selectedLang") || navigator.language
    export let lang
    function change_lang() {
        localStorage.setItem("selectedLang", selected_lang)
        lang = {...langs["en-US"], ...langs[selected_lang]} // Get locale lang + english
        change_splash()
    }

    change_lang()
</script>

<style>
    @keyframes appear {
        from {
            opacity: 0;
            pointer-events: none;
        }
        to {
            opacity: 1;
            pointer-events: inherit;
        }
    }

    select {
        position: absolute;
        right: 0;
        top: 0;

        background-color: rgba(0, 0, 0, 0.1);
        color: white;

        font-family: inherit;
        font-size: 1.5em;
        font-weight: bold;

        border: white solid 5px;
        border-bottom-left-radius: 15px;

        border-top: none;
        border-right: none;
        outline: none;

        animation: appear .5s both;
        animation-delay: 2s;
    }
    option {
        background-color: black;
    }

    @media (max-width: 850px) {
        select {
            font-size: 1em;
        }
    }
</style>

<select name="langs" id="langs" bind:value={selected_lang} on:change={change_lang}>
    {#each Object.keys(langs) as l}
        <option value="{l}">{langs[l].emoji} {langs[l].lang}</option>
    {/each}
</select>