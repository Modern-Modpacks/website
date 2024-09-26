<script lang="ts">
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts } from "$lib/scripts/stores";
    import { openBlogpost } from "$lib/scripts/utils";
    import removeMd from "remove-markdown";
    import BlogpostTag from "./BlogpostTag.svelte";
    import { _ } from "svelte-i18n";
    
    export let id : string
    
    let blogpost : BlogPost
    $: blogpost = $blogPosts![id]
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="flex mobile:flex-col items-center desktop:gap-4 w-full h-[9rem] mobile:h-fit bg-header-dark rounded-3xl cursor-pointer" title="{blogpost.metadata.title} {blogpost.metadata.subtitle}" on:click={id ? () => {openBlogpost(id)} : null}>
    <img src="{blogpost.thumbnail}" alt='"{blogpost.metadata.title}" blogpost thumbnail' class="desktop:h-full desktop:min-w-[17rem] mobile:w-full mobile:h-[28vw] object-cover rounded-3xl shadow-[#00000077] shadow-2xl duration-300 motion-safe:hover:scale-105">
    <div class="py-2 mobile:py-4">
        <span class="mobile:block mobile:w-fit [&>b]:block [&>b]:w-fit [&>b]:overflow-hidden [&>b]:whitespace-nowrap [&>b]:text-ellipsis [&>b]:text-xl">
            <b>{blogpost.metadata.title}</b>
            <b class="opacity-35">{blogpost.metadata.subtitle}</b>
        </span>
        <BlogpostTag tagIndex={blogpost.metadata.tag} />
        <p class="h-[2.25ch] w-72 mobile:w-60 mt-1 text-lg mobile:text-base overflow-hidden whitespace-nowrap text-ellipsis">{removeMd(blogpost.content)}</p>
    </div>
</div>