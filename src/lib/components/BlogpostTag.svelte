<script lang="ts">
    import consts from "$lib/scripts/consts";
    import { json } from "svelte-i18n";

    export let tagIndex : number
    let tagIndexTest : number | null
    // tagIndexTest = 0 // Do not enable in prod

    let tagList : string[] = $json("ui.blogtags") as any
</script>

<span class="flex items-center gap-2">
    <div class="h-5 w-5 bg-mm-{consts.COLORS[tagIndexTest ?? tagIndex]}" />
    <p class="font-semibold">{tagList[tagIndexTest ?? tagIndex]}</p>
</span>