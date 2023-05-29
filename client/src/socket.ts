export type Votes = Record<string, number>
export type Contestants = Record<string, [string, string]>
export type Config = {
    id: string
    savestateFile: string
    accessCode: string
    suspended: boolean
    authCache: string
    liveMode: boolean
    port: number
    maxMultiVoters: number
    deadlineHours: number
    refreshTime: number
    longRefreshTime: number
    re: unknown
    contestants: Contestants
    blacklist: unknown[]
}

export type Status = {
    deadline: number
    id: string
    comments: number
    totalComments: string
    runningPostTask: boolean
    validVotes: number
    multiVoters: number
    updateDate: number
    clients: number
    done: boolean
}

export type SocketMessageData = {
    status: Status
    config: Config
    votes: Votes
    total: number
}
