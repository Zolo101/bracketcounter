import { writable } from "svelte/store";
import type { SocketMessageData } from "./socket";
import type { DesktopTree, StatModule } from "./statmodule";
import { barModule } from "./modules/bar";
import { bracketcounter } from "$lib/pocketbase";
import { graphModule } from "./modules/graph";
import { pieModule } from "./modules/pie";

export const latestMessage = writable<SocketMessageData>();
// export const desktop = writable<DesktopTree>(writable({parent: true, depth: 0, direction: DesktopDirection.Vertical, children: [writable({parent: false, depth: 1, module: graphModule}), writable({parent: false, depth: 1, module: barModule})]}));
export const desktop = writable<DesktopTree>(writable({parent: false, depth: 1, appId: "0", module: barModule}));
// export const desktop = writable<DesktopTree>(writable({parent: false, depth: 0}));
export const history = new Map<number, DesktopTree>()
// TODO: Accessibility
export const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
type Accessibility = {
    reduced: boolean
    highContrast: boolean
}
export let accessibility = {
    reduced,
    highContrast: false
}
export let accessibilityWritable  = writable<Accessibility>(accessibility)
let accessibilityStore = localStorage.getItem("accessibility")
if (accessibilityStore !== null) {
    accessibility = JSON.parse(accessibilityStore)
    accessibilityWritable.set(accessibility)
}
export const modules: Record<string, StatModule> = {
    "Bar": barModule,
    "Realtime Graph": graphModule,
    "Pie Chart (WIP)": pieModule
}
export let discordPostable: string;
export let wikiaPostable: string;
desktop.subscribe(dt => history.set(Date.now(), dt))

// TODO: Control from server side
export enum Status {
    Online,
    Error,
    Finished,
    ClientOffline,
    ServerOffline
}
export const status = writable<Status>(Status.ServerOffline)
const ID = "ve8tha1rbkqhjyk"
export const statModules = [
    "Bar",
    "Realtime Graph",
    "Pie Chart (WIP)",
    // "Boredom Repellant",
    // "BFDI Quiz",
    // "BFDIA 5b"
]

function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// const statusElement: HTMLDivElement = <HTMLDivElement> document.querySelector("#status")!;
// const postableElement: HTMLTextAreaElement = <HTMLTextAreaElement> document.querySelector("#postable")!;
// const wikiaElement: HTMLDivElement = <HTMLDivElement> document.querySelector("#wikiapostable")!;

let socket: WebSocket | null = null;
let retries = 0;
const errorMessage = "Sorry, the connection to the Bracketcounter service has failed. Try reloading the page or check that voting has not ended yet."

let translations: {[contestant: string]: string} = {};
let colors: {[contestant: string]: string} = {};

