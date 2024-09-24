<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts, expectedBlogPostsLength, visitedBlog } from "$lib/scripts/stores";
    import { closeBlogpost, getContributorAvatar, sendGithubApiRequest } from "$lib/scripts/utils";
    import { ArrowLeft } from "lucide-svelte";
    import Eye from "lucide-svelte/icons/eye";
    import MessageSquare from "lucide-svelte/icons/message-square";
    import { marked } from "marked";
    import moment from "moment";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { sineIn, sineInOut, sineOut } from "svelte/easing";
    import { fade, fly, slide } from "svelte/transition";
    import BlogpostTag from "./BlogpostTag.svelte";
    import { animateScroll } from "svelte-scrollto-element";
    import hljs from "highlight.js";

    export let id : string
    export let branchHash : string

    let commentsElement : HTMLElement | null
    let blogpost : BlogPost | null
    $: blogpost = $blogPosts ? $blogPosts[id] : null

    // Fetch github data about the markdown file
    let fetchGhData = async () => {
        if (blogpost?.ghdata) return

        let commits : any[] = await (
            await sendGithubApiRequest(`repos/${consts.REPO}/commits?sha=${branchHash}&path=${id}.md`, false)
        )?.json()
        if (!commits) return
        
        let firstCommit = commits.at(-1)
        let lastCommit = commits[0]

        blogpost!.ghdata = {
            created: {
                time: moment(firstCommit.commit.committer.date),
                url: firstCommit.html_url,

                author: {
                    name: firstCommit.author.login,
                    github: {
                        username: firstCommit.author.login,
                        id: firstCommit.author.id
                    }
                }
            },
            edited: commits.length > 1 ? {
                time: moment(lastCommit.commit.committer.date),
                url: lastCommit.html_url,

                author: {
                    name: lastCommit.author.login,
                    github: {
                        username: lastCommit.author.login,
                        id: lastCommit.author.id
                    }
                }
            } : undefined
        }
    }
    // Fetch blogpost views and comments
    let fetchSocialData = async () => {
        blogpost!.views = +(await (await fetch("/api/blogViews?id="+id)).text())
        blogpost!.comments = []
    }
    // Fetch gh and social data
    let fetchExtraData = async () => {
        await fetchGhData()
        await fetchSocialData()
    }

    onMount(async () => {
        await fetch("/api/blogViews?id="+id, {
            method: "POST"
        })

        setTimeout(() => {scrollTo(0, 0)}, 300)
    })
</script>

