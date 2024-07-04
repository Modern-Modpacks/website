<script lang="ts">
    import { ArrowLeft, X } from "lucide-svelte";

    // The actual sidebar
    let element : HTMLElement | null

    // Toggle sidebar
    export const toggle = () => {
        element?.classList.toggle("translate-x-[100%]")
    }
</script>

<div bind:this={element} class="fixed translate-x-[100%] w-[100vw] h-[100vh] z-[60] bg-primary-dark duration-[400ms] ease-out">
    <button on:click={toggle} class="m-6 bg-secondary-dark rounded-full bg-opacity-65">
        <ArrowLeft size="48" />
    </button>
</div>