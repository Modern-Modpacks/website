<script lang="ts">
    export let text // Contents of the tag
    export let color // Color of the tag
</script>

<p class="w-auto text-base cursor-default bg-{color} bg-opacity-30 border-{color} border-2 rounded-full px-2.5 py-0.5 motion-safe:desktop:hover:scale-110" style="transition: transform 150ms;">{text}</p>