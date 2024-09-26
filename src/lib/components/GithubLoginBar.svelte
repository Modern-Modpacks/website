<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";
    import { ghApiKey } from "$lib/scripts/stores";
    import { sendGithubApiRequest } from "$lib/scripts/utils";
    import { LogIn, UserCircle } from "lucide-svelte";
    import { _ } from "svelte-i18n";
</script>

<span class="group relative w-full h-20 rounded-full [&>*]:w-full [&>*]:h-full [&>*]:rounded-full [&>*]:duration-300">
    <span class="flex px-3 gap-2 items-center bg-header-dark bg-opacity-30 backdrop-blur-xl group-hover:-translate-y-1">
        {#if $ghApiKey}
            {#await sendGithubApiRequest("user", true) then req}
                {#await req?.json() then info}
                    <img src="{info.avatar_url}" alt="user avatar" class="h-16 w-16 rounded-full">
                    <p>{$_("ui.profile")} <b>{info.login}.</b></p>

                    <button class="group/button flex items-center gap-2 h-16 px-4 bg-text-dark rounded-full ml-auto" on:click={() => {$ghApiKey = null}}>
                        <b class="text-selected-text-dark">{$_("ui.logout")}</b>
                        <LogIn color="#000000" class="h-10 w-10 translate-x-0.5 rotate-180 duration-200 group-hover/button:-translate-x-0.5" />
                    </button>
                {/await}
            {/await}
        {:else}
            <UserCircle class="h-16 w-16" />
            <p>{@html $_("ui.no_profile")}</p>
            
            <a href="https://github.com/login/oauth/authorize?client_id={PUBLIC_GITHUB_CLIENT_ID}&redirect_uri={window.location}" class="group/button flex items-center gap-2 h-16 px-4 bg-text-dark rounded-full ml-auto">
                <b class="text-selected-text-dark">{$_("ui.login")}</b>
                <LogIn color="#000000" class="h-10 w-10 -translate-x-0.5 duration-200 group-hover/button:translate-x-0.5" />
            </a>
        {/if}
    </span>
    <div class="block absolute top-0 -z-10 bg-[#00000088] shadow-[#00000088] shadow-[0px_20px_25px_var(--tw-shadow-color)] duration-300 group-hover:shadow-[#000000aa]" />
</span>