<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import {desktop, init, latestMessage} from "../app";
    import Desktop from "../components/Desktop.svelte";

    let acceptedTerms = 1;
    onMount(() => {
        acceptedTerms = JSON.parse(localStorage.getItem("acceptedTerms"))
        init()
    })

    const acceptTerms = () => {
        localStorage.setItem("acceptedTerms", "1")
        acceptedTerms = 1
        init()
    }
</script>

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/icon.png" type="image/x-icon"/>
    <title>Bracketcounter</title>
    <meta http-equiv="refresh" content="300">
</svelte:head>

<div class="flex flex-col h-full">
    <div id="thing" class="text-white text-6xl h-20 overflow-hidden mx-10 mt-5">
        <span>zelo's bracketcounter</span>
        <span class="text-4xl text-red-600" style="font-family: 'Comic Sans MS', 'Comic Neue', sans-serif;">unofficial unconfirmed!!1!</span>
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
        <div class="bg-neutral-600 grow relative p-5">
            <Desktop tree={$desktop}/>
        </div>
    {/if}
</div>

{#if !acceptedTerms}
    <div transition:fly={{x: 200}} id="privacypolicy" class="text-lg z-[9999] fixed top-[0] left-[0] right-[0] bottom-[0] m-auto w-11/12 h-11/12 shadow-2xl bg-gray-900 p-2 text-gray-300 block">
        <p class="text-center">Before you use this website please read and agree to the following:</p>
        <h3>Disclaimer</h3>
        <ul>
            <li class="text-orange-500 text-4xl"><strong>Notice</strong> This is a modified version of <a href="https://bracket.figgyc.uk/live/">figgyc's bracketcounter</a>!</li>
            <li style="color: yellow"><strong>Spoiler warning!</strong> This website contains unofficial predictions of BFB results so do not click through if you do not want to find out who is eliminated.</li>
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
            <li>Although the YouTube Terms of Service designate your comment(s) as Content and provide other users with access to them, you may request the website not count comments connected to your YouTube channel by contacting the email at the end of the privacy policy, including a link to your YouTube channel. This request will be respected as soon as possible. Please note that this request does not affect your comments on YouTube and other parties are still able to collect that data. Of course if you wish that nobody can read your comments, then you should use a YouTube Application to delete the comment.</li>
            <li>This website only stores one piece of data on your device using localStorage technology which is used to track whether or not you have accepted this legal notice. This data is not transmitted to my server and is only kept on this device to ensure you have read the notice. If you do not wish for this website to store data on this device then decline the notice.</li>
        </ul>
        <button id="accept" on:click={() => acceptTerms()}>Accept</button>
        <a href="https://google.com" on:click={() => localStorage.clear()} id="decline">Decline</a> You may change your preference at any time by clicking the Legal Notices button at the bottom right of the page.
    </div>
{/if}
