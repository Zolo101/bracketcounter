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
        // const appDOM = document.querySelector("#app");
        const app = new Application({
            width: appDOM.clientWidth,
            height: appDOM.clientHeight,
            backgroundAlpha: 0,
            antialias: false,
        })

        appDOM.append(app.view);

        statModule.render(app, $latestMessage)
    })
</script>

<div class="flex flex-col grow w-full grow border border-lime-500 rounded">
    <div class="flex justify-between text-xl bg-lime-700 bg-opacity-75 px-5 font-mono">
        <p>{statModule.name}</p>
        <div class="flex gap-5">
<!--            <p>-</p>-->
            <p on:click={() => remove()} class="px-5 bg-red-500 bg-opacity-25 hover:bg-opacity-100 transition-colors cursor-pointer">✕</p>
        </div>
    </div>
    <div bind:this={appDOM} id="app" class="w-full grow flex items-center justify-center bg-green-400 bg-opacity-20 hover:bg-opacity-25">
        <!--{statModule.render()}-->
<!--        <p class="text-2xl text-green-400">{statModule.name}</p>-->
<!--        <div>-->
<!--            {#each Object.values($latestMessage.config.contestants) as [name, colour]}-->
<!--                <p style="color: {colour}">{name} is a contestant</p>-->
<!--            {/each}-->
<!--        </div>-->
    </div>
</div>
