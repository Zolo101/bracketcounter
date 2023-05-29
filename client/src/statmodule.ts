import type { Writable } from "svelte/store";
import type { Application } from "pixi.js";
import { Graphics, Text } from "pixi.js";
import type { SocketMessageData } from "./socket";

export type StatModule = {
    name: string
    render(app: Application, stats: SocketMessageData): void
}

export enum DesktopDirection {
    Horizontal,
    Vertical
}

export type DesktopTreeChild = {
    parent: false
    depth: number
    module?: StatModule
}

export type DesktopTreeParent = {
    parent: true
    depth: number
    direction: DesktopDirection
    children: [DesktopTree?, DesktopTree?]
}

export type DesktopTree = Writable<DesktopTreeParent | DesktopTreeChild>

export const barModule: StatModule = {
    name: "Bar",
    render(app, stats) {
        const background = new Graphics();
        background.beginFill(0x000000)
        background.drawRect(0, 0, 9999, 9999)
        background.endFill()

        const text = new Text("Hello, World!")
        app.stage.addChild(background);
        app.stage.addChild(text);
    }
}
