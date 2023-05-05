<template>
    <button class="setting-button" @click="showSetup = true">기본 설정</button>
    <Teleport to="body">
        <Setup :show="showSetup" @close="GenerateThemes">
        </Setup>
    </Teleport>
    <div class="board">
        <div v-for="(block, index) in blocks" class="box" :class="{ goldenkey: goldenkeys.includes(index), go: index == 0, free: index == 13 }" :style="block.style">
            <div v-if="index !== 0 && index !== 13" class="number">{{ index }}</div>
            <div v-if="index == 0" class="button" @click="showModal = true">
                <button class="hoveredbutton">출발</button>
                <Teleport to="body">
                    <GoMenu :show="showModal" @close="showModal = false" @shuffle="shuffle" @addkey="addkey" @restore="restore">
                    </GoMenu>
                </Teleport>
            </div>
            <div v-else-if="index == 7"></div>
            <div v-else-if="index == 13" class="button">
                <button class="hoveredbutton">뱅하싶</button>
            </div>
            <div v-else-if="index == 20"></div>
            <div v-else-if="goldenkeys.includes(index)" class="button">
                <button class="hoveredbutton">황금열쇠</button>
            </div>
            <div v-else class="button" :style="{ backgroundColor: 'hsl(' + colors.get(board[index]) + ', 50%, 70%' }">
                <button class="hoveredbutton">{{ index }}</button>
                <div>{{ board[index] }}</div>
            </div>
        </div>
        <div class="col-span-6 row-span-5 box">
            <Timer />
        </div>
    </div>
</template>

<script lang="ts">
import GoMenu from './components/GoMenu.vue'
import Timer from './components/Timer.vue'
import Setup from './components/Setup.vue'
// import Wheel from './components/Wheel.vue'

export default {
    data() {
        return {
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
            showSetup: false,
            showModal: false,
            isBoardBuilt: false,
            themes: new Array<string>,
            colors: new Map<string, number>,
            board: new Array<string>,
            backupBoard: new Array<string>,
        }
    },
    components: {
        GoMenu, Timer, Setup// Wheel
    },
    methods: {
        GenerateThemes(themes: Array<{head: string, tail: string}>) {
            this.showSetup = false

            if (!this.isBoardBuilt) {
                while (this.themes.length < 14) {
                    const n = Math.floor(Math.random() * themes.length)
                    const theme = themes[n].head + "\n" + themes[n].tail
                    const color = Math.floor(Math.random() * 361)

                    if (!this.themes.includes(theme)) {
                        this.themes.push(theme)
                        this.colors.set(theme, color)
                    }
                }

                this.buildBoard()
                this.backupBoard = this.board
                this.isBoardBuilt = true
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
                } else if (i === 7 || i === 20) {
                    this.board.push('무인도')
                } else if (i === 13) {
                    this.board.push('뱅하싶')
                } else if (this.goldenkeys.includes(i)) {
                    this.board.push('황금열쇠')
                } else {
                    this.board.push(this.themes[j])
                    j++
                }
            }
        }
    },
    created() {
        this.showSetup = true
    }
}
</script>