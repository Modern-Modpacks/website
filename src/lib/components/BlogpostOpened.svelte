<script lang="ts">
    import consts from "$lib/scripts/consts";
    import type { BlogPost } from "$lib/scripts/interfaces";
    import { blogPosts, expectedBlogPostsLength } from "$lib/scripts/stores";
    import { closeBlogpost, sendGithubApiRequest } from "$lib/scripts/utils";
    import moment from "moment";
    import { slide } from "svelte/transition";

    export let id : string
    export let branchHash : string

    let blogpost : BlogPost | null
    $: blogpost = $blogPosts ? $blogPosts[id] : null

    // Fetch github data about the markdown file
    let fetchGhData = async () => {
        if (blogpost?.ghdata) return

        let commits : any[] = await (
            await sendGithubApiRequest(`repos/${consts.REPO}/commits?sha=${branchHash}&path=${id}.md`, false)
        )?.json()
        if (!commits) return
        
        let firstCommit = commits.at(-1)
        let lastCommit = commits[0]

        blogpost!.ghdata = {
            author: {
                name: firstCommit.author.login,
                github: {
                    username: firstCommit.author.login,
                    id: firstCommit.author.id
                }
            },

            created: {
                time: moment(firstCommit.commit.committer.date),
                url: firstCommit.url
            },
            edited: {
                time: moment(lastCommit.commit.committer.date),
                url: lastCommit.url
            }
        }
    }
</script>

{#if Object.keys($blogPosts ?? {}).length == $expectedBlogPostsLength}
    <!-- svelte-ignore empty-block -->
    {#if blogpost}
        {#await fetchGhData()}
            <div class="h-[100vh]" />
        {:then}
            <div>
                {JSON.stringify(blogpost)}
            </div>
        {/await}
    {:else}
        {@const _ = closeBlogpost()}
    {/if}
{:else}
    <div class="h-[100vh]" />
{/if}