export function init() {
    // const chart = new google.visualization.BarChart(document.getElementById('graph')!);
    if (socket != null && socket.readyState == 1 || retries > 5) return;
    if (socket != null) socket.close(3001, "Reloading"); // to ensure no multiple connections
    retries ++;


    // TODO: Replace "d9nb0anstyi7nk6" with the current episode recordId via config.toml

    status.set(Status.Online)
    bracketcounter.getOne(ID)
        .then(obj => {
            update(obj.buffer)
        })
        .catch(e => {
            // alert("Please check your internet connection and reload the page!")
            console.error(e)
            status.set(Status.ClientOffline)
        })
    bracketcounter.subscribe(ID, (obj) => {
        try {
            update(obj.record.buffer)
            status.set(Status.Online)
        } catch (e) {
            console.log("Unable to update records!")
            console.error(e)
            status.set(Status.Error)
        }
    })

    return;


    // Create WebSocket connection.
    /*
    try {
        // let hostname = 'ws' + (window.location.protocol == "https:" ? "s" : "") + '://' + window.location.hostname + '/socket'
        // let hostname = "ws://109.147.249.120:3001"
        let hostname = "ws://localhost:3001"
        // console.log(hostname)
        socket = new WebSocket(hostname);
    } catch(e) {
        console.log(e)
        // statusElement.textContent = errorMessage
        // statusElement.style.color = "yellow"
    }

    let translations: { [contestant: string]: string } = {};
    let colors: { [contestant: string]: string } = {};

    socket!.addEventListener('open', function() {
        let password = localStorage.getItem("access") ?? "default";
        socket?.send(password);
        socket?.send("default"); // as a backup
    })


    socket!.addEventListener('error', (event) => {
        console.log(event)
        status.set(Status.Busy)
        // statusElement.textContent = errorMessage
        // statusElement.style.color = "yellow"
        init()
    })

    socket!.addEventListener('close', (event) => {
        if (event.code != 3001) init();
    });

    // Listen for messages
    socket!.addEventListener('message', (event) => {
        retries = 0;
        let ob = JSON.parse(event.data);
        latestMessage.set(ob)
        console.log(ob)
        let status = ob.status;
        let config = ob.config;
        for (const contestant in config.contestants) {
            translations[contestant] = "[" + contestant.toUpperCase() + "] " + config.contestants[contestant][0]
            colors[contestant] = config.contestants[contestant][1]
        }
        // document.body.style.background = `linear-gradient(rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 100%), url(https://i.ytimg.com/vi/${status.id}/maxresdefault.jpg)`;
        let discordPostable = '```css\n';
        let wikiaPostable = `{| class="article-table mw-collapsible mw-collapsed" data-expandtext="Show votes" data-collapsetext="Hide votes"
!Icon
!Contestant
!Votes
!Percentage of votes`;
        // let table = [
        //     ['Contestant', 'Votes', {
        //         role: 'style'
        //     }, {
        //         type: 'string',
        //         role: 'annotation'
        //     }, {
        //         id: 'i0',
        //         type: 'number',
        //         role: 'interval'
        //     }, {
        //         id: 'i1',
        //         type: 'number',
        //         role: 'interval'
        //     }]
        // ];
        let sortedKeys = Object.keys(ob.votes).sort(function(a, b) {
            return ob.votes[b] - ob.votes[a]
        });
        for (const letter of sortedKeys) {
            let percent = (ob.votes[letter] / ob.total * 100).toFixed(10);
            let text = translations[letter] + ": " + ob.votes[letter] + " (" + percent.substring(0,4) + "%)";
            let interval = ob.votes[letter] * 0.03;
            // table.push([translations[letter], ob.votes[letter], 'color: '+colors[letter]+'; stroke-color: #9b9b9b', text, ob.votes[letter]+interval, ob.votes[letter]-interval]);
            discordPostable += translations[letter] + ' '.repeat(Math.max(18 - translations[letter].length, 1)) + ob.votes[letter] + ' '.repeat(6 - ob.votes[letter].toString().length) + '[' + percent.substring(0,4) + '%]\n';
            let isGreen = (letter == sortedKeys[0])
            let isRed = (letter == sortedKeys[sortedKeys.length-1])
            let colorPrefix = isGreen ? "{{Color|green|" : (isRed ? "{{Color|red|" : "")
            let colorSuffix = (isGreen || isRed) ? "}}" : ""
            let percent2 = (ob.votes[letter] / ob.total * 100).toFixed(1);
            wikiaPostable += `
|-
|{{TeamIconSpoiler|${config.contestants[letter][0].replace(' ', '')}}}
|{{Spoilerdiv|[[${config.contestants[letter][0]}]]}}
|${colorPrefix}${numberWithCommas(ob.votes[letter])}${colorSuffix}
|${colorPrefix}${percent2}%${colorSuffix}`;

        }
        // let data = google.visualization.arrayToDataTable(table);
        let updateDate = new Date(status.updateDate);
        wikiaPostable += '\n|}';
        let minutesLeft = ((status.deadline - +(updateDate)) / 60000);
        let hoursLeft = Math.floor(minutesLeft / 60);
        let onlyMinsLeft = Math.floor(minutesLeft % 60);
        let secsLeft = Math.floor(((minutesLeft % 60) * 60) % 60);
        let timeString = `${hoursLeft}h ${onlyMinsLeft}m ${secsLeft}s left`;
        let statusString = `${status.done ? "" : "🕒Recounting"} Video ID: ${status.id} Comments read: ${status.comments} Votes: ${status.validVotes} Last update: ${updateDate.toLocaleTimeString()} ${config.deadlineHours == 0 ? "" : timeString}`;
//         statusElement.innerText = statusString;
//         discordPostable += `/************************/
// Comments            ${status.comments}
// Votes               ${status.validVotes}
// /************************/
// Avg Votes Per Char  ${status.validVotes / sortedKeys.length}
// #1st-#2nd Margin    ${ob.votes[sortedKeys[0]] - ob.votes[sortedKeys[1]]} [${(ob.votes[sortedKeys[1]] / ob.votes[sortedKeys[0]] * 100).toFixed(1)}%]
// #${ordinal(sortedKeys.length-1)}-#${ordinal(sortedKeys.length)} Margin    ${ob.votes[sortedKeys[sortedKeys.length-2]] - ob.votes[sortedKeys[sortedKeys.length-1]]} [${(ob.votes[sortedKeys[sortedKeys.length-1]] / ob.votes[sortedKeys[sortedKeys.length-2]] * 100).toFixed(1)}%]
// #1st-#${ordinal(sortedKeys.length)} Margin    ${ob.votes[sortedKeys[0]] - ob.votes[sortedKeys[sortedKeys.length-1]]} [${(ob.votes[sortedKeys[sortedKeys.length-1]] / ob.votes[sortedKeys[0]] * 100).toFixed(1)}%]
// \`\`\``;
//         postableElement.textContent = discordPostable;
//         wikiaElement.textContent = wikiaPostable;

        /*
        chart.draw(data, {
            //height: 400,
            backgroundColor: 'transparent',
            legend: {
                position: 'none'
            },
            axisTitlesPosition: 'none',
            // accurate bar widths
            hAxis: {
                viewWindow: {
                    max: ob.votes[sortedKeys[0]] * 1.1,
                    min: 0
                },
                textPosition: 'out',
                ticks: customTicks
            },
            tooltip : {
                trigger: 'none'
            },
            vAxis: {
                textPosition: 'none'
            },
            bar: {
                groupWidth: '100%'
            },
            chartArea: {
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            },
            // @ts-ignore TS2345
            intervals: { 'style': 'bar', 'lineWidth':2, 'barWidth': 0.9 },
            // @ts-ignore TS2345
            interval: {
                'i0': { 'style': 'box', color: '#9b9b9b'},
                'i1': { 'style': 'bar', color: '#9b9b9b'}
            },
            fontName: 'Roboto'
        });

    });
    */
}

