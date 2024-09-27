import hljs from "highlight.js";
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"

const consts = {
    REPO: "Modern-Modpacks/website", // The github repo where the website's source is hosted on
    BLOG_BRANCH: "blogposts", // The branch on REPO where raw blogpost .md files are hosted
    MISSING_BLOGPOST_THUMBNAIL: "https://raw.githubusercontent.com/Modern-Modpacks/website/refs/heads/blogposts/noblogpost.png", // A link to what should be shown isntead of the thumbnail if the blogpost is not found
    // WORD_BLOCKLIST: "https://gist.githubusercontent.com/Gcat101/b8ae78d19252e8f7b7225a377e0a0f81/raw/badwords.txt", // A link to a text file containing regexes for all words that need to be blocked
    WORD_BLOCKLIST: "https://gist.githubusercontent.com/Gcat101/b8ae78d19252e8f7b7225a377e0a0f81/raw/494d11ba2aa4b1e574902c5bc26effd0569b1b7a/badwords.txt",

    COLORS: [ // MM's brand colors' names
        "red",
        "orange",
        "yellow",
        "green",
        "lime",
        "lightblue",
        "cyan",
        "blue",
        "purple",
        "magenta",
        "pink",
        "gray",
        "lightgray",
        "white",
        "black",
        "brown"
    ],
    HEX_COLORS: [ // MM's brand colors' hex values (copied from tailwind config)
        "#8e2121",
        "#e06101",
        "#f1af15",
        "#495b24",
        "#5ea918",
        "#2489c7",
        "#157788",
        "#2d2f8f",
        "#64209c",
        "#a9309f",
        "#d5658f",
        "#373a3e",
        "#7d7d73",
        "#cfd5d6",
        "#080a0f",
        "#603c20"
    ],
    ADDITIONAL_BANNERS: [ // Additional banners for the projects page banner, excluding pack-specific banners
        "https://raw.githubusercontent.com/Modern-Modpacks/assets/main/animated_header.gif"
    ],
    WEBSITE_ICONS: { // Icons for various social websites
        "CurseForge": "https://www.svgrepo.com/show/330245/curseforge.svg",
        "Modrinth": "https://raw.githubusercontent.com/modrinth/knossos/master/assets/images/logo.svg",
        technicpack: "https://cdn.worldvectorlogo.com/logos/technic-launcher.svg",

        "GitHub": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==",
        "GitLab": "https://cdn.worldvectorlogo.com/logos/gitlab.svg",
        "GitBook": "https://www.svgrepo.com/show/330505/gitbook.svg",

        "Discord": "https://www.svgrepo.com/show/353655/discord-icon.svg",
        "Reddit": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMTEuNzc5YzAtMS40NTktMS4xOTItMi42NDUtMi42NTctMi42NDUtLjcxNSAwLTEuMzYzLjI4Ni0xLjg0Ljc0Ni0xLjgxLTEuMTkxLTQuMjU5LTEuOTQ5LTYuOTcxLTIuMDQ2bDEuNDgzLTQuNjY5IDQuMDE2Ljk0MS0uMDA2LjA1OGMwIDEuMTkzLjk3NSAyLjE2MyAyLjE3NCAyLjE2MyAxLjE5OCAwIDIuMTcyLS45NyAyLjE3Mi0yLjE2M3MtLjk3NS0yLjE2NC0yLjE3Mi0yLjE2NGMtLjkyIDAtMS43MDQuNTc0LTIuMDIxIDEuMzc5bC00LjMyOS0xLjAxNWMtLjE4OS0uMDQ2LS4zODEuMDYzLS40NC4yNDlsLTEuNjU0IDUuMjA3Yy0yLjgzOC4wMzQtNS40MDkuNzk4LTcuMyAyLjAyNS0uNDc0LS40MzgtMS4xMDMtLjcxMi0xLjc5OS0uNzEyLTEuNDY1IDAtMi42NTYgMS4xODctMi42NTYgMi42NDYgMCAuOTcuNTMzIDEuODExIDEuMzE3IDIuMjcxLS4wNTIuMjgyLS4wODYuNTY3LS4wODYuODU3IDAgMy45MTEgNC44MDggNy4wOTMgMTAuNzE5IDcuMDkzczEwLjcyLTMuMTgyIDEwLjcyLTcuMDkzYzAtLjI3NC0uMDI5LS41NDQtLjA3NS0uODEuODMyLS40NDcgMS40MDUtMS4zMTIgMS40MDUtMi4zMTh6bS0xNy4yMjQgMS44MTZjMC0uODY4LjcxLTEuNTc1IDEuNTgyLTEuNTc1Ljg3MiAwIDEuNTgxLjcwNyAxLjU4MSAxLjU3NXMtLjcwOSAxLjU3NC0xLjU4MSAxLjU3NC0xLjU4Mi0uNzA2LTEuNTgyLTEuNTc0em05LjA2MSA0LjY2OWMtLjc5Ny43OTMtMi4wNDggMS4xNzktMy44MjQgMS4xNzlsLS4wMTMtLjAwMy0uMDEzLjAwM2MtMS43NzcgMC0zLjAyOC0uMzg2LTMuODI0LTEuMTc5LS4xNDUtLjE0NC0uMTQ1LS4zNzkgMC0uNTIzLjE0NS0uMTQ1LjM4MS0uMTQ1LjUyNiAwIC42NS42NDcgMS43MjkuOTYxIDMuMjk4Ljk2MWwuMDEzLjAwMy4wMTMtLjAwM2MxLjU2OSAwIDIuNjQ4LS4zMTUgMy4yOTgtLjk2Mi4xNDUtLjE0NS4zODEtLjE0NC41MjYgMCAuMTQ1LjE0NS4xNDUuMzc5IDAgLjUyNHptLS4xODktMy4wOTVjLS44NzIgMC0xLjU4MS0uNzA2LTEuNTgxLTEuNTc0IDAtLjg2OC43MDktMS41NzUgMS41ODEtMS41NzVzMS41ODEuNzA3IDEuNTgxIDEuNTc1LS43MDkgMS41NzQtMS41ODEgMS41NzR6Ii8+PC9zdmc+",
        "YouTube": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNjE1IDMuMTg0Yy0zLjYwNC0uMjQ2LTExLjYzMS0uMjQ1LTE1LjIzIDAtMy44OTcuMjY2LTQuMzU2IDIuNjItNC4zODUgOC44MTYuMDI5IDYuMTg1LjQ4NCA4LjU0OSA0LjM4NSA4LjgxNiAzLjYuMjQ1IDExLjYyNi4yNDYgMTUuMjMgMCAzLjg5Ny0uMjY2IDQuMzU2LTIuNjIgNC4zODUtOC44MTYtLjAyOS02LjE4NS0uNDg0LTguNTQ5LTQuMzg1LTguODE2em0tMTAuNjE1IDEyLjgxNnYtOGw4IDMuOTkzLTggNC4wMDd6Ii8+PC9zdmc+",
        "Ko-fi": "https://www.svgrepo.com/show/330802/kofi.svg",
        "Mastodon": "https://www.svgrepo.com/show/330895/mastodon.svg",
        "Email": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMTIuNzEzbC0xMS45ODUtOS43MTNoMjMuOTcxbC0xMS45ODYgOS43MTN6bS01LjQyNS0xLjgyMmwtNi41NzUtNS4zMjl2MTIuNTAxbDYuNTc1LTcuMTcyem0xMC44NSAwbDYuNTc1IDcuMTcydi0xMi41MDFsLTYuNTc1IDUuMzI5em0tMS41NTcgMS4yNjFsLTMuODY4IDMuMTM1LTMuODY4LTMuMTM1LTguMTEgOC44NDhoMjMuOTU2bC04LjExLTguODQ4eiIvPjwvc3ZnPg==",

        "linktr.ee": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/linktree-white-icon.png",
        "Lichess": "https://raw.githubusercontent.com/gist/Gcat101/b0180a1c9cc1d2585eaa2c0bd15c6893/raw/3944a42cfa4940296bc13452f6ffbe1aa554217f/horse.svg"
    },

    PAGES: [ // Pages on the website with corresponding colors
        {link: "/projects", title: "projects", color: "mm-red"},
        {link: "/about", title: "aboutus", color: "mm-yellow"},
        {link: "/blog", title: "blog", color: "mm-lime"},
        {link: "https://status.modernmodpacks.site", title: "status", color: "mm-lightblue"}
    ],
    MARKDOWN_PARSER: new Marked( // Marked instance used for parsing blogposts (with highlight.js support)
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight: (code, lang, info) => {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        })
    ),

    SOCIALS: { // Links to various socials of MM
        "CurseForge": {
            url: "https://curseforge.com/members/modernmodpacks",
            title: "CurseForge",
            header: true
        },
        "Modrinth": {
            url: "https://modrinth.com/organization/modernmodpacks",
            title: "Modrinth",
            header: false
        },
        "GitHub": {
            url: "https://github.com/Modern-Modpacks",
            title: "GitHub",
            header: true
        },
        "GitBook": {
            url: "https://wiki.modernmodpacks.site",
            title: "GitBook",
            header: true
        },
        "Discord": {
            url: "https://discord.modernmodpacks.site",
            title: "Discord",
            header: true
        },
        "Reddit": {
            url: "https://reddit.com/r/modernmodpacks",
            title: "Reddit",
            header: false,
        },
        "YouTube": {
            url: "https://www.youtube.com/@ModernModpacks",
            title: "YouTube",
            header: true
        },
        "Mastodon": {
            url: "https://mastodon.social/@ModernModpacks",
            title: "Mastodon",
            header: true
        },
        "Ko-fi": {
            url: "https://ko-fi.com/modernmodpacks",
            title: "Ko-fi",
            header: true
        },
        "Email": {
            url: "mailto:info@modernmodpacks.site",
            title: "Email",
            header: false
        }
    },
    MODRINTH_API_ENDPOINT: "https://api.modrinth.com/v3/organization/modernmodpacks/projects", // Which endpoint is used to get the mods for the HM section

    // Logos of MM, HM, and MM rounded respectively
    LOGO_URL: "https://raw.githubusercontent.com/Modern-Modpacks/assets/main/logo.png",
    HM_LOGO_URL: "https://raw.githubusercontent.com/Modern-Modpacks/assets/main/HMlogo.png",
    ROUNDED_LOGO_URL: "https://raw.githubusercontent.com/Modern-Modpacks/assets/main/rounded_logo.png",

    // Url of the images used for the translator map
    MAP_URL: "https://static.planetminecraft.com/files/image/minecraft/project/2023/513/16677278-image_xl.webp",
    PIN_URL: "https://raw.githubusercontent.com/Modern-Modpacks/assets/main/Icons/Other/pin.png"
}
const icons : {[key: string]: string} = consts.WEBSITE_ICONS // Icons again, but now in a way TS likes it

export default consts
export { icons }
