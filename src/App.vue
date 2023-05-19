<template>
    <button class="setting-button" @click="showSetup = true">기본 설정</button>
    <Teleport to="body">
        <Setup :show="showSetup" @close="GenerateThemes">
        </Setup>
    </Teleport>
    <div class="board">
        <div class="col-span-6 row-span-5 box">
            <Timer />
            <Wheel :show="state === states.goldenkey" :payload="payload"/>
        </div>
        <div v-for="(block, index) in blocks" class="box" :class="blockType(index)" :style="block.style">
            <div v-if="index !== 0 && index !== 13" class="number">{{ index }}</div>
            <div v-if="index == 0" class="button" @click="showModal = true">
                <button class="hoveredbutton">출발</button>
                <Teleport to="body">
                    <GoMenu :show="showModal" @close="showModal = false" @shuffle="shuffle" @addkey="addkey" @restore="restore">
                    </GoMenu>
                </Teleport>
            </div>
            <div v-else-if="index == 7" class="button">
                <button class="hoveredbutton">{{ islands[island1] }}</button>
            </div>
            <div v-else-if="index == 13" class="button" @click="state = states.dice">
                <button class="hoveredbutton">뱅하싶</button>
            </div>
            <div v-else-if="index == 20" class="button">
                <button class="hoveredbutton">{{ islands[island2] }}</button>
            </div>
            <div v-else-if="goldenkeys.includes(index)" class="button" @click="state = states.goldenkey">
                <button class="hoveredbutton">황금열쇠</button>
            </div>
            <div v-else class="button" :style="{ backgroundColor: 'hsl(' + colors.get(board[index]) + ', 50%, 70%' }">
                <button class="hoveredbutton">{{ index }}</button>
                <div>{{ board[index] }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import GoMenu from './components/GoMenu.vue'
import Timer from './components/Timer.vue'
import Setup from './components/Setup.vue'
import Wheel from './components/Wheel.vue'

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
            goldenkeys: [2, 5, 9, 11, 15, 18, 22, 24],
            showSetup: true,
            showModal: false,
            isBoardBuilt: false,
            themes: new Array<string>,
            colors: new Map<string, number>,
            board: new Array<string>,
            backupBoard: new Array<string>,
            island1: 0,
            island2: 1,
            islands: ['디맥섬', '투온섬', '식스타섬', '뱅섬', '프세카섬'],
            states: {
                dice: 0,
                goldenkey: 1,
                poll: 2
            },
            state: 0
        }
    },
    components: {
        GoMenu, Timer, Setup, Wheel
    },
    methods: {
        GenerateThemes(themes: Array<{head: string, tail: string}>, payload: string) {
            this.showSetup = false

            if (!this.isBoardBuilt) {
                while (this.themes.length < 14) {
                    const n = Math.floor(Math.random() * themes.length)
                    const theme = themes[n].head + "\n" + themes[n].tail
                    const color = Math.floor(Math.random() * 360)

                    if (!this.themes.includes(theme)) {
                        this.themes.push(theme)
                        this.colors.set(theme, color)
                    }
                }

                this.buildBoard()
                this.backupBoard = this.board
                this.isBoardBuilt = true

                this.payload = payload
            }
        },
        shuffle() {
            // New golden keys
            const count = this.goldenkeys.length
            let newkeys: Array<number> = []
            while (newkeys.length < count) {
                const i = Math.floor(Math.random() * 26)
                if (i !== 0 && i !== 7 && i !== 13 && i !== 20 && !newkeys.includes(i)) {
                    newkeys.push(i)
                }
            }
            this.goldenkeys = newkeys

            // Shuffle themes
            for (let i = this.themes.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * (i + 1))
                const temp = this.themes[i]
                this.themes[i] = this.themes[j]
                this.themes[j] = temp
            }

            this.buildBoard()
        },
        addkey() {
            this.goldenkeys.push(-1)
            this.shuffle()
        },
        restore() {
            this.goldenkeys = [2, 5, 9, 11, 15, 18, 22, 24]
            this.board = this.backupBoard
        },
        buildBoard() {
            this.board = []

            let j = 0
            for (let i = 0; i < 26; i++) {
                if (i === 0) {
                    this.board.push('출발')
                } else if (i === 7) {
                    this.island1 = Math.floor(Math.random() * 5)
                    this.board.push(this.islands[this.island1])
                } else if (i === 13) {
                    this.board.push('뱅하싶')
                } else if (i === 20) { 
                    this.island2 = Math.floor(Math.random() * 5)
                    while (this.island2 === this.island1) {
                        this.island2 = Math.floor(Math.random() * 5)
                    }
                    this.board.push(this.islands[this.island2])
                } else if (this.goldenkeys.includes(i)) {
                    this.board.push('황금열쇠')
                } else {
                    this.board.push(this.themes[j])
                    j++
                }
            }

            console.log(this.board)
        },
        blockType(index: number) {
            return {
                goldenkey: this.goldenkeys.includes(index),
                go: index === 0,
                free: index === 13,
                island1: (index === 7 && this.island1 === 0) || (index === 20 && this.island2 === 0),
                island2: (index === 7 && this.island1 === 1) || (index === 20 && this.island2 === 1),
                island3: (index === 7 && this.island1 === 2) || (index === 20 && this.island2 === 2),
                island4: (index === 7 && this.island1 === 3) || (index === 20 && this.island2 === 3),
                island5: (index === 7 && this.island1 === 4) || (index === 20 && this.island2 === 4),
            }
        }
    }
}
</script>