function update(obj: any) {
    retries = 0;
    console.log(obj)
    let ob: any = structuredClone(obj)
    latestMessage.set(ob)
    console.log(ob)
    let status = ob.status;
    let config = ob.config;
    for (const contestant in config.contestants) {
        translations[contestant] = "[" + contestant.toUpperCase() + "] " + config.contestants[contestant][0]
        colors[contestant] = config.contestants[contestant][1]
    }
    // document.body.style.background = `linear-gradient(rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 100%), url(https://i.ytimg.com/vi/${status.id}/maxresdefault.jpg)`;
    discordPostable = '```css\n';
    wikiaPostable = `{| class="article-table mw-collapsible mw-collapsed" data-expandtext="Show votes" data-collapsetext="Hide votes"
!Icon
!Contestant
!Votes
!Percentage of votes`;
    // let table = [
    //     ['Contestant', 'Votes', {
    //         role: 'style'
    //     }, {
    //         type: 'string',
    //         role: 'annotation'
    //     }, {
    //         id: 'i0',
    //         type: 'number',
    //         role: 'interval'
    //     }, {
    //         id: 'i1',
    //         type: 'number',
    //         role: 'interval'
    //     }]
    // ];
    let sortedKeys = Object.keys(ob.votes).sort(function(a, b) {
        return ob.votes[b] - ob.votes[a]
    });
    for (const letter of sortedKeys) {
        let percent = (ob.votes[letter] / ob.total * 100).toFixed(10);
        // table.push([translations[letter], ob.votes[letter], 'color: '+colors[letter]+'; stroke-color: #9b9b9b', text, ob.votes[letter]+interval, ob.votes[letter]-interval]);
        discordPostable += translations[letter] + ' '.repeat(Math.max(18 - translations[letter].length, 1)) + ob.votes[letter] + ' '.repeat(6 - ob.votes[letter].toString().length) + '[' + percent.substring(0,4) + '%]\n';
        let isGreen = (letter == sortedKeys[0])
        let isRed = (letter == sortedKeys[sortedKeys.length-1])
        let colorPrefix = isGreen ? "{{Color|green|" : (isRed ? "{{Color|red|" : "")
        let colorSuffix = (isGreen || isRed) ? "}}" : ""
        let percent2 = (ob.votes[letter] / ob.total * 100).toFixed(1);
        wikiaPostable += `
|-
|{{TeamIconSpoiler|${config.contestants[letter][0].replace(' ', '')}}}
|{{Spoilerdiv|[[${config.contestants[letter][0]}]]}}
|${colorPrefix}${numberWithCommas(ob.votes[letter])}${colorSuffix}
|${colorPrefix}${percent2}%${colorSuffix}`;

    }
}
