import serverConsts from "$lib/server/serverConsts";
import type { RequestHandler } from "./$types";

// Get and increment views for blogposts using their ids
export const GET: RequestHandler = async ({ url }) => {
    let id = url.searchParams.get("id")
    if (!id) return new Response("-1", {status: 400})

    return new Response(((serverConsts.DB.prepare("SELECT views FROM blogs WHERE id = ?").get([id]) as {views: number}) ?? {views: 0}).views.toString())
}
export const POST: RequestHandler = async ({ url, getClientAddress }) => {
    let id = url.searchParams.get("id")
    if (!id) return new Response("-1", {status: 400})
    
    serverConsts.DB.prepare("INSERT OR IGNORE INTO blogs (id, views, lastip, comments) VALUES (?, 0, '', '[]')").run([id])
    if ((serverConsts.DB.prepare("SELECT lastip FROM blogs WHERE id = ?").get([id]) as {lastip: string}).lastip==getClientAddress()) return new Response("OK")
    
    serverConsts.DB.prepare("UPDATE blogs SET views = views + 1, lastip = ? WHERE id = ?").run([getClientAddress(), id])
    return new Response("OK")
}