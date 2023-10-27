<script lang="ts">
    import { latestMessage } from "../app";
    import type { DesktopTreeChild, StatModule } from "../statmodule";
    import type { Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { Application } from "pixi.js";
    import ModuleOptions from "./ModuleOptions.svelte";

    export let child: Writable<DesktopTreeChild>;
    let statModule = $child.module!;
    let appDOM;
    let beforeTotal = $latestMessage.total;
    let beforeDate = $latestMessage.status.updateDate;
    $: newVotes = 0;
    $: newVotesPlural = newVotes === 1 ? "vote" : "votes"
    $: dropdown = false;

    const exportData = () => {
        dropdown = !dropdown;
    }
    const remove = () => {
        child.set({parent: false, depth: $child.depth})
    }

    const edit = () => {
        dropdown = !dropdown;
    }


    onMount(async () => {
        const appDOM = document.querySelector("#app")! as HTMLDivElement
        const app = new Application({
            // width: appDOM.clientWidth,
            // height: appDOM.clientHeight,
            backgroundAlpha: 0,
            antialias: false,
            autoDensity: true,
            resizeTo: appDOM,
        })

        appDOM.append(app.view)

        child.subscribe(c => {
            statModule = c.module!
            statModule.render(app)
        })

        latestMessage.subscribe(m => {
            newVotes = m.total - beforeTotal
            beforeTotal = m.total
        })
    })
</script>

<div class="flex flex-col grow w-full border border-lime-500">
    <div class="flex justify-between text-xl bg-lime-700 bg-opacity-75 pl-5 font-mono">
        <p>{statModule.name} {newVotes > 0 ? "(+ " + newVotes + " " + newVotesPlural + " since last refresh, " + $latestMessage.total.toLocaleString() + " total)" : ""}</p>
        <div class="flex max-md:hidden">
            <div class="absolute top-10">
                {#if dropdown}
                    <ModuleOptions bind:child={child}/>
                {/if}
            </div>
<!--            <button on:click={exportData} class="h-full py-0 px-8 bg-gray-400/40 hover:bg-gray-400 transition-colors cursor-pointer">{"Export"}</button>-->
            <button on:click={edit} class="h-full py-0 px-8 bg-blue-500/40 hover:bg-blue-500 transition-colors cursor-pointer">{"<|>"}</button>
<!--            <button on:click={remove} class="h-full py-0 px-8 bg-red-500/40 hover:bg-red-500 transition-colors cursor-pointer">✕</button>-->
        </div>
    </div>
<!--    <div class="absolute w-[100vw] -h-[50vh] bg-transparent"></div>-->
    <div bind:this={appDOM} id="app" class="w-full min-w-[600px] min-h-[800px] grow flex bg-green-400 bg-opacity-20 hover:bg-opacity-25">
        <div class="fixed left-5 top-36 w-full h-full md:hidden"></div>
    <!--{statModule.render()}-->
<!--        <p class="text-2xl text-green-400">{statModule.name}</p>-->
<!--        <div>-->
<!--            {#each Object.values($latestMessage.config.contestants) as [name, colour]}-->
<!--                <p style="color: {colour}">{name} is a contestant</p>-->
<!--            {/each}-->
<!--        </div>-->
    </div>
</div>
