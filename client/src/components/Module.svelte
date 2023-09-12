<script lang="ts">
    import {latestMessage} from "../app";
    import type { DesktopTreeChild } from "../statmodule";
    import type { Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { Application } from "pixi.js";
    export let child: Writable<DesktopTreeChild>;
    let statModule = $child.module!;
    let appDOM;

    const remove = () => {
        child.set({parent: false, depth: $child.depth})
    }

    onMount(async () => {
        const appDOM = document.querySelector("#app")! as HTMLDivElement
        const app = new Application({
            // width: appDOM.clientWidth,
            // height: appDOM.clientHeight,
            backgroundAlpha: 0,
            antialias: false,
            autoDensity: true,
            resizeTo: appDOM
        })

        appDOM.append(app.view)

        latestMessage.subscribe(m => {
            statModule.render(app, m)
        })
    })
</script>

<div class="flex flex-col grow w-full grow border border-lime-500 rounded">
    <div class="flex justify-between text-xl bg-lime-700 bg-opacity-75 pl-5 font-mono">
        <p>{statModule.name}</p>
        <div class="flex gap-5">
<!--            <p>-</p>-->
            <p on:click={() => remove()} class="px-8 bg-red-500 bg-opacity-40 hover:bg-opacity-100 transition-colors cursor-pointer">✕</p>
        </div>
    </div>
<!--    <div class="absolute w-[100vw] -h-[50vh] bg-transparent"></div>-->
    <div bind:this={appDOM} id="app" class="w-full min-w-[600px] min-h-[800px] grow flex items-center justify-center bg-green-400 bg-opacity-20 hover:bg-opacity-25">
        <div class="fixed left-5 top-36 w-full h-full"></div>
        <!--{statModule.render()}-->
<!--        <p class="text-2xl text-green-400">{statModule.name}</p>-->
<!--        <div>-->
<!--            {#each Object.values($latestMessage.config.contestants) as [name, colour]}-->
<!--                <p style="color: {colour}">{name} is a contestant</p>-->
<!--            {/each}-->
<!--        </div>-->
    </div>
</div>
