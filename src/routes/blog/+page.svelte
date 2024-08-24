<script lang="ts">
    import { _ } from "svelte-i18n";
</script>

<div class="w-[100vw] h-[100vh] flex items-center">
    <span class="w-full flex items-center bg-mm-yellow h-20">
        <h1 class="w-full h-fit text-center text-black border-y-4 border-black">{$_("ui.construction").toUpperCase()}</h1>
    </span>
</div>