<script lang="ts">
    import { accessibilityWritable } from "../app";
    import { toggleAccessibilityOption } from "$lib/a11y";
</script>

<div class="relative bg-black flex flex-col gap-1 text-2xl right-20 p-1 shadow-2xl">
        <button on:click={() => toggleAccessibilityOption(0)} class="option">Reduce Motion: {!!$accessibilityWritable.reduced}</button>
<!--        <button on:click={() => toggleAccessibilityOption(1)} class="option">High Contrast: {!!$accessibilityWritable.highContrast}</button>-->
</div>

<style>
    button {
        @apply bg-white/30 px-10 py-5;
    }

    button:hover {
        @apply bg-white/20;
    }
</style>
