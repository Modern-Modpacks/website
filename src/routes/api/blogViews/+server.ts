import serverConsts from "$lib/server/serverConsts";
import { addBlogpostToDB } from "$lib/server/serverUtils";
import type { RequestHandler } from "./$types";

// Get and increment views for blogposts using their ids
export const GET: RequestHandler = async ({ url }) => {
    let id = url.searchParams.get("id")
    if (!id) return new Response("-1", {status: 400})

    let views = (await serverConsts.DB.from("blogs").select("views").eq("id", id)).data
    return new Response((views && views.length>0 ? views[0].views : 0).toString())
}
export const POST: RequestHandler = async ({ url, getClientAddress }) => {
    let id = url.searchParams.get("id")
    if (!id) return new Response("-1", {status: 400})
    
    await addBlogpostToDB(id)
    let lastip = (await serverConsts.DB.from("blogs").select("lastip").eq("id", id)).data
    if (lastip && lastip[0].lastip==getClientAddress()) return new Response("OK")
    
    await serverConsts.DB.rpc("incrementview", {id: id})
    await serverConsts.DB.from("blogs").update({lastip: getClientAddress()}).eq("id", id)
    return new Response("OK")
}