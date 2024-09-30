import type { Comment } from "$lib/scripts/interfaces";
import { sendGithubApiRequestWithSetKey } from "$lib/scripts/utils";
import serverConsts from "$lib/server/serverConsts";
import moment from "moment";
import type { RequestHandler } from "./$types";
import consts from "$lib/scripts/consts";
import { addBlogpostToDB } from "$lib/server/serverUtils";

// Get and add comments for blogposts using their ids
const getComments = async (id: string) : Promise<Comment[]> => {
    let comments = (await serverConsts.DB.from("blogs").select("comments").eq("id", id)).data

    if (!comments) return []
    return JSON.parse(comments[0].comments)
}
const badWordRegex = (await (await fetch(consts.WORD_BLOCKLIST)).text()).split("\n").filter(l => !!l)
export const GET: RequestHandler = async ({ url }) => {
    let id = url.searchParams.get("id")
    if (!id) return new Response("-1", {status: 400})

    return new Response(JSON.stringify((await getComments(id)).filter(c => !consts.BLOG_BANLIST.includes(c.author.name.toLowerCase()))))
}
export const POST: RequestHandler = async ({ url, request }) => {
    let id = url.searchParams.get("id")
    let token = url.searchParams.get("token")
    if (!id || !token) return new Response("-1", {status: 400})

    let content = await request.text()
    for (let regex of badWordRegex) {
        if (new RegExp(regex).test(content)) return new Response("OK")
    }
    
    await addBlogpostToDB(id)

    let comments = await getComments(id)
    let author = await (await sendGithubApiRequestWithSetKey("user", true, token))?.json()
    if (consts.BLOG_BANLIST.includes(author.login.toLowerCase())) return new Response("OK")

    comments.push({
        content: content,
        timestamp: moment().format(),

        author: {
            name: author.login,
            github: {
                username: author.login,
                id: author.id
            }
        }
    })

    await serverConsts.DB.from("blogs").update({"comments": comments}).eq("id", id)
    return new Response("OK")
}