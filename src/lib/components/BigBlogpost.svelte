<script lang="ts">
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts, visitedBlog } from "$lib/scripts/stores";
    import { openBlogpost } from "$lib/scripts/utils";
    import removeMd from "remove-markdown";
    import BlogpostTag from "./BlogpostTag.svelte";
    import { _ } from "svelte-i18n";
    import consts from "$lib/scripts/consts";

    export let id : string | null
    export let delay : number = 0
    
    let blogpost : BlogPost | null
    $: blogpost = id ? $blogPosts![id] : null
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="{$visitedBlog ? "" : " motion-safe:opacity-0 motion-safe:animate-comeup "}h-fit bg-header-dark rounded-3xl {blogpost ? "cursor-pointer" : "cursor-not-allowed"}" style="animation-delay: {delay}ms;" on:click={id ? () => {openBlogpost(id)} : null}>
    <!-- 8:3 ratio -->
    <span class="relative block pt-[37.5%]">
        <img src="{blogpost ? blogpost.thumbnail : consts.MISSING_BLOGPOST_THUMBNAIL}" alt="thumbnail" class="absolute w-full left-0 top-0 object-cover rounded-3xl shadow-[#00000077] shadow-2xl duration-300{blogpost ? " motion-safe:hover:scale-[102.5%]" : ""}">
    </span>
    <div class="flex flex-col p-4 mt-1">
        <span class="mobile:mb-2 [&>h2]:inline-block [&>h2]:w-fit">
            <h2>{blogpost ? blogpost.metadata.title : $_("ui.missingblogpost")}&nbsp</h2>
            <h2 class="opacity-35">{blogpost ? blogpost.metadata.subtitle : $_("ui.missingblogpostsub")}</h2>
        </span>
        {#if blogpost}
            <BlogpostTag tagIndex={blogpost.metadata.tag} />
        {/if}
        <p class="h-[2.25ch] max-w-full w-fit mt-1 text-lg overflow-hidden whitespace-nowrap text-ellipsis">{blogpost ? removeMd(blogpost.content) : $_("ui.missingblogpostdesc")}</p>
    </div>
</div>