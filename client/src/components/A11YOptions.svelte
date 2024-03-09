<script lang="ts">
    import { accessibilityWritable } from "../app";
    import { toggleAccessibilityOption } from "$lib/a11y";
</script>

<section class="flex flex-col justify-center bg-black rounded-t rounded-br p-5 gap-5 text-2xl shadow-2xl">
    <span class="text-white">Accessibility Settings</span>
    <button on:click={() => toggleAccessibilityOption(0)}>Reduce Motion: {!!$accessibilityWritable.reduced}</button>
    <button on:click={() => toggleAccessibilityOption(1)}>No Backgrounds: {!!$accessibilityWritable.noBackground}</button>
<!--        <button on:click={() => toggleAccessibilityOption(2)} class="option">High Contrast: {!!$accessibilityWritable.highContrast}</button>-->
</section>

<style>
    button {
        @apply font-bold bg-white px-10 py-5 transition-colors;
    }

    button:hover {
        @apply bg-white/50 outline outline-blue-100;
    }
</style>
