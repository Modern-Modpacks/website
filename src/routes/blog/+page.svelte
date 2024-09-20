<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { BlogPost, GitHubFile } from "$lib/scripts/interfaces";
    import { blogPosts, expectedBlogPostsLength, openedBlogPost } from "$lib/scripts/stores";
    import { parse as parseYaml } from "yaml";
    import { LoaderCircle } from "lucide-svelte";
    import { _ } from "svelte-i18n";
    import moment from "moment";
    import BigBlogpost from "$lib/components/BigBlogpost.svelte";
    import { onMount } from "svelte";
    import BlogpostOpened from "$lib/components/BlogpostOpened.svelte";
    import { openBlogpost, sendGithubApiRequest } from "$lib/scripts/utils";
    
    let branchHash : string

    // Get blogposts on github on first load
    let getBlogPosts = async () => {
        if ($blogPosts) return // If already loaded, do not update
        $blogPosts = {}

        // Get the branch hash for getting github data later
        branchHash = (
            await (
                await sendGithubApiRequest(`repos/${consts.REPO}/git/refs/heads/${consts.BLOG_BRANCH}`)
            ).json()
        ).object.sha

        // Get all of the files on the blogposts branch
        let files : GitHubFile[] = (
            await (
                await sendGithubApiRequest(`repos/${consts.REPO}/git/trees/${consts.BLOG_BRANCH}?recursive=1`)
            ).json()
        ).tree
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
            $blogPosts![path] = blogpost // Add the post to the blogpost list
        })
    }
    onMount(async () => {
        await getBlogPosts()
        if (window.location.hash) openBlogpost(window.location.hash.replace(/^#/, ""))
    })
</script>

<main>
    {#if !$openedBlogPost}
        <div>
            {#if !Object.keys($blogPosts ?? {}).length}
                <div class="w-[100vw] h-[100vh] flex justify-center items-center">
                    <LoaderCircle class="w-28 h-28 opacity-0 animate-loader animate-delay-[2.5s]" />
                </div>
            {:else}
                <div class="min-h-[100vh] py-20">
                    <div class="grid justify-center">
                        <BigBlogpost id={Object.keys($blogPosts ?? {})[0]} />
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <BlogpostOpened id={$openedBlogPost} branchHash={branchHash}/>
    {/if}
</main>