import { Graphics, Text, Texture } from "pixi.js";
import type { StatModule } from "../statmodule";
import { ordinal } from "../statmodule";

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
            return true;
    }
}


export const barModule: StatModule = {
    name: "Bar",
    render(app, stats) {
        const contestants = stats.config.contestants
        const votes = Object.entries(stats.votes)
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

        // const text = new Text("Hello, World!")
        app.stage.addChild(background, bar, ...voteLineNumberText, ...voteLineLeaderboardIndexText, ...voteLineBarVoteCountText);
        // app.stage.addChild(text);

        const texture = Texture.from("dots_alpha.png")
        texture.baseTexture.setSize(32, 32)

        let counter = 0;
        app.ticker.add(() => {
            const width = app.view.width;
            const height = app.view.height;
            counter++;
            app.resize()

            background.clear()
            background.beginFill({h: counter, s: 100, v: 10})
            background.drawRect(0, 0, 9999, 9999)
            background.endFill()


            bar.clear()
            let i = 0;
            let len = Object.entries(stats.votes).length + 5
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
                const width = displayVotes / 10
                // const width = votes / 10
                const x = 100
                const y = 20 + (i * (height / len + 20))

                const backgroundColour = whatTeam(key) ? "#fdca00" : "#dee0fd"

                bar.beginFill(backgroundColour)
                bar.drawRect(x - 10, y, 100, height / len)

                bar.beginFill(colour)
                bar.drawRect(x, y, width, height / len)
                bar.beginTextureFill({
                    color: colour,
                    texture
                })

                if (closeCall) {
                    bar.beginFill(colour, 0.2)
                    bar.drawRect(x, y, width + 10, height / len)
                }

                // TODO: Changes "votes" so that it doesnt eventually clip out of the window
                bar.drawRect(x, y, width, height / len)
                bar.endFill()

                voteLineNumberText[i].text = `${name} (${key.toUpperCase()})`
                voteLineNumberText[i].setTransform(x + 5, y)

                if (closeCall) {
                    voteLineLeaderboardIndexText[i].text = "--"
                    voteLineBarVoteCountText[i].text = "~" + displayVotes
                    voteLineBarVoteCountText[i].setTransform(x + 10 + width + 10, y + 2)
                } else {
                    voteLineLeaderboardIndexText[i].text = ordinal(i + 1)
                    voteLineBarVoteCountText[i].setTransform(x + 10 + width, y + 2)
                    voteLineBarVoteCountText[i].text = displayVotes
                }
                voteLineLeaderboardIndexText[i].setTransform(x - 80, y + 8)
                i++;
            }
            // bar.lineStyle()
        })
    }
}

const anyClose = (a: number, b: number, threshold= 50) => Math.abs(a - b) < threshold
