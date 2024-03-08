<script lang="ts">
    import type { DesktopTree } from "../statmodule";
    import { DesktopDirection } from "../statmodule";
    import EmptyChild from "./EmptyChild.svelte";
    import Module from "./Module.svelte";
    import { writable } from "svelte/store";
    import { desktop } from "../app";

    export let tree: DesktopTree;
    console.log("sup", $tree)

    const tempChoose = () => {
        $tree = {
            parent: true,
            direction: DesktopDirection.Vertical,
            depth: 0,
            children: [writable({parent: false}), writable({parent: false})]
        }
        console.log("sup", $desktop)
    }
</script>

<!--<div class="flex h-full w-full border border-amber-300">-->

<div class="flex w-full h-full">
    {#if !$tree}
        <div class="items-center">
            <EmptyChild/>
        </div>
    {:else}
        {#if $tree.parent}
            {@const direction = $tree.direction ? "flex-direction: column;" : "flex-direction: row;"}
            <div class="flex w-full" style={direction}>
                {#each $tree.children as child}
                    <svelte:self tree={child}/>
                {/each}
            </div>
        {:else}
            {#if $tree.module}
                <Module child={tree}/>
            {:else}
                <EmptyChild child={tree}/>
            {/if}
        {/if}
    {/if}
</div>

