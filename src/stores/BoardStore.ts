import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { parse } from '../functions/IRC'

export const useBoardStore = defineStore('BoardStore', {
    state: () => {
        return {
            // Board
            board: [] as string[],
            goldenKeys: [2, 5, 9, 11, 15, 18, 22, 24],
            colors: [] as { theme: string, color: number }[],

            // Raffle Pools
            pool: [] as vote[],
            islandPool: [] as vote[],

            // Input State
            log: [] as { name: string, state: number }[]
        }
    },
    actions: {
        parse(msg: string) {
            const parsedMsg = parse(msg)
            const match = parsedMsg.text.match(/!픽 (?<index>\d+) (?<song>.+)/)
            if (match) {
                const index = Number(match.groups?.index)
                const theme = this.board[index]
                const song = match.groups?.song
                if (theme && song) {
                    const request = {
                        name: parsedMsg.name,
                        theme: theme,
                        song: song,
                        timestamp: DateTime.now()
                    }
                    this.insert(index, request)
                }
            } else {
                this.update(parsedMsg.name, 1) // Declined
            }
        },
        insert(index: number, request: vote) {
            if (index === 7 || index === 20) { // islandPool
                const idx = this.islandPool.findIndex(x => x.name === request.name)
                if (idx > -1) {
                    if (request.timestamp.diff(this.islandPool[idx].timestamp).as('seconds') > 30) {
                        this.islandPool.push(request)
                        this.islandPool.splice(idx, 1)
                        this.update(request.name, 0) // Accepted
                    } else {
                        this.update(request.name, 1) // Declined
                    }
                } else {
                    this.islandPool.push(request)
                    this.update(request.name, 0) // Accepted
                }
            } else if (index !== 0 && index !== 13 && !this.goldenKeys.includes(index)) { // pool
                const group = this.pool.map((x, i) => x.name === request.name ? i : -1).filter(i => i !== -1)
                if (group.length > 0) {
                    if (request.timestamp.diff(this.pool[group.slice(-1)[0]].timestamp).as('seconds') > 30) {
                        this.pool.push(request)
                        if (group.length === 3) {
                            this.pool.splice(group[0], 1)
                        }
                        this.update(request.name, 0) // Accepted
                    } else {
                        this.update(request.name, 1) // Declined
                    }
                } else {
                    this.pool.push(request)
                    this.update(request.name, 0) // Accepted
                }
            } else {
                this.update(request.name, 1) // Declined
            }
        },
        update(name: string, state: number) {
            this.log.push({ name: name, state: state })
            if (this.log.length > 10) {
                this.log.splice(0, 1)
            }
        },
        selectAll(index: number) {
            const theme = this.board[index]
            let output = [] as vote[]
            if (index === 7 || index === 20) {
                output = this.islandPool.filter(x => x.theme === theme)
            } else {
                output = this.pool.filter(x => x.theme === theme)
            }
            return output
        }
    }
})

export interface vote{
    name: string,
    theme: string,
    song: string,
    timestamp: DateTime
}