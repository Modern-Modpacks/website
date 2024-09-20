<script lang="ts">
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts, openedBlogPost, visitedBlog } from "$lib/scripts/stores";
    import { openBlogpost } from "$lib/scripts/utils";
    import { onMount } from "svelte";

    export let id : string
    
    let blogpost : BlogPost
    $: blogpost = $blogPosts![id]

    onMount(() => {
        setTimeout(() => {$visitedBlog = true}, 1000)
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="{$visitedBlog ? "" : "animate-comeup "}flex flex-col gap-4 cursor-pointer" on:click={() => {openBlogpost(id)}}>
    <!-- 8:3 ratio -->
    <img src="{blogpost.thumbnail}" alt="thumbnail" class="w-[56rem] h-[24rem] object-cover rendering-crisp-edges rounded-3xl shadow-[#00000077] shadow-2xl">
    <span class="flex">
        <h2>{blogpost.metadata.title}&nbsp</h2>
        <h2 class="opacity-35">{blogpost.metadata.subtitle}</h2>
    </span>
</div>