<script lang="ts">
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts, visitedBlog } from "$lib/scripts/stores";
    import { openBlogpost } from "$lib/scripts/utils";
    import { onMount } from "svelte";
    import removeMd from "remove-markdown";
    import BlogpostTag from "./BlogpostTag.svelte";

    export let id : string
    
    let blogpost : BlogPost
    $: blogpost = $blogPosts![id]

    onMount(() => {
        setTimeout(() => {$visitedBlog = true}, 1000)
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="{$visitedBlog ? "" : " animate-comeup "}h-fit bg-header-dark rounded-2xl cursor-pointer" on:click={() => {openBlogpost(id)}}>
    <!-- 8:3 ratio -->
    <img src="{blogpost.thumbnail}" alt="thumbnail" class="w-full h-[24rem] object-cover rendering-crisp-edges rounded-3xl shadow-[#00000077] shadow-2xl duration-300 hover:scale-[102.5%]">
    <div class="flex flex-col p-4 mt-1">
        <span class="flex">
            <h2>{blogpost.metadata.title}&nbsp</h2>
            <h2 class="opacity-35">{blogpost.metadata.subtitle}</h2>
        </span>
        <BlogpostTag tagIndex={blogpost.metadata.tag} />
        <p class="h-[2ch] max-w-full mt-1 text-lg overflow-hidden whitespace-nowrap text-ellipsis">{removeMd(blogpost.content)}</p>
    </div>
</div>