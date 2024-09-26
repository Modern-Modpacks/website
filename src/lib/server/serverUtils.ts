import serverConsts from "./serverConsts"

export let addBlogpostToDB = async (id: string) => {
    await serverConsts.DB.from("blogs").insert({id: id, views: 0, lastip: "", comments: "[]"})
}