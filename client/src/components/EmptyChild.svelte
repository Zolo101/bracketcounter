<script lang="ts">
    import type { DesktopTree } from "../statmodule";
    import { DesktopDirection } from "../statmodule";
    import { writable } from "svelte/store";
    import { fly } from "svelte/transition";
    import { statModules } from "../app";
    import { barModule } from "../modules/bar";

    export let child: DesktopTree;
    let dropdown = false;
    const choose = (name: string) => {
        child.set({
            parent: false,
            depth: $child.depth,
            module: barModule
        })
    }

    const split = (direction: DesktopDirection) => {
        child.set({
            parent: true,
            direction: direction,
            depth: $child.depth,
            children: [writable({parent: false, depth: $child.depth + 1}), writable({parent: false, depth: $child.depth + 1})]
        })
    }

    const remove = () => {
        // child = undefined;
    }
</script>

<div on:click|self={() => dropdown = !dropdown} class="flex flex-col items-center justify-center w-full border border-amber-300 rounded bg-amber-300 bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer">
    <p class="text-2xl">Choose a Module...</p>
    {#if dropdown}
        <div
            in:fly={{y: 100}}
            out:fly|local={{duration: 300}}
            class="z-10 flex flex-col p-3 gap-3 text-3xl shadow border border-orange-700 bg-orange-900 bg-opacity-25">

            {#each statModules as option}
                <li on:click={() => choose(option)} class="option">{option}</li>
            {/each}

            {#if $child.depth < 3}
                <br>
                <li on:click={() => split(DesktopDirection.Vertical)} class="!text-blue-400 option">Split Vertically</li>
                <li on:click={() => split(DesktopDirection.Horizontal)} class="!text-blue-400 option">Split Horizontally</li>
                <li on:click={() => remove()} class="!text-red-300 option">Delete</li>
            {/if}
        </div>
    {/if}
</div>

<style>
    .option {
        @apply text-yellow-300 p-2 bg-white bg-opacity-0 transition-colors;
    }

    .option:hover {
        @apply bg-opacity-10;
    }
</style>
