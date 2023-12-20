<script lang="ts">
    import { fly } from "svelte/transition";
    import { modules, statModules } from "../app";
    import { DesktopDirection, type DesktopTree, type StatModule } from "../statmodule";
    import { writable } from "svelte/store";
    import { barModule } from "../modules/bar";
    import { graphModule } from "../modules/graph";
    import { pieModule } from "../modules/pie";

    export let child: DesktopTree;

    const choose = (name: string) => {
        child.set({
            parent: false,
            depth: $child.depth,
            appId: $child.appId,
            module: modules[name]
        })
        console.log("name", modules[name], name)
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

<!-- Desktop dropdown -->
<div transition:fly={{y: 100}} class="relative bg-green-400/50 flex flex-col gap-1 right-20 p-1 shadow-xl backdrop-blur-sm">
    {#each statModules as option}
        <button on:click={() => choose(option)} class="option">{option}</button>
    {/each}

    {#if $child.depth < 3}
        <br>
        <button on:click={() => split(DesktopDirection.Horizontal)} class="!text-blue-400 option">Split Horizontally</button>
        <button on:click={() => split(DesktopDirection.Vertical)} class="!text-blue-400 option">Split Vertically</button>
<!--        <button on:click={remove} class="!text-red-300 option hover:!bg-red-400/40">Delete</button>-->
    {/if}
</div>

<style>
    button {
        @apply bg-black/40 px-10 py-5 transition-colors;
    }

    button:hover {
        @apply bg-white/20;
    }
</style>
