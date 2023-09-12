<script>
    import {Status, status} from "../app";
</script>

{#if $status === Status.Online}
        <p class="text-green-400 text-6xl">:)</p>
    {:else if $status === Status.Error}
        <p class="text-orange-400 text-6xl">X(</p>
    {:else if $status === Status.Finished}
        <p class="text-neutral-400 text-6xl">:D</p>
    {:else if $status === Status.ClientOffline}
        <p class="text-red-400 text-6xl">client X(</p>
    {:else if $status === Status.ServerOffline}
        <p class="text-purple-400 text-6xl">server X(</p>
{/if}
