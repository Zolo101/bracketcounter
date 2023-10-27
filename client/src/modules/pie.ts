import type { StatModule } from "../statmodule";
import { Graphics, Sprite, Texture } from "pixi.js";

export const pieModule: StatModule = {
    name: "Pie Chart",
    render(app, stats) {
        const background = new Graphics()
        background.beginFill(0x333333)
        background.drawRect(0, 0, 9999, 9999)
        background.endFill()

        const texture = Texture.from("Pie.webp")

        const pie = new Sprite(texture)
        pie.setTransform(0, 0,0.4, 0.4);
        app.stage.addChild(background, pie);
    }
}
