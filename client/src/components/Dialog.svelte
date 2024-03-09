<script lang="ts">
    export let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog} style="display: {dialog?.open ? 'flex' : 'none'}" class="z-10 w-full h-full justify-center items-center bg-transparent backdrop-brightness-50 drop-shadow-2xl">
    <div class="w-1/4 min-w-64 h-1/2">
        <slot></slot>
        <button class="bg-amber-300 px-6 py-2 text-xl rounded-b" on:click={() => dialog.open = false}>Close</button>
    </div>
</dialog>
