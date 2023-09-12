<script>
    import {Status, status} from "../app";
</script>

{#if $status === Status.Online}
        <p class="text-green-400 text-6xl">online</p>
    {:else if $status === Status.Error}
        <p class="text-orange-400 text-6xl">error</p>
    {:else if $status === Status.Finished}
        <p class="text-neutral-400 text-6xl">finished!</p>
    {:else if $status === Status.ClientOffline}
        <!--TODO: Regular pings to server?-->
        <p class="text-red-400 text-6xl">are you offline?</p>
    {:else if $status === Status.ServerOffline}
        <p class="text-purple-400 text-6xl">server offline :(</p>
{/if}
