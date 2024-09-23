import { PUBLIC_CLIENT_ID, PUBLIC_CLIENT_SECRET } from "$env/static/public";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ url }) => {
    return fetch(`https://github.com/login/oauth/access_token?client_id=${PUBLIC_CLIENT_ID}&client_secret=${PUBLIC_CLIENT_SECRET}&code=${url.searchParams.get("code")}`)
}