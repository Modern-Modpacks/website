import serverConsts from "./serverConsts"

export let addBlogpostToDB = (id: string) => {
    serverConsts.DB.prepare("INSERT OR IGNORE INTO blogs (id, views, lastip, comments) VALUES (?, 0, '', '[]')").run([id])
}