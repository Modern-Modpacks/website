import { PRIVATE_GITHUB_DEV_KEY } from "$env/static/private";
import consts from "$lib/scripts/consts";
import { ghApiKey } from "$lib/scripts/stores";
import { getBlogPost } from "$lib/scripts/utils";
import type { Handle } from "@sveltejs/kit";
import removeMd from "remove-markdown";

// Set dev github key
ghApiKey.set(PRIVATE_GITHUB_DEV_KEY)

// Discord blogpost page embed
export const handle: Handle = async ({ event, resolve }) => {
    if (!(event.request.headers.get("user-agent") as string).includes("Discordbot") || !event.url.pathname.startsWith("/blog") || !event.url.searchParams.get("id")) return await resolve(event)

    let id = event.url.searchParams.get("id")!
    let post = await getBlogPost(id)
	if (!post) return await resolve(event)

    return new Response(
`<!doctype html>
<html lang="en">
	<head>
		<meta property="og:site_name" content="Modern Modpacks Blog" />
		<meta property="og:title" content="${post.metadata.title} ${post.metadata.subtitle}" />
		<meta property="og:description" content="${removeMd(post.content).replaceAll("\n", " ")}" />
		<meta property="og:url" content="https://www.modernmodpacks.site/blog#${id}" />
		<meta property="og:image" content="${post.thumbnail}" />
		<meta content="${consts.HEX_COLORS[post.metadata.tag].toUpperCase()}" data-react-helmet="true" name="theme-color" />
		<meta name="twitter:card" content="summary_large_image">
	</head>
</html>`, {
	headers: {
		"Content-Type": "text/html"
	}
})
}