import { Graphics, Text } from "pixi.js";
import type { StatModule } from "../statmodule";

export const graphModule: StatModule = {
    name: "Graph",
    render(app, stats) {
        const contestants = stats.config.contestants
        const votes = Object.entries(stats.votes)
        const background = new Graphics();
        const bar = new Graphics();
        const timeframe = new Graphics();
        const leaderboard = new Graphics();
        app.stage.addChild(background, timeframe, bar);

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
        app.stage.addChild(leaderboard)

        leaderboard.beginFill(0x000000, 0.4)
        leaderboard.drawRect(0, 0, 135, 999)
        leaderboard.endFill()
        const leaderboardTitle = new Text("Leaderboard", {
            fontFamily: "monospace",
            fontSize: 17,
            fill: 0xffffff,
        })
        leaderboardTitle.setTransform(17, 14)

        i = 0;
        for (const [key, amount] of votes) {
            const name = contestants[key][0];
            const colour = contestants[key][1];

            const text = new Text(`• ${name}`, {
                fontFamily: "monospace",
                fontSize: 17,
                fill: colour
            })
            text.setTransform(15, 35 + (i * 20))

            app.stage.addChild(text)
            i++;
        }

        const text = new Text("5s", {fill: 0xffffff})
        text.position.set(app.view.width - 40, 0)
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
                timeframe.drawRect(width - (((counter * 4) + i) % width), 0, 1, 9999)
                i += (app.view.width / 3);
            }
            timeframe.endFill()

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

        app.stage.addChild(leaderboardTitle, text);
    }
}
