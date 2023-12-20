import { type Application, Graphics, type ICanvas, Text } from "pixi.js";
import type { StatModule } from "../statmodule";
import type { SocketMessageData } from "../socket";
import { getUseful } from "$lib/useful";
import { latestMessage } from "../app";
import anime from "animejs";
import { clamp } from "$lib/misc";

class Line {
    app: Application<ICanvas>
    line: Graphics
    lineText: Text
    listItem: Text
    strikethroughText: Graphics
    index: number
    countHistory: number[]
    votesTween: number
    speed: number
    first: boolean // no tween at startup
    active: boolean // no line

    constructor(index: number, app: Application<ICanvas>) {
        this.index = index
        this.app = app
        this.countHistory = []
        this.line = new Graphics()
        this.strikethroughText = new Graphics()
        this.votesTween = 0
        this.speed = 1
        this.first = true
        this.active = true

        this.lineText = new Text("", {
            fontFamily: "monospace",
            fontSize: 17,
            fill: "#222222",
            lineHeight: 0,
        })

        this.listItem = new Text("", {
            fontFamily: "monospace",
            fontSize: 17,
            fill: "#222222",
            lineHeight: 0,
        })
        // this.listItem.depth = 10
        this.listItem.setTransform(15, 75 + (index * 20))
        this.listItem.eventMode = "dynamic"
        this.listItem.on("pointerdown", () => this.setActivity(!this.active))

        this.strikethroughText.beginFill("#ffffff", 0.5)
        this.strikethroughText.drawRect(15, 84 + (index * 20), 110, 1)
        this.strikethroughText.endFill()
        this.strikethroughText.visible = false

        app.stage.addChild(this.line, this.lineText)
    }

    setActivity(active: boolean) {
        this.active = active;
        if (!this.active) {
            this.line.clear()
        }

        this.strikethroughText.visible = !this.active
        this.listItem.alpha = this.active ? 1 : 0.5
        this.lineText.visible = this.active
    }

    onTick(stats: SocketMessageData) {
        if (stats === undefined) return
        const u = getUseful(this.app, stats, this.index)

        this.listItem.text = `• ${u.name}`
        this.listItem.style.fill = u.colour

        const votes = Object.entries(stats.votes)[this.index][1]

        anime({
            targets: this,
            votesTween: votes,
            easing: "easeInOutSine",
            duration: this.first ? 0 : 29000,
        })
        this.first = false
    }

    update(stats: SocketMessageData, lines: Line[]) {
        if (!this.active) return

        // count history housekeeping
        this.countHistory.unshift(this.votesTween)
        if (this.countHistory.length > 2000) {
            this.countHistory.pop()
        }

        // then do stuff

        const u = getUseful(this.app, stats, this.index)

        // TODO: Simplify
        // This removes inactive lines from the graph
        // and replaces final votes with the tweened ones for smoothness
        // so the highest and lowest values get recalculated
        const filteredSortedVotes: [string, number][] = u.sortedVotes
            .filter(([name, _]) => {
                const votingCharacterIndex = Object.entries(u.contestants)
                    .findIndex(([vcName, _]) => vcName === name)
                return lines[votingCharacterIndex].active
            })
            .map(([name, _]) => {
                const votingCharacterIndex = Object.entries(u.contestants)
                    .findIndex(([vcName, _]) => vcName === name)
                return [name, lines[votingCharacterIndex].votesTween]
            })
        const highest = filteredSortedVotes.at(0)![1]
        const lowest = filteredSortedVotes.at(-1)![1]
        this.line.clear()

        let x = u.appWidth / 1.5
        let y = 0;
        this.line.beginFill(u.colour)
        for (const number of this.countHistory) {
            const diff = number - lowest
            const range = highest - lowest
            y = (u.appHeight * 2) - ((diff / (range / 2)) * u.appHeight / 2) - u.appHeight / 1.5
            x -= this.speed
            // this.line.lineStyle(1, u.colour)
            // this.line.moveTo(100, y)
            this.line.drawRect(x, (y / 2), this.speed,2)
        }
        this.line.endFill()

        const latestDiff = this.countHistory.at(0)! - lowest
        const latestRange = highest - lowest
        let latestY = (u.appHeight * 2) - ((latestDiff / latestRange) * u.appHeight) - u.appHeight / 1.5
        this.lineText.style.fill = u.colour
        this.lineText.position.set(u.appWidth / 1.5, (latestY / 2) - 10)
        // this.lineText.position.set(u.appWidth / 1.5, (y / 2) - 10)
        this.lineText.text = Math.round(this.votesTween)
    }
}

