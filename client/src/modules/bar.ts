import { Graphics, Text, Texture } from "pixi.js";
import type { StatModule } from "../statmodule";
import { ordinal } from "../statmodule";
import { history, latestMessage } from "../app";

const whatTeam = (key: string) => {
    switch (key) {
        case "a":
        case "b":
        case "c":
        case "d":
        case "e":
        case "f":
            return false;

        case "g":
        case "h":
        case "i":
        case "j":
        case "k":
        case "l":
        default:
            return true;
    }
}


export const barModule: StatModule = {
    name: "Bar",
    render(app, stats) {
        const lastTimesVotes: Record<string, number[]> = {} // 10 tick history of last vote count rise amounts
        lastTimesVotes["a"] = [] // :(
        lastTimesVotes["b"] = []
        lastTimesVotes["c"] = []
        lastTimesVotes["d"] = []
        lastTimesVotes["e"] = []
        lastTimesVotes["f"] = []
        lastTimesVotes["g"] = []
        lastTimesVotes["h"] = []
        lastTimesVotes["i"] = []
        lastTimesVotes["j"] = []
        lastTimesVotes["k"] = []
        lastTimesVotes["l"] = []

        latestMessage.subscribe(m => {
            stats = m
            for (const [key, votes] of Object.entries(m.votes)) {
                lastTimesVotes[key].push(votes)
                if (lastTimesVotes[key].length > 10) lastTimesVotes[key].shift()
            }
        })

        const votes = Object.entries(stats.votes)
        const contestants = stats.config.contestants
        const background = new Graphics()
        const bar = new Graphics()
        background.beginFill(0x000000)
        background.drawRect(0, 0, 9999, 9999)
        background.endFill()


        const voteLineNumberText = new Array(votes.length)
            .fill(0)
            .map((_, i) => new Text("", {
                // fontFamily: "monospace",
                fontSize: 36,
                fontWeight: "bold",
                dropShadow: true,
                dropShadowAlpha: 0.5,
                dropShadowDistance: 3,
                fill: "#ffffff",
                // fill: contestants[votes[i][0]][1],
            }))

        voteLineNumberText.forEach(nt => nt.alpha = 0.5)

        const voteLineLeaderboardIndexText = new Array(votes.length)
            .fill(0)
            .map((_, i) => new Text("", {
                fill: 0xffffff,
                fontFamily: "monospace",
                fontSize: 34,
                fontWeight: "bold",
                // dropShadow: true,
                // dropShadowAlpha: 0.2,
                // dropShadowDistance: 6
                // fill: contestants[votes[i][0]][1],
            }))

        const voteLineBarVoteCountText = new Array(votes.length)
            .fill(0)
            .map((_, i) => new Text("", {
                fill: 0xffffff,
                // fill: contestants[votes[i][0]][1],
                // fontFamily: "monospace",
                fontSize: 34,
                fontWeight: "bold",
                // dropShadow: true,
                // dropShadowAlpha: 0.2,
                // dropShadowDistance: 6
            }))

        const voteLineBarVoteCountTextInfo = new Array(votes.length)
            .fill(0)
            .map((_, i) => new Text("", {
                fill: 0xffffff,
                // fill: contestants[votes[i][0]][1],
                // fontFamily: "monospace",
                fontSize: 16,
                fontWeight: "bold",
                // dropShadow: true,
                // dropShadowAlpha: 0.2,
                // dropShadowDistance: 6
            }))
        voteLineBarVoteCountTextInfo.forEach(t => t.alpha = 0.5)

        // const text = new Text("Hello, World!")
        app.stage.addChild(background, bar, ...voteLineNumberText, ...voteLineLeaderboardIndexText, ...voteLineBarVoteCountText, ...voteLineBarVoteCountTextInfo);
        // app.stage.addChild(text);

        const texture = Texture.from("dots_alpha.png")
        texture.baseTexture.setSize(32, 32)

        let counter = 0;
        app.ticker.add(() => {
            const appWidth = app.view.width;
            const appHeight = app.view.height;
            counter++;
            app.resize()

            let len = Object.entries(stats.votes).length + 5
            let range = getRange(stats.votes)
            let widthOf1000 = (appWidth / 10) * (1000 / range)

            background.clear()
            background.beginFill({h: counter, s: 100, v: 10})
            background.drawRect(0, 0, 9999, 9999)
            background.beginFill(0xffffff, 0.1)
            let j = 0;
            while (j < appWidth) {
                background.drawRect(j, 0, 4, 9999)
                j += widthOf1000;
            }
            background.endFill()

            // console.log(lastTimesVotes)
            // console.log(lastTimesVotes["a"])

            bar.clear()
            let i = 0;
            const sorted = Object.entries(stats.votes).sort((a, b) => b[1] - a[1])
            for (const [key, votes] of sorted) {
                const name = contestants[key][0]
                const colour = contestants[key][1]

                const previousContestant = sorted[i - 1]
                const previousContestantVotes = previousContestant ? previousContestant[1] : 0
                const nextContestant = sorted[i + 1]
                const nextContestantVotes = nextContestant ? nextContestant[1] : 0
                // const closeCall = anyClose(votes, nextContestantVotes) || anyClose(votes, previousContestantVotes)
                const closeCall = false
                const displayVotes = closeCall ? Math.round(votes / 100) * 100 : votes
                // const colour = contestants[key][1]
                const width = (appWidth / 10) * (displayVotes / range)
                // const width = votes / 10
                const x = 100
                const y = 20 + (i * (appHeight / len + 20))

                const backgroundColour = whatTeam(key) ? "#9dcf4b" : "#fd8fbe"

                bar.beginFill(backgroundColour)
                bar.drawRect(x - 10, y, 100, appHeight / len)

                bar.beginFill(colour)
                bar.drawRect(x, y, width, appHeight / len)
                bar.beginTextureFill({
                    color: colour,
                    texture
                })

                if (closeCall) {
                    bar.beginFill(colour, 0.2)
                    bar.drawRect(x, y, width + 10, appHeight / len)
                }

                // TODO: Changes "votes" so that it doesnt eventually clip out of the window
                bar.drawRect(x, y, width, appHeight / len)
                bar.endFill()

                voteLineNumberText[i].text = `${name} [${key.toUpperCase()}]`
                voteLineNumberText[i].setTransform(x + 5, y)

                if (closeCall) {
                    voteLineLeaderboardIndexText[i].text = "--"
                    voteLineBarVoteCountText[i].text = "~" + displayVotes
                    voteLineBarVoteCountText[i].setTransform(x + 10 + width + 10, y + 2)
                } else {
                    voteLineLeaderboardIndexText[i].text = ordinal(i + 1)
                    voteLineBarVoteCountText[i].setTransform(x + 10 + width, y - 4)
                    voteLineBarVoteCountText[i].text = displayVotes
                    // voteLineBarVoteCountTextInfo[i].text = `Avg gain: + ${getAverageGainPerMinute(lastTimesVotes[key])}, Since Last Refresh: + ${lastTimesVotes[key].at(-1)}`
                    voteLineBarVoteCountTextInfo[i].text = `+${getLatestGain(lastTimesVotes[key])}, ~${getAverageGainPerMinute(lastTimesVotes[key]).toPrecision(2)} per minute`
                    voteLineBarVoteCountTextInfo[i].setTransform(x + 10 + width, y + 32)
                }
                voteLineLeaderboardIndexText[i].setTransform(x - 80, y + 8)

                // const textScale = Math.max(900, appWidth) / 900
                //
                //
                // voteLineNumberText[i].scale.set(1, textScale)
                // voteLineBarVoteCountText[i].scale.set(1, textScale)
                // voteLineLeaderboardIndexText[i].scale.set(1, textScale)
                i++;
            }
            // bar.lineStyle()
        })
    }
}

const anyClose = (a: number, b: number, threshold= 50) => Math.abs(a - b) < threshold
const getRange = (obj: Record<string, number>) => Math.max(...Object.values(obj)) - Math.min(...Object.values(obj))
const getAverageGainPerMinute = (history: number[]) => {
    const gain = history.map((v, i) => history[i] - (history[i - 1] ?? 0))
    gain.shift()
    if (gain.length === 0) return 0

    const gainSum = gain.reduce((a, b) => a + b)
    return (gainSum / gain.length) * 2 // 2 ticks = 1 minute
}
const getLatestGain = (history: number[]) => {
    if (history.length >= 2) {
        return history.at(-1)! - history.at(-2)!
    } else {
        return 0
    }
}
