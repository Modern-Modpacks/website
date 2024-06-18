<script lang="ts">
    import { goto } from "$app/navigation"
    import { onMount } from "svelte"

    // Redirect to the default page - projects
    onMount(() => goto("projects"))
</script>