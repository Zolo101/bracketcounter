import type { StatModule } from "../statmodule";
import { Assets, Graphics, Sprite, Texture } from "pixi.js";
import { latestMessage } from "../app";
import { getUseful } from "$lib/useful";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export const pieModule: StatModule = {
    name: "Pie Chart",
    async render(app, stats) {
        const background = new Graphics()
        background.beginFill(0x333333)
        background.drawRect(0, 0, 9999, 9999)

        const pie = await Assets.load<Texture>("Pie.webp")
        // pie.baseTexture.setSize(32, 32)
        // background.beginTextureFill({
        //     texture: pie,
        //     color: 0xffffff,
        // })
        background.endFill()

        const pieS = new Sprite(pie)
        pieS.setTransform(0, 0,0.1, 0.1);

        latestMessage.subscribe(m => {
            stats = m
        })

        const u = getUseful(app, stats)
        const pieChart = new Graphics()
        const pieChartRadius = 200
        const totalVotes = stats.total
        // make a pie chart using the votesPerContestant array

        // console.log(u)
        let startAngle = 0
        for (let i = 0; i < u.sortedVotes.length; i++) {
            const [contestant, votes] = u.sortedVotes[i]
            const sliceAngle = (votes / totalVotes) * Math.PI * 2
            const endAngle = startAngle + sliceAngle

            const colour = u.contestants[contestant][1]
            pieChart.beginFill(colour)
            pieChart.moveTo(0, 0)
            pieChart.arc(0, 0, pieChartRadius, startAngle, endAngle)
            pieChart.lineTo(0, 0)
            pieChart.endFill()

            startAngle = endAngle
        }

        pieChart.position.set(500, 300)
        pieChart.filters = [new DropShadowFilter({ blur: 5 })]
        app.stage.addChild(background, pieChart, pieS)

        app.ticker.add(() => {
            app.resize()
        })
    }
}
