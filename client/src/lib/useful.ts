import type { Contestants, SocketMessageData } from "../socket";
import type { Application, ICanvas } from "pixi.js";

type Useful = {
    appWidth: number,
    appHeight: number,
    contestantVotes: [string, number][],
    key: string,
    votes: number,
    sortedVotes: [string, number][],
    placement: number,
    range: number,
    len: number,
    contestants: Contestants,
    name: string,
    colour: string,
}

type UsefulIndex = {
    key: string,
    votes: number,
    placement: number,
    name: string,
    colour: string,
}

const getRange = (obj: Record<string, number>) => Math.max(...Object.values(obj)) - Math.min(...Object.values(obj))
export const getUseful = (app: Application<ICanvas>, stats: SocketMessageData, index: number = 0): Useful => {
    const appWidth = app.view.width;
    const appHeight = app.view.height;

    const contestantVotes = Object.entries(stats.votes)
    const [key, votes]: [string, number] = contestantVotes[index]
    const sortedVotes = contestantVotes
        .sort((a, b) => b[1] - a[1])
    const placement = sortedVotes
        .findIndex(([k, v]) => k === key)
    const range = getRange(stats.votes)
    const len = Object.entries(stats.votes).length + 5
    const contestants = stats.config.contestants
    const [name, colour] = contestants[key]

    return {
        appWidth,
        appHeight,
        contestantVotes,
        key,
        votes,
        sortedVotes,
        placement,
        range,
        len,
        contestants,
        name,
        colour,
    }
}

export const getUsefulIndex = (app: Application<ICanvas>, stats: SocketMessageData, index: number): UsefulIndex => {
    const contestantVotes = Object.entries(stats.votes)
    const [key, votes]: [string, number] = contestantVotes[index]
    const sortedVotes = contestantVotes
        .sort((a, b) => b[1] - a[1])
    const placement = sortedVotes
        .findIndex(([k, v]) => k === key)
    const contestants = stats.config.contestants
    const [name, colour] = contestants[key]

    return {
        key,
        votes,
        placement,
        name,
        colour,
    }
}

