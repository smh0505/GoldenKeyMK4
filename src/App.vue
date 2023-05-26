<template>
    <button class="setting-button" @click="showSetup = true">기본 설정</button>
    <Teleport to="body">
        <Setup :show="showSetup" @close="beginGame">
        </Setup>
    </Teleport>
    <div class="board">
        <div class="col-span-6 row-span-5 box">
            <Wheel :show="state === states.goldenkey" :payload="payload" />
            <Dice :show="state === states.dice" />
            <Raffle :show="state === states.poll" :index="boardIndex" @reset="boardIndex = 0"/>
            <Poll :begin="isBoardBuilt"/>
            <Inventory />
            <Timer />
        </div>
        <div v-for="(block, index) in blocks" class="box" :class="blockType(index)" :style="block.style">
            <div v-if="index !== 0 && index !== 13" class="number">{{ index }}</div>
            <div v-if="index == 0" class="button" @click="showModal = true">
                <button class="hoveredbutton">출발</button>
                <Teleport to="body">
                    <GoMenu :show="showModal" @close="showModal = false" @shuffle="shuffle()" @addkey="addKey()" @restore="restore()">
                    </GoMenu>
                </Teleport>
            </div>
            <div v-else-if="index == 7 || index == 20" class="button" @click="state = states.poll; boardIndex = index">
                <button class="hoveredbutton">{{ board.selectAll(index).length }}</button>
            </div>
            <div v-else-if="index == 13" class="button" @click="state = states.dice">
                <button class="hoveredbutton">뱅하싶</button>
            </div>
            <div v-else-if="isGoldenKey(index)" class="button" @click="state = states.goldenkey">
                <button class="hoveredbutton">황금열쇠</button>
            </div>
            <div v-else class="button" :style="{ backgroundColor: 'hsl(' + getColor(index) + ', 50%, 70%' }" @click="state = states.poll; boardIndex = index">
                <button class="hoveredbutton">{{ board.selectAll(index).length }}</button>
                <div>{{ board.board[index] }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import GoMenu from './components/GoMenu.vue'
import Timer from './components/Timer.vue'
import Setup from './components/Setup.vue'
import Wheel from './components/Wheel.vue'
import Inventory from './components/Inventory.vue'
import Poll from './components/Poll.vue'
import Raffle from './components/Raffle.vue'
import Dice from './components/Dice.vue'
import { useBoardStore } from './stores/BoardStore'

// Requirements for Board
const islands = ['디맥섬', '투온섬', '식스타섬', '뱅섬', '프세카섬']
let picked = [] as string[]

// Board
let backupBoard = [] as string[]

export default {
    data() {
        return {
            payload: "",
            blocks: [
                { style: 'grid-column: 8; grid-row: 7;' },
                { style: 'grid-column: 7; grid-row: 7;' },
                { style: 'grid-column: 6; grid-row: 7;' },
                { style: 'grid-column: 5; grid-row: 7;' },
                { style: 'grid-column: 4; grid-row: 7;' },
                { style: 'grid-column: 3; grid-row: 7;' },
                { style: 'grid-column: 2; grid-row: 7;' },
                { style: 'grid-column: 1; grid-row: 7;' },
                { style: 'grid-column: 1; grid-row: 6;' },
                { style: 'grid-column: 1; grid-row: 5;' },
                { style: 'grid-column: 1; grid-row: 4;' },
                { style: 'grid-column: 1; grid-row: 3;' },
                { style: 'grid-column: 1; grid-row: 2;' },
                { style: 'grid-column: 1; grid-row: 1;' },
                { style: 'grid-column: 2; grid-row: 1;' },
                { style: 'grid-column: 3; grid-row: 1;' },
                { style: 'grid-column: 4; grid-row: 1;' },
                { style: 'grid-column: 5; grid-row: 1;' },
                { style: 'grid-column: 6; grid-row: 1;' },
                { style: 'grid-column: 7; grid-row: 1;' },
                { style: 'grid-column: 8; grid-row: 1;' },
                { style: 'grid-column: 8; grid-row: 2;' },
                { style: 'grid-column: 8; grid-row: 3;' },
                { style: 'grid-column: 8; grid-row: 4;' },
                { style: 'grid-column: 8; grid-row: 5;' },
                { style: 'grid-column: 8; grid-row: 6;' }
            ],
            showSetup: true,
            showModal: false,
            isBoardBuilt: false,
            board: useBoardStore(),
            boardIndex: 0,
            states: {
                dice: 0,
                goldenkey: 1,
                poll: 2
            },
            state: 0
        }
    },
    components: {
        GoMenu, Timer, Setup, Wheel, Inventory, Poll, Raffle, Dice
    },
    methods: {
        beginGame(themes: Array<{head: string, tail: string}>, payload: string) {
            this.showSetup = false

            if (!this.isBoardBuilt) {
                // Generate themes
                while (picked.length < 14) {
                    const n = Math.floor(Math.random() * themes.length)
                    const theme = themes[n].head + ":\n" + themes[n].tail
                    const color = Math.floor(Math.random() * 360)

                    if (!picked.includes(theme)) {
                        picked.push(theme)
                        this.board.colors.push({ theme: theme, color: color })
                    }
                }

                this.buildBoard()
                backupBoard = this.board.board
                this.isBoardBuilt = true
                this.payload = payload
            }
        },
        shuffle() {
            // Initialize
            const count = this.board.goldenKeys.length
            let newKeys = [] as number[]

            // Generate new Golden Keys
            while (newKeys.length < count) {
                let i = Math.floor(Math.random() * 26)
                if (i !== 0 && i !== 7 && i !== 13 && i !== 20 && !newKeys.includes(i)) {
                    newKeys.push(i)
                }
            }
            this.board.goldenKeys = newKeys.sort((a, b) => a - b)

            // Shuffle themes
            for (let i = picked.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * i)
                let x = picked[i]
                picked[i] = picked[j]
                picked[j] = x
            }

            this.buildBoard()
        },
        addKey() {
            this.board.goldenKeys.push(-1)
            this.shuffle()
        },
        restore() {
            this.board.board = backupBoard
            this.board.goldenKeys = [2, 5, 9, 11, 15, 18, 22, 24]
        },
        buildBoard() {
            this.board.board = Array(26).fill('')                                           // Initialize
            this.board.board[0] = '출발'                                                    // Start
            this.board.board[13] = '뱅하싶'                                                 // Free
            this.board.goldenKeys.forEach((value) => this.board.board[value] = '황금열쇠')  // Golden Key

            // Island 1
            const island1 = Math.floor(Math.random() * 5)
            this.board.board[7] = islands[island1]

            // Island 2
            let island2 = Math.floor(Math.random() * 5)
            while (island2 === island1) {
                island2 = Math.floor(Math.random() * 5)
            }
            this.board.board[20] = islands[island2]

            // Any other blocks
            for (let i = 0, j = 0; i < this.board.board.length && j < picked.length; i++) {
                if (this.board.board[i] === '') {
                    this.board.board[i] = picked[j]
                    j++
                }
            }
        },
        isGoldenKey(index: number) {
            return this.board.goldenKeys.includes(index)
        },
        getColor(index: number) {
            const theme = this.board.board[index]
            const target = this.board.colors.find(x => x.theme === theme)
            return target ? target.color : 0
        },
        blockType(index: number) {
            return {
                goldenkey: this.isGoldenKey(index),
                go: index === 0,
                free: index === 13,
                island1: this.board.board[index] === islands[0],
                island2: this.board.board[index] === islands[1],
                island3: this.board.board[index] === islands[2],
                island4: this.board.board[index] === islands[3],
                island5: this.board.board[index] === islands[4],
            }
        }
    }
}
</script>