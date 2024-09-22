<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { BlogPost, GitHubFile } from "$lib/scripts/interfaces";
    import { blogPosts, expectedBlogPostsLength, ghApiKey, githubRateLimited, openedBlogPost, visitedBlog } from "$lib/scripts/stores";
    import { parse as parseYaml } from "yaml";
    import { LoaderCircle } from "lucide-svelte";
    import { _ } from "svelte-i18n";
    import moment from "moment";
    import BigBlogpost from "$lib/components/BigBlogpost.svelte";
    import { onMount } from "svelte";
    import BlogpostOpened from "$lib/components/BlogpostOpened.svelte";
    import { openBlogpost, sendGithubApiRequest, toggleScroll } from "$lib/scripts/utils";
    import GithubLoginBar from "$lib/components/GithubLoginBar.svelte";
    import { page } from "$app/stores";
    import { PUBLIC_CLIENT_SECRET, PUBLIC_GH_LOGIN_URL, PUBLIC_CLIENT_ID } from "$env/static/public";
    import TriangleAlert from "lucide-svelte/icons/triangle-alert";
    import Github from "lucide-svelte/icons/github";
    
    let branchHash : string | null
    let finishedAuth : boolean = false

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
        let mdFiles : string[] = files.map(f => f.path).filter(f => f.endsWith(".md")) // Filter by markdown files
        $expectedBlogPostsLength = mdFiles.length // Set the expected number of blogposts

        // For each of the markdown files
        mdFiles.forEach(async path => {
            path = path.replace(".md", "") // Get the path without the extension 

            // Get the basic data
            let rawUrl = `https://raw.githubusercontent.com/${consts.REPO}/${consts.BLOG_BRANCH}/${path}` // Get the url of the raw files
            let sourcelink = rawUrl+".md" // Get the url of the raw markdown file specifically
            let content = await (await fetch(sourcelink)).text() // Get the content of the raw markdown file

            // If the markdown file doesn't have metadata, skip it
            if (!content.startsWith("```")) return

            // Get metadata from the yaml embed at the top of the md file
            let contentAndMetadata = content.split(/^```$/m)
            let metadataLines = contentAndMetadata.splice(0, 1)[0].split("\n")
            metadataLines.splice(0, 1)
            content = contentAndMetadata.join("```")

            // Compile all of the data (except ghdata, which is fetched when a blogpost is clicked)
            let blogpost : BlogPost = {
                content: content,
                sourcelink: sourcelink,
                thumbnail: rawUrl+".png",
                views: 0,
                metadata: parseYaml(metadataLines.join("\n"))
            }

            // Add new blogpost to the blogPosts object copy
            let blogPostsCopy = {...$blogPosts!}
            blogPostsCopy[path] = blogpost

            // Sort blogposts alphabetically by id and re-assign
            let sortedBlogPosts : {[key: string]: BlogPost} = {}
            Object.keys(blogPostsCopy).toSorted().forEach(k => {
                sortedBlogPosts[k] = blogPostsCopy[k]
            })
            $blogPosts = sortedBlogPosts
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
            history.replaceState({}, "", "/blog")
            console.error(await req.text())
            return
        }

        let key = (await req.json())[PUBLIC_CLIENT_SECRET ? "access_token" : "token"]
        $ghApiKey = key

        finishedAuth = true
        history.pushState({}, "", "/blog")
    }
    onMount(async () => {
        if (!$visitedBlog) setTimeout(() => {toggleScroll(false)}, 1)

        await exchangeGithubCode()
        await getBlogPosts()
        if (window.location.hash) openBlogpost(window.location.hash.replace(/^#/, ""))

        setTimeout(() => {toggleScroll(true); $visitedBlog = true}, 1500 * +(!window.location.hash))
    })
</script>

<main>
    {#if $githubRateLimited}
        <div class="flex justify-center items-center z-10 w-[100vw] h-[100vh]">
            <div class="flex flex-col items-center w-80 p-8 box-content motion-safe:animate-comeup bg-header-dark rounded-2xl">
                <TriangleAlert class="w-80 h-80" />
                <p class="text-2xl text-center [&>a]:underline">{@html $_("ui.ratelimit", {values: {link: `https://github.com/${consts.REPO}/tree/${consts.BLOG_BRANCH}`}})}</p>
                <a href="https://github.com/login/oauth/authorize?client_id={PUBLIC_CLIENT_ID}&redirect_uri={$page.url}" class="flex items-center gap-2 w-fit mt-8 p-2 rounded-xl bg-text-dark bg-opacity-25 shadow-[#00000055] shadow-xl duration-200 motion-safe:hover:shadow-[#000000aa] motion-safe:hover:-translate-y-2">
                    <Github class="h-8 w-8" />
                    <p class="text-3xl">{$_("ui.login")}</p>
                </a>
            </div>
        </div>
    {:else if !$openedBlogPost}
        <div>
            {#if Object.keys($blogPosts ?? {}).length < $expectedBlogPostsLength || ($page.url.searchParams.get("code") && !finishedAuth)}
                <div class="w-[100vw] h-[100vh] flex justify-center items-center">
                    <LoaderCircle class="w-28 h-28 opacity-0 animate-loader animate-delay-[2.5s]" />
                </div>
            {:else}
                <div class="min-h-[100vh] py-20 flex justify-center">
                    <div class="w-[56rem] mobile:w-[75%] flex flex-col gap-16">
                        <BigBlogpost id={Object.keys($blogPosts ?? {})[0]} />
                        <span class="flex justify-between w-full mb-8 [&>div]:w-[26rem] [&_h2]:text-2xl [&_p]:text-base">
                            <BigBlogpost id={Object.keys($blogPosts ?? {})[1]} delay={500} />
                            <BigBlogpost id={Object.keys($blogPosts ?? {})[2]} delay={750} />
                        </span>

                        <GithubLoginBar />
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <BlogpostOpened id={$openedBlogPost} branchHash={branchHash ?? ""}/>
    {/if}
</main>