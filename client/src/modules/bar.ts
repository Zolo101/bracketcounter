import {
    type Application,
    Assets,
    BlurFilter,
    ColorMatrixFilter,
    Container,
    Graphics,
    type ICanvas,
    Sprite,
    Text,
    Texture
} from "pixi.js";
import type { StatModule } from "../statmodule";
import { ordinal } from "../statmodule";
import { accessibility, history, latestMessage } from "../app";
import type { Contestants, SocketMessageData } from "../socket";
import anime from "animejs";
import { getUseful } from "$lib/useful";
import { stringHexToNum } from "$lib/misc";
import { getDuration } from "$lib/a11y";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

const texture = Texture.from("dots_alpha.png")
texture.baseTexture.setSize(32, 32)

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

class Bar {
    app: Application<ICanvas>
    index: number
    placement: number
    closeCall: boolean
    positionHistory: number[] // every 1 tick, for 10 ticks
    bar: Container
    barGraphic: Graphics
    mask: Graphics
    icon: Sprite
    text: {
        name: Text,
        votes: Text,
        votesInfo: Text,
        leaderboardIndex: Text,
        leaderboardIndexVoteLetter: Text,
    }

    constructor(index: number, app: Application<ICanvas>) {
        this.index = index
        this.placement = 0
        this.app = app
        this.closeCall = false
        this.positionHistory = []
        this.bar = new Container()
        this.barGraphic = new Graphics()
        this.mask = new Graphics()
        this.icon = new Sprite()
        this.text = {
            name: new Text("", {
                // fontFamily: "monospace",
                fontSize: 36,
                // breakWords: true,
                fontFamily: ["Inter", "sans-serif"],
                fontWeight: "700",
                dropShadow: true,
                dropShadowAlpha: 0.5,
                dropShadowDistance: 3,
                lineHeight: 35,
                wordWrap: true,
                fill: "#ffffff",
                // fill: contestants[votes[i][0]][1],
            }),
            votes: new Text("", {
                fill: [
                    0xffffff,
                    0xffffff,
                ],
                // fill: contestants[votes[i][0]][1],
                // fontFamily: "monospace",
                fontSize: 34,
                fontWeight: "bold",
                fillGradientStops: [0.1, 0.8],
                dropShadow: true,
                dropShadowAlpha: 0.2,
                dropShadowDistance: 4
            }),
            votesInfo: new Text("", {
                fill: 0xffffff,
                // fill: contestants[votes[i][0]][1],
                // fontFamily: "monospace",
                fontSize: 18,
                fontWeight: "bold",
                // dropShadow: true,
                // dropShadowAlpha: 0.2,
                // dropShadowDistance: 6
            }),
            leaderboardIndex: new Text("", {
                fill: 0xffffff,
                fontFamily: "monospace",
                fontSize: 34,
                fontWeight: "bold",
                dropShadow: true,
                dropShadowAlpha: 0.2,
                dropShadowDistance: 3
                // fill: contestants[votes[i][0]][1],
            }),
            leaderboardIndexVoteLetter: new Text("", {
                fill: 0xffffff,
                fontFamily: "monospace",
                fontSize: 18,
                fontWeight: "bold",
                dropShadow: true,
                dropShadowAlpha: 0.2,
                dropShadowDistance: 2
                // fill: contestants[votes[i][0]][1],
            })
        }
        this.barGraphic.filters = [new DropShadowFilter({blur: 2})]

        this.text.name.alpha = 0.5
        this.text.votesInfo.alpha = 0.5

        this.bar.position.x = 5
        this.bar.sortableChildren = true
        this.bar.addChild(this.barGraphic, this.mask, this.icon, this.text.name, this.text.votes, this.text.votesInfo, this.text.leaderboardIndex, this.text.leaderboardIndexVoteLetter)
        app.stage.addChild(this.bar)
    }

