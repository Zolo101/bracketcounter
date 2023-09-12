import type { Writable } from "svelte/store";
import type { Application } from "pixi.js";
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

export function ordinal(d: number): string {
    return d + (31 == d || 21 == d || 1 == d ? "st" : 22 == d || 2 == d ? "nd" : 23 == d || 3 == d ? "rd" : "th")
}
