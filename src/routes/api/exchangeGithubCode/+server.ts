import { PUBLIC_GITHUB_CLIENT_ID, PUBLIC_GITHUB_CLIENT_SECRET } from "$env/static/public";
import type { RequestHandler } from "./$types";

// Exchange github temporary code for token, used for blog github oauth2
export const GET: RequestHandler = async ({ url }) => {
    return new Response(await (await fetch(`https://github.com/login/oauth/access_token?client_id=${PUBLIC_GITHUB_CLIENT_ID}&client_secret=${PUBLIC_GITHUB_CLIENT_SECRET}&code=${url.searchParams.get("code")}`, {
        method: "POST",
        headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
    })).text())
}