export const graphModule: StatModule = {
    name: "Realtime Graph",
    render(app, stats) {
        Text.defaultResolution = 2;
        Text.defaultAutoResolution = false;

        const contestants = stats.config.contestants
        const votes = Object.entries(stats.votes)
        const background = new Graphics();
        const bar = new Graphics();
        const timeframe = new Graphics();
        const leaderboard = new Graphics();
        const lines: Line[] = []
        let speed = 1;
        app.stage.addChild(background, timeframe, bar);

        latestMessage.subscribe(m => {
            stats = m

            for (const line of lines) {
                line.onTick(stats)
            }
        })

        background.beginFill(0x000000)
        background.drawRect(0, 0, 9999, 9999)
        background.beginFill(0x333333)
        let i = 0;
        while (i < app.view.height) {
            background.drawRect(0, i, 9999, 1)
            i += 20;
        }
        background.endFill()

        const voteLineGraphics = new Array(votes.length)
            .fill(0)
            .map(_ => new Graphics())

        const voteLineNumberText = new Array(votes.length)
            .fill(0)
            .map((_, i) => new Text("", {
                fontFamily: "monospace",
                fontSize: 16,
                fill: contestants[votes[i][0]][1],
            }))

        // voteGraphics.forEach(g => g.currentPath.closeStroke = false);

        app.stage.addChild(...voteLineGraphics, ...voteLineNumberText)
        for (let j = 0; j < 5; j++) {
            const line = new Line(j, app)
            lines.push(line)
            line.onTick(stats)
        }
        lines[2].setActivity(false)
        lines[0].setActivity(false)

        app.stage.addChild(leaderboard)
        // pixi.js rolls worst depth system, forced to leave vip room
        for (const line of lines) {
            app.stage.addChild(line.listItem, line.strikethroughText)
        }

        leaderboard.beginFill(0x000000, 0.4)
        leaderboard.drawRect(0, 0, 135, 999)
        leaderboard.endFill()
        const leaderboardTitle = new Text("Leaderboard\n(Click to \nremove/add)", {
            fontFamily: "monospace",
            fontSize: 17,
            fill: 0xffffff,
        })
        const leaderboardTitle2 = new Text("Q/E for\n speed\n\nVotes update\nevery 30\nseconds", {
            fontFamily: "monospace",
            fontSize: 17,
            fill: 0xffffff,
        })
        leaderboardTitle.setTransform(17, 14)
        leaderboardTitle2.setTransform(12, 184)

        const changeSpeed = (by: number) => {
            speed = clamp(speed + by, 1, 10)
            for (const line of lines) line.speed = speed
        }

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            switch (e.key) {
                case "q":
                    changeSpeed(-1)
                    break
                case "e":
                    changeSpeed(1)
                    break
            }
        })

        i = 0;
        // for (const [key, amount] of votes) {
        //     const name = contestants[key][0];
        //     const colour = contestants[key][1];
        //
        //     const text = new Text(`• ${name}`, {
        //         fontFamily: "monospace",
        //         fontSize: 17,
        //         fill: colour
        //     })
        //     text.setTransform(15, 75 + (i * 20))
        //
        //     app.stage.addChild(text)
        //     i++;
        // }

        // const text = new Text("5s", {fill: 0xffffff})
        // text.position.set(app.view.width - 60, 0)
        // app.stage.addChild(text);

        let counter = 0;
        app.ticker.add(() => {
            const width = app.view.width;
            const height = app.view.height;
            counter++;
            app.resize()

            timeframe.clear()
            timeframe.beginFill(0x444444)
            let i = 0;
            while (i < app.view.width) {
                timeframe.drawRect(width - (((counter * speed) + i) % width), 0, 1, 9999)
                i += (app.view.width / 3);
            }
            timeframe.endFill()

            for (const line of lines) {
                line.update(stats, lines)
            }

            i = 0;
            for (const voteGraphic of voteLineGraphics) {
                const [objname, amount] = votes[i]
                const [name, colour] = contestants[objname]
                // console.log(name, colour, amount)
                // console.log(voteGraphics)
                // voteGraphic.setTransform(0, amount)
                const y = height - (amount / 2)
                voteGraphic.beginFill()
                voteGraphic.moveTo(0, y)
                voteGraphic.lineStyle({width: 10, color: colour})
                voteGraphic.lineTo(width - 40, y)
                voteLineNumberText[i].text = amount;
                voteLineNumberText[i].setTransform(width - 35, y - 7);
                // voteGraphic.lineTo(200, 200)
                voteGraphic.endFill()
                // voteGraphic.transform.position.x -= 1;
                i++;
            }
        })

        app.stage.addChild(leaderboardTitle, leaderboardTitle2);
    }
}
