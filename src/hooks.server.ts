import consts from "$lib/scripts/consts";
import { blogPosts } from "$lib/scripts/stores";
import { getBlogPosts, sendGithubApiRequest } from "$lib/scripts/utils";
import type { Handle } from "@sveltejs/kit";
import removeMd from "remove-markdown";
import { get } from "svelte/store";

// Discord blogpost page embed
export const handle: Handle = async ({ event, resolve }) => {
    if (!(event.request.headers.get("user-agent") as string).includes("DiscordBot") || !event.url.pathname.startsWith("/blog") || !event.url.searchParams.get("id")) return await resolve(event)

    let id = event.url.searchParams.get("id")!
    await getBlogPosts()

    await new Promise(resolve => setTimeout(resolve, 1000));

    let post = get(blogPosts)![id]
    return new Response(`<!doctype html>
<html lang="en">
	<head>
		<meta property="og:title" content="${post.metadata.title} ${post.metadata.subtitle}" />
		<meta property="og:description" content="${removeMd(post.content)}" />
		<meta property="og:url" content="https://www.modernmodpacks.site/blog#${id}" />
		<meta property="og:thumbnail" content="${post.thumbnail}" />
		<meta content="${consts.HEX_COLORS[post.metadata.tag].toUpperCase()}" data-react-helmet="true" name="theme-color" />
	</head>
</html>`)
}