    async setTexture(stats: SocketMessageData) {
        const contestantVotes = Object.entries(stats.votes)
        const [key, votes]: [string, number] = contestantVotes[this.index]
        const contestants = stats.config.contestants
        const [name, colour] = contestants[key]
        // const u = getUseful(this.app, stats, this.index)
        // const y = 20 + (u.placement * (u.appHeight / u.len + 20))

        this.icon.texture = await Assets.load(`characters/${name}.webp`)
        // this.icon.roundPixels = false
        this.icon.height = 128
        this.icon.width = this.icon.texture.width * (this.icon.height / this.icon.texture.height)
        this.icon.alpha = 0.5
        this.icon.position.y = 32

        // const colorMatrix = new ColorMatrixFilter()
        // colorMatrix.desaturate()
        // colorMatrix.tint(stringHexToNum(colour))

        // this.icon.filters = [colorMatrix]

        this.barGraphic.eventMode = "dynamic"
        this.barGraphic.on("mouseover", () => {
            // animate icon bouncing up
            anime({
                targets: this.icon,
                y: this.icon.y - 20,
                alpha: 1,
                duration: getDuration(200),
                easing: "easeInOutBack",
                complete: () => this.icon.position.y = 12
                // update: () => this.icon.position.y = wrap.y
            })
            // this.icon.alpha = 1
            // this.icon.filters = []
        })
        this.barGraphic.on("mouseout", () => {
            // animate icon bouncing down
            anime({
                targets: this.icon,
                y: this.icon.y + 20,
                duration: getDuration(200),
                alpha: 0.5,
                easing: "easeInOutBack",
                complete: () => this.icon.position.y = 32
                // update: () => this.icon.position.y = wrap.y
            })
            this.icon.alpha = 0.5
            // this.icon.filters = [colorMatrix]
        })
    }

    moveIcon(y: number) {
        this.icon.position.y = y
    }

    update(stats: SocketMessageData, lastTimesVotes: Record<string, number[]>) {
        // setup variables
        const u = getUseful(this.app, stats, this.index)
        const dangerZone = u.sortedVotes.at(-1)![1] + 150

        // then do stuff

        const displayVotes = this.closeCall ? Math.round(u.votes / 100) * 100 : u.votes
        // const ratioToFirst = displayVotes / u.sortedVotes[0][1]
        // const width = (appWidth * 0.6) * ratioToFirst
        const lowest = u.sortedVotes.at(-1)![1] / 2
        const highest = u.sortedVotes.at(0)![1]
        const diff = displayVotes - lowest
        const range = highest - lowest

        // const width = (u.appWidth / 10) * (displayVotes / u.range)
        const max = u.appWidth * 0.6
        const width = clamp((diff / range) * max, 60, u.appWidth - 250)
        const height = u.appHeight / u.len

        const x = 100
        const y = 20 + (u.placement * (height + 20))

        this.mask.beginFill("#000000", 0.7)
        this.mask.drawRect(100, 0, width, height)
        this.mask.endFill()
        this.mask.zIndex = 10;

        this.icon.mask = this.mask

        // TODO: Put in another function?
        const backgroundColour = "#FDC900"

        this.barGraphic.clear()
        this.barGraphic.beginFill(backgroundColour)
        this.barGraphic.drawRect(5, 0, 3, height)

        this.barGraphic.beginFill(u.colour)
        this.barGraphic.drawRect(x, 0, width, height)
        this.barGraphic.beginTextureFill({
            color: u.colour,
            texture
        })

        if (this.closeCall) {
            this.barGraphic.beginFill(u.colour, 0.2)
            this.barGraphic.drawRect(x, 0, width + 10, height)
        }

        // TODO: Changes "votes" so that it doesnt eventually clip out of the window
        this.barGraphic.drawRect(x, 0, width, height)
        this.barGraphic.endFill()
        // this.mask = this.barGraphic.clone()

        // the mask fucks up when swapping places
        // this.mask.beginFill("#000000", 0.7)
        // this.mask.drawRect(0, 0, this.mask.width, this.mask.height)
        // this.mask.endFill()
        console.log(y, this.mask.getBounds())


        this.text.name.text = u.name
        this.text.name.setTransform(x + 5, 0)
        // this.text.name.style.fontSize = width / 4;
        this.text.name.width = clamp((width - 10) * 0.95, 50, 160)
        this.text.name.height = this.barGraphic.height

        if (this.closeCall) {
            this.text.leaderboardIndex.text = "--"
            this.text.votes.text = "~" + displayVotes
            this.text.votes.setTransform(x + 10 + width + 10, 2)
        } else {
            this.text.leaderboardIndex.text = ordinal(u.placement + 1)
            this.text.leaderboardIndexVoteLetter.text = `[${u.key.toUpperCase()}]`
            this.text.leaderboardIndexVoteLetter.style.fill = u.colour
            this.text.votes.setTransform(x + 10 + width, -4)
            this.text.votes.text = displayVotes
            this.text.votes.style.fill = ["#ffffff", u.colour]
            // voteLineBarVoteCountTextInfo[i].text = `Avg gain: + ${getAverageGainPerMinute(lastTimesVotes[key])}, Since Last Refresh: + ${lastTimesVotes[key].at(-1)}`
            this.text.votesInfo.text = `+${getLatestGain(lastTimesVotes[u.key])}, ~${getAverageGainPerMinute(lastTimesVotes[u.key]).toPrecision(2)} per minute`
            this.text.votesInfo.setTransform(x + 10 + width, 32)
        }

        if (dangerZone > u.votes) {
            this.text.leaderboardIndex.style.fill = "#ff9090"
        }

        this.icon.position.x = x + width - 100
        this.text.leaderboardIndex.setTransform(x - 80, 8)
        this.text.leaderboardIndexVoteLetter.setTransform(x - 66, 40)
        this.text.name.style.wordWrapWidth = (width - 10)


        // this.bar.setTransform(5, y)
        if (u.placement != this.placement && !accessibility.reduced) {
            anime({
                targets: this.bar,
                y: y,
                duration: getDuration(2000),
                easing: "easeOutCubic",
                complete: () => {
                    this.bar.y = y
                }
            })
        } else {
            this.bar.y = y
        }
        this.placement = u.placement
    }