<div class="min-h-[100vh]" in:fly={{x: window.screenX, easing: sineOut, duration: 300 * +$visitedBlog, delay: 300 * +$visitedBlog}} out:fly={{x: window.screenX, easing: sineIn, duration: 300}}>
    {#if Object.keys($blogPosts ?? {}).length == $expectedBlogPostsLength}
        <!-- svelte-ignore empty-block -->
        {#if blogpost}
            {#await fetchExtraData() then}
                <div>
                    <img src="{blogpost.thumbnail}" alt="thumbnail" class="w-full h-[37.5vw] object-cover">
                    <button class="group absolute top-20 left-8 h-12 w-12 p-2 box-content bg-header-dark rounded-full" on:click={closeBlogpost}>
                        <ArrowLeft class="w-full h-full translate-x-0.5 duration-200 group-hover:-translate-x-0.5" />
                    </button>

                    <div class="[&_a:hover>*]:underline [&_button:hover>*]:underline">
                        <div class="relative flex flex-col gap-2 px-20 pt-12 pb-8 [&>span>*]:inline-block [&>span>*]:w-fit">
                            <span class="[&>a>*]:inline-block [&_*]:align-middle">
                                <a href="{blogpost.ghdata?.created.url}" target="_blank" rel="noopener noreferrer">
                                    <p>{$_("ui.writtenby")}</p>
                                    <img src="{blogpost.ghdata?.created.author ? getContributorAvatar(blogpost.ghdata?.created.author) : ""}" alt="author avatar" class="h-8 w-8 rounded-full">
                                    <p>{blogpost.ghdata?.created.author.name}</p>
                                    <p>{$_("ui.timeon")}</p>
                                    <p>{blogpost.ghdata?.created.time.format("LLL")}</p>
                                </a>

                                {#if blogpost.ghdata?.edited}
                                    <p>|</p>
                                    <a href="{blogpost.ghdata.edited.url}" target="_blank" rel="noopener noreferrer" class="[&>p]:opacity-35">
                                        <p>{$_("ui.editedby")}</p>
                                        <img src="{blogpost.ghdata.edited.author ? getContributorAvatar(blogpost.ghdata.edited.author) : ""}" alt="author avatar" class="h-8 w-8 rounded-full">
                                        <p>{blogpost.ghdata.edited.author.name}</p>
                                        <p>{$_("ui.timeon")}</p>
                                        <p>{blogpost.ghdata.edited.time.format("LLL")}</p>
                                    </a>
                                {/if}
                            </span>
                            <span class="mb-2">
                                <h1>{blogpost.metadata.title}&nbsp</h1>
                                <h1 class="opacity-35">{blogpost.metadata.subtitle}</h1>
                            </span>
                            <BlogpostTag tagIndex={blogpost.metadata.tag} />
                            <span class="absolute right-20 top-12 !grid grid-cols-2 gap-4 opacity-35 [&>*]:!flex [&>*]:items-center [&>*]:gap-1 [&_b]:text-2xl">
                                <span title="{$_("ui.views")}">
                                    <Eye class="w-10 h-10" />
                                    <b>{blogpost.views}</b>
                                </span>
                                <button title="{$_("ui.comments")}" on:click={() => {animateScroll.scrollTo({element: commentsElement ?? undefined, duration: 1000})}}>
                                    <MessageSquare class="w-10 h-10" />
                                    <b>{blogpost.comments.length}</b>
                                </button>
                                <a class="!w-full col-span-2 flex justify-center items-center !gap-2" href="{blogpost.sourcelink}" target="_blank" rel="noopener noreferrer">
                                    <img src="{consts.WEBSITE_ICONS.github}" alt="GitHub logo" class="invert">
                                    <p>{$_("ui.source")}</p>
                                </a>
                            </span>
                        </div>

                        <div class="
                            grid grid-cols-[18rem_1fr_18rem] gap-y-4 pt-16 pb-8 bg-secondary-dark
                            [&_*]:max-w-full [&_*]:[grid-column:2/3] [&_*]:h-fit
                            [&_h1]:text-5xl [&_h1]:pb-2 [&_h1]:border-b-4 [&_h1]:border-text-dark [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:pb-2 [&_h2]:border-b-2 [&_h2]:border-text-dark
                            [&_h3]:text-3xl [&_h3]:font-bold [&_h4]:text-2xl [&_h4]:font-semibold [&_h5]:text-xl [&_h5]:font-semibold [&_p]:text-lg
                            [&_ul]:list-disc [&_ul]:ml-8 [&_ol]:list-decimal [&_ol]:ml-8 [&_li]:list-inside
                            [&_blockquote]:flex [&_blockquote]:gap-2 [&_blockquote]:before:content-[''] [&_blockquote]:before:block [&_blockquote]:before:w-2 [&_blockquote]:before:bg-primary-dark
                            [&_code]:bg-header-dark [&_code]:py-1.5 [&_code]:px-2.5 [&_code]:rounded-xl [&_code]:font-[monospace] [&_code_*]:font-[monospace]
                            [&_hr]:my-8 [&_hr]:border-2 [&_hr]:col-span-full
                        ">
                            {@html consts.MARKDOWN_PARSER.parse(blogpost.content)}
                        </div>

                        <div bind:this={commentsElement}>
                        </div>
                    </div>
                </div>
            {/await}
        {:else}
            {@const _ = closeBlogpost()}
        {/if}
    {/if}
</div>