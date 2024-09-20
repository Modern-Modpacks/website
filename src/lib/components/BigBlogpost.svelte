<script lang="ts">
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { visitedBlog } from "$lib/scripts/stores";
    import { onMount } from "svelte";

    export let id : string
    export let blogpost : BlogPost

    onMount(() => {
        setTimeout(() => {$visitedBlog = true}, 1000)
    })
</script>

<!-- <a href="blog/{id}" class="{$visitedBlog ? "" : "animate-comeup"}">
    <img src="{blogpost.thumbnail}" alt="thumbnail">
</a> -->