    onTick(stats: SocketMessageData) {
        const u = getUseful(this.app, stats, this.index)

        // position history housekeeping
        this.positionHistory.push(u.placement)
        if (this.positionHistory.length > 10) this.positionHistory.shift()

        const changedPosition = this.positionHistory[0] !== this.positionHistory.at(-1)
        if (changedPosition) {
            const y = 20 + (u.placement * (u.appHeight / u.len + 20))
            // this.moveIcon(y)
        }
    }

    // private calculateBarWidth() {
    //     const ratioToFirst = displayVotes / sorted.at(0)![1]
    //     const width = (appWidth * 0.6) * ratioToFirst
    // }
}

// function iterateOverContestants(stats: SocketMessageData, func: (contestants: [string, number]) => void) {
//     const sorted = Object.entries(stats.votes).sort((a, b) => b[1] - a[1])
//     for (const [key, votes] of sorted) {
//         func([key, votes])
//     }
// }

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

export const barModule: StatModule = {
    name: "Bar",
    render(app, stats) {
        Text.defaultResolution = 2;
        Text.defaultAutoResolution = false;
        const bars: Bar[] = []

        // const t = Texture.from("Pie.webp")
        // i want 1000 sprites
        // const snowSprites = new Array(100)
        //     .fill(0)
        //     .map(() => new Sprite(t))
        //     .map((s) => s.setTransform(0, 0, 0.01, 0.01))
        // t.baseTexture.setSize(32, 32)

        // const s = new Sprite(t)
        // s.setTransform(0, 0, 0.04, 0.04)

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

            for (const bar of bars) {
                bar.onTick(stats)
            }
        })

        const votes = Object.entries(stats.votes)
        const contestants = stats.config.contestants
        const background = new Graphics()

        const blurFilter = new BlurFilter(50, 20);

        const background2texture = Texture.from("march06bc_2.png")
        const background2 = new Sprite(background2texture);
        background2.filters = [blurFilter]
        background2.y = -600;
        background2.height = app.view.height * 2
        background2.alpha = accessibility.noBackground ? 0 : 0.75;

        const bar = new Graphics()
        let setTextures = false;
        background.alpha = 0.8;
        background.beginFill(0x000000)
        background.drawRect(0, 0, 9999, 9999)
        background.endFill()

        const credit = new Text(`"Intermission" by @zelo101`, {
            fontSize: 24,
            fontWeight: "bold",
            fill: "#ffffff"
        });

        credit.anchor.set(1, 0)
        credit.setTransform(app.view.width - 10, app.view.height)

        const creditBackground = new Graphics()
        const padding = 10
        creditBackground.beginFill(0x000000, 0.5)
        creditBackground.drawRect(credit.x - (padding / 2) - credit.width, credit.y - (padding / 2), credit.width + padding, credit.height + padding)
        creditBackground.endFill()


        // const voteLineNumberText = new Array(votes.length)
        //     .fill(0)
        //     .map((_, i) => new Text("", {
        //         // fontFamily: "monospace",
        //         fontSize: 36,
        //         // breakWords: true,
        //         fontFamily: ["Inter", "sans-serif"],
        //         fontWeight: "700",
        //         dropShadow: true,
        //         dropShadowAlpha: 0.5,
        //         dropShadowDistance: 3,
        //         lineHeight: 35,
        //         wordWrap: true,
        //         fill: "#ffffff",
        //         // fill: contestants[votes[i][0]][1],
        //     }))
        //
        // voteLineNumberText.forEach(nt => nt.alpha = 0.5)
        //
        // const voteLineLeaderboardIndexText = new Array(votes.length)
        //     .fill(0)
        //     .map((_, i) => new Text("", {
        //         fill: 0xffffff,
        //         fontFamily: "monospace",
        //         fontSize: 34,
        //         fontWeight: "bold",
        //         // dropShadow: true,
        //         // dropShadowAlpha: 0.2,
        //         // dropShadowDistance: 6
        //         // fill: contestants[votes[i][0]][1],
        //     }))
        //
        // const voteLineLeaderboardIndexVoteLetterText = new Array(votes.length)
        //     .fill(0)
        //     .map((_, i) => new Text("", {
        //         fill: 0xffffff,
        //         fontFamily: "monospace",
        //         fontSize: 18,
        //         fontWeight: "bold",
        //         // dropShadow: true,
        //         // dropShadowAlpha: 0.2,
        //         // dropShadowDistance: 6
        //         // fill: contestants[votes[i][0]][1],
        //     }))
        //
        // const voteLineBarVoteCountText = new Array(votes.length)
        //     .fill(0)
        //     .map((_, i) => new Text("", {
        //         fill: [
        //             0xffffff,
        //             0xffffff,
        //         ],
        //         // fill: contestants[votes[i][0]][1],
        //         // fontFamily: "monospace",
        //         fontSize: 34,
        //         fontWeight: "bold",
        //         fillGradientStops: [0.1, 0.8],
        //         // dropShadow: true,
        //         // dropShadowAlpha: 0.2,
        //         // dropShadowDistance: 6
        //     }))
        //
        // const voteLineBarVoteCountTextInfo = new Array(votes.length)
        //     .fill(0)
        //     .map((_, i) => new Text("", {
        //         fill: 0xffffff,
        //         // fill: contestants[votes[i][0]][1],
        //         // fontFamily: "monospace",
        //         fontSize: 16,
        //         fontWeight: "bold",
        //         // dropShadow: true,
        //         // dropShadowAlpha: 0.2,
        //         // dropShadowDistance: 6
        //     }))
        // voteLineBarVoteCountTextInfo.forEach(t => t.alpha = 0.5)

        // const text = new Text("Hello, World!")
        // app.stage.addChild(background, ...snowSprites, bar, ...voteLineNumberText, ...voteLineLeaderboardIndexText, ...voteLineLeaderboardIndexVoteLetterText, ...voteLineBarVoteCountText, ...voteLineBarVoteCountTextInfo);
        app.stage.addChild(background2, background, bar, creditBackground, credit);

        // hardcode for now
        for (let i = 0; i < 5; i++) {
            bars.push(new Bar(i, app))
        }
        // app.stage.addChild(text);

        const texture = Texture.from("dots_alpha.png")
        texture.baseTexture.setSize(32, 32)

        let counter = 0;
        let vT = 0
        function ticker() {
            const appWidth = app.view.width;
            // const appHeight = app.view.height;
            // const appRatio = appWidth / appHeight
            if (!accessibility.reduced) counter++;
            app.resize()

            // let len = Object.entries(stats.votes).length + 5
            let range = getRange(stats.votes)
            const sorted = Object.entries(stats.votes).sort((a, b) => b[1] - a[1])


            // let widthOf1000 = sorted.at(0)![1] / (appWidth * 0.2)

            let highestBarIndex = sorted.findIndex(v => v[1] === sorted.at(0)![1])
            let highestVote = sorted.at(0)![1]
            let highestVoteWidth = bars[highestBarIndex].barGraphic.width
            let c = Math.floor(highestVote / 1000) + 1
            // find the width of 1000 votes
            // let widthOf1000 = Math.max(highestVoteWidth / (highestVote / 1000), 0.1)
            let widthOf1000 = Math.max(highestVoteWidth / c, 5)
            // console.log(c, widthOf1000)

            background.clear()
            // background.beginFill({h: counter, s: 100, v: 10})
            // background.beginFill({h: 0, s: 100, v: 0})
            // background.drawRect(0, 0, 9999, 9999)
            background.beginFill(0xffffff, 0.2)
            let j = 100;
            while (j < appWidth) {
                background.drawRect(j, 0, 2, 9999)
                j += widthOf1000;
            }
            background.endFill()

            // for (const sprite of snowSprites) {
            //     sprite.x += 5
            //     sprite.y += 5
            //     if (sprite.y > appHeight) {
            //         sprite.y = -(Math.random() * appHeight)
            //     }
            //     if (sprite.x > appWidth) {
            //         sprite.y = -(Math.random() * appHeight)
            //         sprite.x = (Math.random() * appWidth) - appWidth / 2
            //     }
            // }

            // console.log(lastTimesVotes)
            // console.log(lastTimesVotes["a"])

            if (stats.total > vT) {
                for (const bar of bars) {
                    if (!setTextures) {
                        bar.setTexture(stats)
                    }
                    bar.update(stats, lastTimesVotes)
                }
                vT = stats.total
            }
            setTextures = true


            let i = 0;
            for (const [key, votes] of sorted) {
                // const name = contestants[key][0]
                // const colour = contestants[key][1]

                // const previousContestant = sorted[i - 1]
                // const previousContestantVotes = previousContestant ? previousContestant[1] : 0
                // const nextContestant = sorted[i + 1]
                // const nextContestantVotes = nextContestant ? nextContestant[1] : 0
                // const closeCall = anyClose(votes, nextContestantVotes) || anyClose(votes, previousContestantVotes)
                // const closeCall = false
                // const displayVotes = closeCall ? Math.round(votes / 100) * 100 : votes
                // const colour = contestants[key][1]

                // const ratioToFirst = displayVotes / sorted.at(0)![1]
                // const width = (appWidth / 10) * (displayVotes / range)
                // const width = (appWidth * 0.6) * ratioToFirst
                // voteLineNumberText[i].style.wordWrapWidth = (width - 10)
                // const width = votes / 10
                // const x = 100
                // const y = 20 + (i * (appHeight / len + 20))

                // const backgroundColour = whatTeam(key) ? "#FDC900" : "#fd8fbe"
                // const backgroundColour = "#FDC900"

                // bar.beginFill(backgroundColour)
                // bar.drawRect(5, y, 3, appHeight / len)
                //
                // bar.beginFill(colour)
                // bar.drawRect(x, y, width, appHeight / len)
                // bar.beginTextureFill({
                //     color: colour,
                //     texture
                // })
                //
                // if (closeCall) {
                //     bar.beginFill(colour, 0.2)
                //     bar.drawRect(x, y, width + 10, appHeight / len)
                // }
                //
                // // TODO: Changes "votes" so that it doesnt eventually clip out of the window
                // bar.drawRect(x, y, width, appHeight / len)
                // bar.endFill()
                //
                // voteLineNumberText[i].text = name
                // voteLineNumberText[i].setTransform(x + 5, y)
                // // voteLineNumberText[i].style.fontSize = width / 4;
                // voteLineNumberText[i].width = clamp((width - 10) * 0.95, 80, 120)
                // // voteLineNumberText[i].height = (appHeight / len) * 0.7
                //
                // if (closeCall) {
                //     voteLineLeaderboardIndexText[i].text = "--"
                //     voteLineBarVoteCountText[i].text = "~" + displayVotes
                //     voteLineBarVoteCountText[i].setTransform(x + 10 + width + 10, y + 2)
                // } else {
                //     voteLineLeaderboardIndexText[i].text = ordinal(i + 1)
                //     voteLineLeaderboardIndexVoteLetterText[i].text = `[${key.toUpperCase()}]`
                //     voteLineLeaderboardIndexVoteLetterText[i].style.fill = colour
                //     voteLineBarVoteCountText[i].setTransform(x + 10 + width, y - 4)
                //     voteLineBarVoteCountText[i].text = displayVotes
                //     voteLineBarVoteCountText[i].style.fill = ["#ffffff", colour]
                //     // voteLineBarVoteCountTextInfo[i].text = `Avg gain: + ${getAverageGainPerMinute(lastTimesVotes[key])}, Since Last Refresh: + ${lastTimesVotes[key].at(-1)}`
                //     voteLineBarVoteCountTextInfo[i].text = `+${getLatestGain(lastTimesVotes[key])}, ~${getAverageGainPerMinute(lastTimesVotes[key]).toPrecision(2)} per minute`
                //     voteLineBarVoteCountTextInfo[i].setTransform(x + 10 + width, y + 32)
                // }
                // voteLineLeaderboardIndexText[i].setTransform(x - 80, y + 8)
                // voteLineLeaderboardIndexVoteLetterText[i].setTransform(x - 66, y + 40)

                // const textScale = Math.max(900, appWidth) / 900
                //
                //
                // voteLineNumberText[i].scale.set(1, textScale)
                // voteLineBarVoteCountText[i].scale.set(1, textScale)
                // voteLineLeaderboardIndexText[i].scale.set(1, textScale)
                i++;
            }
            // bar.lineStyle()
        }

        app.ticker.add(ticker)

        // pixijs rolls worst way of removing a ticker, forced to leave vip room
        // @ts-ignore
        app.tickerFunction = ticker;
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
