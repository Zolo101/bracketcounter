<script lang="ts">
    import type { DesktopTree } from "../statmodule";
    import { DesktopDirection } from "../statmodule";
    import { writable } from "svelte/store";
    import { fly } from "svelte/transition";
    import { modules, statModules } from "../app";
    import { barModule } from "../modules/bar";

    export let child: DesktopTree;
    let dropdown = false;
    const choose = (name: string) => {
        child.set({
            parent: false,
            depth: $child.depth,
            appId: $child.appId,
            module: modules[name]
        })
    }

    const split = (direction: DesktopDirection) => {
        child.set({
            parent: true,
            direction: direction,
            depth: $child.depth,
            appId: $child.appId,
            children: [
                writable({
                    parent: false,
                    // @ts-ignore
                    module: $child.module,
                    depth: $child.depth + 1,
                    appId: $child.appId + "1"
                }),
                writable({
                    parent: false,
                    depth: $child.depth + 1,
                    appId: $child.appId + "2"
                })
            ]
        })
    }

    const remove = () => {
        // child = undefined;
    }
</script>

<!-- Choose a Module... -->
<button on:click|self={() => dropdown = !dropdown} class="flex flex-col rounded items-center h-[48px] justify-center px-12 py-16 text-green-400 outline outline-green-300/50 bg-green-300/20 hover:bg-green-300/30 transition-colors cursor-pointer">
    <span class="text-7xl">+</span>
    {#if dropdown}
        <div
            in:fly={{y: 100}}
            out:fly|local={{duration: 300}}
            class="z-10 flex flex-col p-3 gap-3 text-3xl rounded shadow outline outline-white/50 bg-gray-700/40 backdrop-blur-xl backdrop-brightness-75">

            {#each statModules as option}
                <button on:click={() => choose(option)} class="option">{option}</button>
            {/each}

            {#if $child.depth < 3}
                <br>
<!--                <li on:click={() => split(DesktopDirection.Horizontal)} class="!text-blue-400 option">Split Horizontally</li>-->
                <button on:click={() => split(DesktopDirection.Horizontal)} class="!text-blue-300 option">Split Horizontally</button>
                <button on:click={() => split(DesktopDirection.Vertical)} class="!text-blue-300 option">Split Vertically</button>
                <button on:click={remove} class="!text-red-400 option">Delete</button>
            {/if}
        </div>
    {/if}
</button>

<dialog>
    <p>e</p>
</dialog>

<style>
    .option {
        @apply bg-white/15 rounded text-xl text-yellow-300 px-10 py-4 bg-opacity-0 transition-colors;
    }

    .option:hover {
        @apply bg-white/10;
    }
</style>
