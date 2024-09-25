import type { Comment } from "$lib/scripts/interfaces";
import { sendGithubApiRequestWithSetKey } from "$lib/scripts/utils";
import serverConsts from "$lib/server/serverConsts";
import { addBlogpostToDB } from "$lib/server/serverUtils";
import moment from "moment";
import type { RequestHandler } from "./$types";
import consts from "$lib/scripts/consts";

// Get and add comments for blogposts using their ids
const getComments = (id: string) : Comment[] => {
    return (
        (
            JSON.parse(
                (
                    serverConsts.DB.prepare("SELECT comments FROM blogs WHERE id = ?").get([id]) as {comments: string}
                ).comments
            ) as Comment[]
        ) ?? []
    )
}
const badWordRegex = (await (await fetch(consts.WORD_BLOCKLIST)).text()).split("\n").filter(l => !!l)
export const GET: RequestHandler = ({ url }) => {
    let id = url.searchParams.get("id")
    if (!id) return new Response("-1", {status: 400})

    return new Response(JSON.stringify(getComments(id)))
}
export const POST: RequestHandler = async ({ url, request }) => {
    let id = url.searchParams.get("id")
    let token = url.searchParams.get("token")
    if (!id || !token) return new Response("-1", {status: 400})

    let content = await request.text()
    for (let regex of badWordRegex) {
        if (new RegExp(regex).test(content)) return new Response("OK")
    }
    
    addBlogpostToDB(id)

    let comments = getComments(id)
    let author = await (await sendGithubApiRequestWithSetKey("user", true, token))?.json()
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

    serverConsts.DB.prepare("UPDATE blogs SET comments = ? WHERE id = ?").run([JSON.stringify(comments), id])
    return new Response("OK")
}