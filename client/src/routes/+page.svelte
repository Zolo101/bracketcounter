<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { desktop, init, latestMessage } from "../app";
    import Desktop from "../components/Desktop.svelte";
    import Live from "../components/Live.svelte";
    let countdownText = "";
    let countdown: number;
    let deadline = 99999999999

    $: acceptedTerms = 1;
    onMount(() => {
        acceptedTerms = JSON.parse(localStorage.getItem("acceptedTerms"))
        init()

        latestMessage.subscribe(v => {
            if (v === undefined) deadline = -1
            // console.log(v)
            deadline = v?.status.deadline
        })
    })


    const acceptTerms = () => {
        localStorage.setItem("acceptedTerms", "1")
        acceptedTerms = 1
        init()
    }

    const declineTerms = () => {
        window.location.href = "https://google.com";
        localStorage.clear();
    }

    const formatSeconds = (secs: number) => {
        const pad = (n: number) => n < 10 ? `0${n}` : n;

        const h = Math.floor(secs / 3600);
        const m = Math.floor(secs / 60) - (h * 60);
        const s = Math.floor(secs - h * 3600 - m * 60);

        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    setInterval(() => {
        countdown = Math.max(0, (deadline - Date.now()) / 1000)
        countdownText = formatSeconds(countdown)
    }, 1000)
</script>

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/icon.png" type="image/x-icon"/>
    <title>[bc]</title>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9NR4C4M5T0"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-9NR4C4M5T0');
    </script>
<!--    TODO: Remove google analytics after tpot 10 counting -->
    <script defer src="https://analytics.zelo.dev/script.js" data-website-id="634d53b7-0a46-4caf-82a8-95db35ba1f6d"></script>
</svelte:head>

{#if deadline !== -1}
    <div class="flex w-full h-full bg-black">
        <img class="m-auto" src="bc_will.png" height="512" width="512" alt="waiting for tpot 10"/>
    </div>
{:else}
    {#if acceptedTerms}
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-around text-white text-5xl max-md:text-3xl min-h-[66px] max-h-[100px] grow px-5 z-10">
                <span class="title p-2">[bc]</span>
                <span class="text-orange-500 text-xl font-bold">These results are UNCONFIRMED and will differ from the official count!</span>
        <!--        <span class="text-4xl text-red-600" style="font-family: 'Comic Sans MS', 'Comic Neue', sans-serif;">unofficial unconfirmed!!1!</span>-->
        <!--        <span class="text-xl text-orange-400">WIP mod of figgyc bracketcounter</span>-->
        <!--        <a href="https://github.com/zolo101/bracketcounter" class="text-xl !text-yellow-400 hover:underline">(Github Repo)</a>-->
<!--                <span class="bg-white/10 p-2 rounded-xl" class:end={!countdown}>{countdownText}</span>-->
        <!--        <span class="text-xl text-green-400">For now, close contestants are rounded to discourage alt voting</span>-->
<!--                <Live/>-->
            </div>
        <!--<div id="status" class="text-white"></div>-->
        <!--<div id="graph" class="w-full h-3/5 v2s"></div>-->
        <!--<div id="bars"></div>-->
        <!--<div id="share" class="text-white">Share on Discord and Wikia</div>-->

        <!--<textarea id="postable" class="whitespace-pre-wrap w-1/5 h-1/3"></textarea>-->
        <!--<textarea id="wikiapostable" style="white-space: pre-wrap; width: 48%; height: 30%;"></textarea>-->
        <!--<div id="legal" class="float-left h-[3%] bg-gray-800 p-1.5">-->
        <!--    <a on:click={() => acceptedTerms = false}>Legal Notices</a>-->
        <!--    <a href="https://youtube.com">-->
        <!--        <img src="./developed-with-youtube.svg" class="h-8" alt="Developed With YouTube"/>-->
        <!--    </a>-->
        <!--</div>-->
            {#if $latestMessage}
                <div class="bg-neutral-600 grow relative">
                    <Desktop tree={$desktop}/>
                </div>
            {/if}
        </div>
    {:else}
        <!-- TODO: Make terms and conditions mobile friendly-->
        <div class="flex justify-center">
            <div transition:fly={{y: -200}} class="w-full h-full mx-20 p-5 text-xl leading-normal z-10 shadow-2xl bg-gray-900 text-gray-300">
                <p class="font-bold text-4xl text-center">Before you use this website please read and agree to the following:</p>
                <h3>Disclaimer</h3>
                <ul>
                    <li style="color: yellow"><strong>Spoiler warning!</strong> This website contains unofficial predictions of TPOT results so do not click through if you do not want to find out who is eliminated.</li>
                    <li class="text-orange-500"><strong>Notice</strong> This is a modified version of <a href="https://bracket.figgyc.uk/live/">figgyc's bracketcounter</a>!</li>
                    <li>This website counts votes with comment data sourced from YouTube's Data API however the counting is done independently from YouTube and is not endorsed by YouTube or anyone else and no guarantee is made towards its accuracy or validity.</li>
                </ul>
                <h3>Terms of Use</h3>
                <ul>
                    <li>By clicking Accept at the bottom of this page, you agree to this Terms of Use and the Privacy Policy.</li>
                    <li>By using this website, you agree to be bound by the YouTube Terms of Service available at <a href="https://www.youtube.com/t/terms">https://www.youtube.com/t/terms</a>.</li>
                </ul>
                <h3>Privacy Policy</h3>
                <ul>
                    <li>This website uses YouTube API Services and your usage may be subject to the Google Privacy Policy available at <a href="https://www.google.com/policies/privacy">https://www.google.com/policies/privacy</a>.</li>
                    <li>The purpose of this website is to read comments from a YouTube video, principally from the video series <a href="https://www.youtube.com/playlist?list=PL24C8378F296DB656">Battle for Dream Island</a>, and to provide an estimate of the amount of users who indicate that they like or dislike characters for the purposes of entertainment and convenience by reducing the need to manually count comments.</li>
                    <li>This website collects the following data:
                        <ul>
                            <li>Comment data is retrieved from YouTube, consisting of user ID, comment ID, time the comment was last updated, and comment text content, for the purposes of reading "votes", character sequences typically in the form of a letter between two square brackets, and counting the votes received for a given letter. Your full comment text is not stored.</li>
                            <li>Your user ID and comment ID are stored for the purpose of only counting one vote per user. Your user ID and comment ID are not shared. </li>
                            <li>The time your comment was last updated is stored for the purpose of not counting votes published after the period in which votes are counted, typically 48 hours after the video is uploaded. This is not shared. </li>
                            <li>Total vote counts received for each letter are shared publicly on this website however there is no way to connect you personally to which letter you may have voted for through this website.</li>
                            <li>All data will be deleted shortly after the period in which votes are counted following a video's release, no longer than 28 days after collection.</li>
                        </ul>
                    </li>
                    <li>I reserve the right to recollect data temporarily after the vote period finishes for the purpose of providing the service to YouTube for audit purposes.</li>
                    <li>Although the YouTube Terms of Service designate your comment(s) as Content and provide other users with access to them, you may request the website not count comments connected to your YouTube channel by messaging me on discord (@zelo101), including a link to your YouTube channel. This request will be respected as soon as possible. Please note that this request does not affect your comments on YouTube and other parties are still able to collect that data. Of course if you wish that nobody can read your comments, then you should use a YouTube Application to delete the comment.</li>
                    <li>This website only stores two pieces of data on your device using localStorage technology (basically, cookies) which is used to track whether or not you have accepted this legal notice, and to store your accessibility settings. This data is not transmitted to my server and is only kept on this device to ensure you have read the notice. If you do not wish for this website to store data on this device then decline the notice.</li>
                </ul>
                <div class="flex justify-center">
                    <div class="btn">
                        <button on:click={acceptTerms}>Accept</button>
                    </div>
                    <div class="btn">
                        <button on:click={declineTerms} id="decline">Decline</button>
                    </div>
                </div>
    <!--            <span class="text-neutral-400">You may change your preference at any time by clicking the Legal Notices button at the bottom right of the page.</span>-->
            </div>
        </div>
    {/if}
{/if}

<style>
    h3 {
        @apply italic;
    }

    .btn {
        @apply cursor-pointer transition-all text-4xl bg-gray-700 text-white px-10 py-4 outline outline-white/40 rounded-lg m-2;
    }

    .btn:hover {
        @apply bg-gray-600 outline-white/80;
    }

    .title {
        font-family: Nabla, sans-serif;
        font-palette: --myPal;
        /*animation: rainbow 1s infinite alternate-reverse;*/
        /*transform: perspective(500px) translateX(150px) rotateX(80deg);*/
        /*@apply text-7xl -tracking-[0.05em];*/
    }

    @font-palette-values --myPal {
        /*animation: rainbow 1s infinite alternate-reverse;*/
        font-family: Nabla;
        base-palette: 4;
        override-colors:
            8 rgb(253, 201, 0),
            7 rgb(0, 0, 0),
            6 rgb(0, 0, 0),
            5 rgb(0, 0, 0),
            4 rgb(253, 201, 0),
            3 rgb(253, 201, 0),
            2 rgb(253, 201, 0),
            1 rgb(253, 201, 0);
    }

    .end {
        @apply bg-black text-red-500 animate-pulse;
    }
</style>
