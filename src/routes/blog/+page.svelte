<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { BlogPost, BlogPostWithID, GitHubFile } from "$lib/scripts/interfaces";
    import { blogPosts, expectedBlogPostsLength, ghApiKey, githubRateLimited, openedBlogPost, postsByTag, visitedBlog } from "$lib/scripts/stores";
    import { parse as parseYaml } from "yaml";
    import { LoaderCircle } from "lucide-svelte";
    import { _ } from "svelte-i18n";
    import BigBlogpost from "$lib/components/BigBlogpost.svelte";
    import { onMount } from "svelte";
    import BlogpostOpened from "$lib/components/BlogpostOpened.svelte";
    import { openBlogpost, removeParams, sendGithubApiRequest, toggleScroll } from "$lib/scripts/utils";
    import GithubLoginBar from "$lib/components/GithubLoginBar.svelte";
    import { page } from "$app/stores";
    import { PUBLIC_CLIENT_SECRET, PUBLIC_GH_LOGIN_URL, PUBLIC_CLIENT_ID } from "$env/static/public";
    import TriangleAlert from "lucide-svelte/icons/triangle-alert";
    import Github from "lucide-svelte/icons/github";
    import Search from "lucide-svelte/icons/search";
    import BlogpostTag from "$lib/components/BlogpostTag.svelte";
    import X from "lucide-svelte/icons/x";
    import { fade, fly, slide } from "svelte/transition";
    import Blogpost from "$lib/components/Blogpost.svelte";
    import { flip } from "svelte/animate";
    import Fuse from "fuse.js"
    import { sineIn, sineInOut, sineOut } from "svelte/easing";
    import { nameToEmoji } from "gemoji";
    
    let branchHash : string | null
    let finishedAuth : boolean = false

    let searchBar : HTMLInputElement | null
    let searchQuery : string | null
    let selectedTag : number | null
    let loadAllPosts : boolean = false

    let filteredBlogposts : string[] = []
    $: filteredBlogposts = Object.keys((selectedTag!=null ? $postsByTag[selectedTag] : $blogPosts) ?? {})
    let filteredBlogpostObjects : BlogPostWithID[] = []
    $: filteredBlogpostObjects = $blogPosts ? filteredBlogposts.map(id => {return {...$blogPosts![id], id: id}}) : []
    let searchedBlogposts : string[] = []
    $: searchedBlogposts = new Fuse(filteredBlogpostObjects, {
        keys: ["id", "content", "metadata.title", "metadata.subtitle"],
        minMatchCharLength: 2
    }).search(searchQuery ?? "").map(p => p.item.id)

    // Get blogposts on github on first load
    let getBlogPosts = async () => {
        if ($blogPosts) return // If already loaded, do not update
        $blogPosts = {}

        // Get the branch hash for getting github data later
        branchHash = (
            await (
                await sendGithubApiRequest(`repos/${consts.REPO}/git/refs/heads/${consts.BLOG_BRANCH}`, false)
            )?.json()
        ).object.sha
        if (!branchHash) return

        // Get all of the files on the blogposts branch
        let files : GitHubFile[] | null = (
            await (
                await sendGithubApiRequest(`repos/${consts.REPO}/git/trees/${consts.BLOG_BRANCH}?recursive=1`, false)
            )?.json()
        ).tree
        if (!files) return
        let mdFiles : string[] = files.map(f => f.path).filter(f => f.endsWith(".md")).toSorted().reverse() // Filter by markdown files
        $expectedBlogPostsLength = mdFiles.length // Set the expected number of blogposts

        // For each of the markdown files
        mdFiles.forEach(async path => {
            path = path.replace(".md", "") // Get the path without the extension 

            // Get the basic data
            let rawUrl = `https://raw.githubusercontent.com/${consts.REPO}/${consts.BLOG_BRANCH}/${path}` // Get the url of the raw files
            let content = await (await fetch(rawUrl+".md")).text() // Get the content of the raw markdown file

            // If the markdown file doesn't have metadata, skip it
            if (!content.startsWith("```")) return

            // Get metadata from the yaml embed at the top of the md file
            let contentAndMetadata = content.split(/^```$/m)
            let metadataLines = contentAndMetadata.splice(0, 1)[0].split("\n")
            metadataLines.splice(0, 1)
            content = contentAndMetadata.join("```")

            // Render emojis in content
            let emoteMatches = [...new Set(content.match(/:\w+:/g))]
            emoteMatches?.forEach(m => {
                let name = m.replaceAll(":", "")
                if (Object.keys(nameToEmoji).includes(name)) content = content.replaceAll(m, nameToEmoji[name])
            })

            // Compile all of the data (except ghdata, which is fetched when a blogpost is clicked), and add to blogPosts and postsByTag
            let blogpost : BlogPost = {
                content: content,
                sourcelink: `https://github.com/${consts.REPO}/blob/${consts.BLOG_BRANCH}/${path}.md`,
                thumbnail: rawUrl+".png",

                views: 0,
                comments: [],

                metadata: parseYaml(metadataLines.join("\n"))
            }
            $blogPosts![path] = blogpost
            $postsByTag[blogpost.metadata.tag][path] = blogpost

            // For testing purposes, do not enable in prod
            // for (let i = 1; i < 16; i++) {
            //     let blogpost2 : BlogPost = JSON.parse(JSON.stringify(blogpost))
            //     blogpost2.metadata.tag = i
            //     blogpost2.metadata.title = "amogu"
            //     $blogPosts![path+"-test"+i] = blogpost2
            //     $postsByTag[blogpost2.metadata.tag][path+"-test"+i] = blogpost2
            // }
        })
    }
    // Auth with github
    let exchangeGithubCode = async () => {
        let ghCodes = $page.url.searchParams.getAll("code")
        if (!ghCodes.length) return
        let ghCode = ghCodes.at(-1)

        let req = await fetch(PUBLIC_CLIENT_SECRET ? `${PUBLIC_GH_LOGIN_URL}?client_id=${PUBLIC_CLIENT_ID}&client_secret=${PUBLIC_CLIENT_SECRET}&code=${ghCode}` : PUBLIC_GH_LOGIN_URL+"/"+ghCode, {
            method: PUBLIC_CLIENT_SECRET ? "POST" : "GET",
            headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
        })
        if (req.status!=200) {
            removeParams()
            console.error(await req.text())
            return
        }

        let key = (await req.json())[PUBLIC_CLIENT_SECRET ? "access_token" : "token"]
        $ghApiKey = key

        finishedAuth = true
        removeParams()
    }
    onMount(async () => {
        if (!$visitedBlog) setTimeout(() => {scrollTo(0, 0); toggleScroll(false)}, 1)

        await exchangeGithubCode()
        await getBlogPosts()
        if (window.location.hash) openBlogpost(window.location.hash.replace(/^#/, ""))

        setTimeout(() => {toggleScroll(true); $visitedBlog = true}, 1500 * +(!window.location.hash))
        setInterval(() => {searchQuery = searchBar?.value ?? ""}, 500)
    })
</script>

<main>
    {#if $githubRateLimited}
        <div class="flex justify-center items-center z-10 w-[100vw] h-[100vh]">
            <div class="flex flex-col items-center w-80 p-8 box-content motion-safe:animate-comeup bg-header-dark rounded-2xl">
                <TriangleAlert class="w-80 h-80" />
                <p class="text-2xl text-center [&>a]:underline">{@html $_("ui.ratelimit", {values: {link: `https://github.com/${consts.REPO}/tree/${consts.BLOG_BRANCH}`}})}</p>
                <a href="https://github.com/login/oauth/authorize?client_id={PUBLIC_CLIENT_ID}&redirect_uri={window.location}" class="flex items-center gap-2 w-fit mt-8 p-2 rounded-xl bg-text-dark bg-opacity-25 shadow-[#00000055] shadow-xl duration-200 motion-safe:hover:shadow-[#000000aa] motion-safe:hover:-translate-y-2">
                    <Github class="h-8 w-8" />
                    <p class="text-3xl">{$_("ui.login")}</p>
                </a>
            </div>
        </div>
    {:else if !$openedBlogPost}
        <div in:fly={{x: -window.screenX, easing: sineOut, duration: 300, delay: 300}} out:fly={{x: -window.screenX, easing: sineIn, duration: 300}}>
            {#if Object.keys($blogPosts ?? {}).length < $expectedBlogPostsLength || ($page.url.searchParams.get("code") && !finishedAuth)}
                <div class="w-[100vw] h-[100vh] flex justify-center items-center">
                    <LoaderCircle class="w-28 h-28 opacity-0 animate-loader animate-delay-[2.5s]" />
                </div>
            {:else}
                <div class="py-20 flex justify-center">
                    <div class="w-[56rem] mobile:w-[75%] flex flex-col gap-[4.5rem]">
                        <BigBlogpost id={Object.keys($blogPosts ?? {})[0]} />
                        <span class="flex justify-between w-full [&>div]:w-[26rem] [&_h2]:text-2xl [&_p]:text-base">
                            <BigBlogpost id={Object.keys($blogPosts ?? {})[1]} delay={500} />
                            <BigBlogpost id={Object.keys($blogPosts ?? {})[2]} delay={750} />
                        </span>

                        <GithubLoginBar />

                        <div>
                            <span class="flex items-center w-full h-16 px-6 rounded-full bg-secondary-dark shadow-[#000000aa] shadow-2xl">
                                <input type="text" autocomplete="off" placeholder="{$_("ui.search")}" bind:this={searchBar} class="h-full w-full text-2xl bg-transparent placeholder:font-semibold focus:outline-none" on:input={() => {loadAllPosts = false}}>
                                <Search class="h-8 w-8 pl-6 box-content" />
                            </span>
                            <div class="flex gap-4 mt-6">
                                <span class="w-[45%] h-fit p-4 bg-secondary-dark rounded-xl">
                                    <span class="flex justify-between">
                                        <h2 class="text-2xl ml-1">{$_("ui.tagstitle")}</h2>
                                        {#if selectedTag!=null}
                                            <button transition:fade={{duration: 150}} on:click={() => {selectedTag = null}}>
                                                <X />
                                            </button>
                                        {/if}
                                    </span>
                                    {#each [...Array(16).keys()].filter(i => $_("ui.blogtags")[i]!="-") as i}
                                        <button class="flex justify-between w-full pl-1 pr-2 duration-200 hover:scale-105 hover:bg-header-dark{selectedTag==i ? " scale-105 bg-header-dark" : ""}" on:click={() => {selectedTag = selectedTag==i ? null : i}}>
                                            <BlogpostTag tagIndex={i} />
                                            <p>{Object.keys($postsByTag[i]).length}</p>
                                        </button>
                                    {/each}
                                </span>
                                <div class="flex flex-col gap-6 w-full">
                                    {#each searchQuery ? searchedBlogposts : filteredBlogposts.slice(0, loadAllPosts ? undefined : 5) as id (id)}
                                        <span animate:flip={{duration: 200, delay: 100}} transition:fade={{duration: 200, delay: 100}}>
                                            <Blogpost id={id} />
                                        </span>
                                    {/each}

                                    <button class="group hidden{!searchQuery && filteredBlogposts.length>5 && !loadAllPosts ? " !flex" : ""} items-center [&>div]:h-0.5 [&>div]:w-full [&>div]:bg-text-dark" on:click={() => {loadAllPosts = true}}>
                                        <div />
                                        <b class="text-2xl w-full duration-200 group-hover:scale-125 group-hover:w-[150%]">Load all posts</b>
                                        <div />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <BlogpostOpened id={$openedBlogPost} branchHash={branchHash ?? ""}/>
    {/if}
</main>