<script lang="ts">
    import { accessibilityWritable } from "../app";
    import { toggleAccessibilityOption } from "$lib/a11y";
</script>

<section class="justify-center bg-black rounded-t-xl rounded-br-xl p-5 text-2xl shadow-2xl">
    <p class="text-white">Accessibility Settings</p>
    <section class="flex flex-col gap-5 p-5">
        <button style="background-color: {!!$accessibilityWritable.reduced ? 'lime' : 'gray'}" on:click={() => toggleAccessibilityOption(0)}>Reduce Motion: {!!$accessibilityWritable.reduced}</button>
        <button style="background-color: {!!$accessibilityWritable.noBackground ? 'lime' : 'gray'}" on:click={() => toggleAccessibilityOption(1)}>No Backgrounds / High Contrast: {!!$accessibilityWritable.noBackground}</button>
    <!--        <button on:click={() => toggleAccessibilityOption(2)} class="option">High Contrast: {!!$accessibilityWritable.highContrast}</button>-->
        <button style="background-color: {!!$accessibilityWritable.noTimer ? 'lime' : 'gray'}" on:click={() => toggleAccessibilityOption(3)}>No Timer: {!!$accessibilityWritable.noTimer}</button>
    </section>
<!--    <p class="text-sm text-white">Accessibility settings have been automatically set based on your browser settings.</p>-->
    <p class="text-sm text-white">Some settings may require you to refresh the page to take effect.</p>
</section>

<style>
    button {
        @apply font-bold bg-white px-10 py-5 transition-colors;
    }

    button:hover {
        @apply bg-white/50 outline outline-blue-100;
    }
</style>
