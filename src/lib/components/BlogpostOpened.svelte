<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts, expectedBlogPostsLength, ghApiKey, visitedBlog } from "$lib/scripts/stores";
    import { closeBlogpost, getContributorAvatar, sendGithubApiRequest } from "$lib/scripts/utils";
    import { ArrowLeft } from "lucide-svelte";
    import Eye from "lucide-svelte/icons/eye";
    import MessageSquare from "lucide-svelte/icons/message-square";
    import moment from "moment";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { sineIn, sineOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import BlogpostTag from "./BlogpostTag.svelte";
    import { animateScroll } from "svelte-scrollto-element";
    import CornerDownLeft from "lucide-svelte/icons/corner-down-left";
    import LogIn from "lucide-svelte/icons/log-in";
    import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";

    export let id : string
    export let branchHash : string

    let charLimit = 1000

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
        blogpost!.comments = await (await fetch("/api/blogComments?id="+id)).json()
    }
    // Fetch gh and social data
    let fetchExtraData = async () => {
        await fetchGhData()
        await fetchSocialData()
    }

    let ghUserData : any | null
    let comment : string = ""

    onMount(async () => {
        await fetch("/api/blogViews?id="+id, {
            method: "POST"
        })

        if ($ghApiKey) {
            let ghUserDataReq = await sendGithubApiRequest("user", true)
            if (ghUserDataReq) ghUserData = await ghUserDataReq.json()
        }
        
        setTimeout(() => {scrollTo(0, 0)}, 300)
    })
</script>

<svelte:head>
    <title>{blogpost?.metadata.title} {blogpost?.metadata.subtitle}</title>
</svelte:head>

<div class="min-h-[100vh]" in:fly={{x: window.screenX, easing: sineOut, duration: 300 * +$visitedBlog, delay: 300 * +$visitedBlog}} out:fly={{x: window.screenX, easing: sineIn, duration: 300}}>
    {#if Object.keys($blogPosts ?? {}).length == $expectedBlogPostsLength}
        <!-- svelte-ignore empty-block -->
        {#if blogpost}
            {#await fetchExtraData() then}
                <div>
                    <img src="{blogpost.thumbnail}" alt="thumbnail" class="w-full h-[37.5vw] object-cover">
                    <button class="group absolute top-20 left-8 h-12 w-12 p-2 box-content bg-header-dark rounded-full" on:click={() => {closeBlogpost(true)}}>
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
                                    <b>{blogpost.comments?.length}</b>
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

                        <div class="flex flex-col gap-12 py-16 px-96" bind:this={commentsElement}>
                            <span class="relative flex items-center gap-2 w-full h-64 pt-2 pb-4 pr-4 {ghUserData ? "pl-2" : "pl-6"} rounded-xl bg-secondary-dark shadow-[#000000aa] shadow-2xl">
                                {#if ghUserData}
                                    <img src="{ghUserData.avatar_url}" alt="User avatar" class="w-16 h-16 p-2 self-start rounded-full">
                                {/if}
                                <textarea
                                    autocomplete="off" maxlength="{charLimit}" placeholder="{ghUserData ? `${$_("ui.leavecomment")} ${ghUserData.login}` : $_("ui.commentdisabled")}" 
                                    disabled={!ghUserData} bind:value={comment} 
                                    class="h-full {ghUserData ? "w-[90%] pr-14" : "w-[95%]"} pt-4 text-2xl resize-none [&::-webkit-scrollbar]:hidden bg-transparent{!ghUserData ? " cursor-not-allowed" : ""} placeholder:font-semibold focus:outline-none"
                                />
                                {#if ghUserData}
                                    <p class="absolute top-4 right-4 text-2xl opacity-35">
                                        {comment.length}/{charLimit}
                                    </p>
                                    <button class="group w-12 h-12 aspect-square p-2 self-end bg-text-dark rounded-full" on:click={async () => {
                                        await fetch(`/api/blogComments?id=${id}&token=${$ghApiKey}`, {
                                            method: "POST",
                                            body: comment
                                        })
                                        comment = ""
                                        await fetchSocialData()
                                    }}>
                                        <CornerDownLeft color="#000000" class="w-full h-full motion-safe:animate-barrelroll motion-safe:group-hover:animate-doa" />
                                    </button>
                                {:else}
                                    <a href="https://github.com/login/oauth/authorize?client_id={PUBLIC_GITHUB_CLIENT_ID}&redirect_uri={window.location}" class="group w-12 h-12 aspect-square p-2 self-end bg-text-dark rounded-full">
                                        <LogIn color="#000000" class="w-full h-full motion-safe:-translate-x-1 duration-200 group-hover:translate-x-0" />
                                    </a>
                                {/if}
                            </span>
                            
                            <div class="flex flex-col gap-8 px-16">
                                {#each blogpost.comments?.toReversed() ?? [] as c}
                                    <span class="block w-full h-fit p-4 rounded-xl bg-secondary-dark">
                                        <span class="flex items-center gap-2 [&>b]:text-xl">
                                            <img src="{getContributorAvatar(c.author)}" alt="User avatar" class="w-16 h-16 p-2 self-start rounded-full">
                                            <b>{c.author.name}</b>
                                            <b class="opacity-35">{$_("ui.commentedon")} {moment(c.timestamp).format("lll")}</b>
                                        </span>
                                        <p class="max-w-full ml-[4.5rem] mr-4 pb-4 break-words">
                                            {c.content}
                                        </p>
                                    </span>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/await}
        {:else}
            {@const _ = closeBlogpost(true)}
        {/if}
    {/if}
</div>