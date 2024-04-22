<script lang="ts">
    import { base } from "$app/paths"
    import { page } from "$app/stores"
    import consts from "$lib/scripts/consts"
    import { scrollY } from "$lib/scripts/stores"
</script>

<div class="fixed w-[90%] bg-header-dark backdrop-blur-sm shadow-2xl shadow-black h-16 flex justify-between px-2 left-[50%] translate-x-[-50%]{$page.url.pathname=="/projects" && !$scrollY ? " translate-y-[-100%] shadow-none " : " "}duration-150 rounded-b-2xl" id="header">
    <a class="group flex items-center h-full" href="{base}">
        <img src={consts.LOGO_URL} alt="logo" class="rounded-2xl p-2 duration-100 group-hover:rounded-[1.35rem]">
        <b>Modern Modpacks</b>
    </a>

    <span class="flex items-center h-full mr-4 gap-10
        [&>a]:relative [&>a]:duration-100 [&>a]:animate-ease-out [&>a]:animate-alternate
        hover:[&>a]:scale-[120%]
        after:[&>a]:content-[''] after:[&>a]:block after:[&>a]:absolute after:[&>a]:bottom-[-60%] after:[&>a]:duration-[.125s] after:[&>a]:h-2 after:[&>a]:w-full after:[&>a]:scale-y-0 after:[&>a]:origin-bottom
        after:hover:[&>a]:scale-y-[50%]
    ">
        {#each [
            {link: "projects", title: "Projects", color: "mm-red"},
            {link: "about", title: "About us", color: "mm-lime"},
            {link: "blog", title: "Blog", color: "mm-light-blue"}
        ] as button}
            <a 
                href={button.link}
                class="{$page.url.pathname=="/"+button.link ? "font-bold scale-[120%]" : "font-semibold"} hover:text-{button.color} after:bg-{button.color}"
            >{button.title}</a>
        {/each}
    </span>
</div>