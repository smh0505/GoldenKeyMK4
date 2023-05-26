<template>
    <v-stage v-show="show" :config="{ width: 712, height: 712 }">
        <v-layer ref="layer">
            <v-wedge v-for="(item, index) in donation.items" :config="sectorConfig(index, item)"></v-wedge>
            <v-text v-for="(item, index) in donation.items" :config="textConfig(index, item)"></v-text>
            <v-line :config="arrow"></v-line>
        </v-layer>
    </v-stage>
    <div v-show="show && rotateState === 3" class="resultScreen">
        <p class="text-2xl text-white">다음 황금열쇠는</p>
        <p class="text-5xl text-yellow-300">{{ result }}</p>
    </div>
    <button v-show="show && rotateState !== 2 && donation.items.length > 0" class="rotateButton" @click="click()">
        {{ rotateTexts[rotateState] }}
    </button>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useDonationStore } from '../stores/DonationStore'
import { useInventoryStore } from '../stores/InventoryStore'
import { useBoardStore } from '../stores/BoardStore'

const rotateStates = {
    idle: 0,
    spinning: 1,
    stopping: 2,
    result: 3
}

export default {
    props: {
        show: Boolean,
        payload: String
    },
    data() {
        return {
            socket: ref<WebSocket | null>(null),
            donation: useDonationStore(),
            inventory: useInventoryStore(),
            board: useBoardStore(),
            rotateAngle: 0,
            rotateSpeed: 50,
            rotateTexts: ['돌리기', '멈추기', '', '다음'],
            rotateState: 0,
            arrow: {
                points: [586, 356, 606, 366, 606, 346],
                fill: 'black',
                closed: true
            }
        }
    },
    computed: {
        result() {
            let output = ''
            let target = this.donation.sum(this.donation.items.length) - Math.floor(this.rotateAngle / this.donation.unitAngle())
            for (let i = 0; i < this.donation.items.length; i++) {
                if (target > this.donation.sum(i)) {
                    output = this.donation.items[i].option
                }
            }
            return output
        }
    },
    methods: {
        // Properties
        sectorConfig(index: number, item: { option: string, count: number, color: number }) {
            return {
                x: 356,
                y: 356,
                radius: 240,
                angle: item.count * this.donation.unitAngle(),
                fill: 'hsl(' + item.color + ', 70%, 60%)',
                stroke: 'black',
                rotation: this.rotateAngle + this.donation.sum(index) * this.donation.unitAngle()
            }
        },
        textConfig(index: number, item: { option: string, count: number, color: number }) {
            return {
                text: item.option,
                fontSize: 20,
                fontStyle: 'bold',
                x: 356,
                y: 356,
                offsetX: -60,
                offsetY: 8,
                rotation: this.rotateAngle + this.donation.sum(index) * this.donation.unitAngle() + item.count * this.donation.unitAngle() / 2
            }
        },
        // Main Functions
        rotate() {
            this.rotateAngle += this.rotateSpeed
            if (this.rotateAngle >= 360) {
                this.rotateAngle -= 360
            }
        },
        spin() {
            switch (this.rotateState) {
                case rotateStates.idle:
                    this.rotateSpeed = 50
                    break
                case rotateStates.spinning:
                    this.rotate()
                    break
                case rotateStates.stopping:
                    this.rotate()
                    this.rotateSpeed -= 1 / Math.PI
                    if (this.rotateSpeed <= 0) {
                        this.rotateState += 1
                    }
            }
            window.requestAnimationFrame(this.spin)
        },
        connect() {
            this.socket = new WebSocket('wss://toon.at:8071/' + this.payload)
            this.socket.onopen = () => {
                this.board.update('투네이션 연결됨!', 4)
            }
            this.socket.onmessage = msg => {
                if (msg.data.includes('roulette')) {
                    let roulette = JSON.parse(msg.data).content.message as string 
                    let rValue = roulette.split(' - ')[1]
                    if (rValue !== '꽝') {
                        this.donation.addItem(rValue)
                    }
                }
            }
            this.socket.onclose = () => {
                this.board.update('투네이션 연결중...', 5)
                setTimeout(() => this.connect(), 1000)
            }
        },
        click() {
            this.rotateState = (this.rotateState + 1) % 4
            if (this.rotateState === rotateStates.idle) {
                this.inventory.addItem(this.result)
                this.donation.subItem(this.result)
            }
        }
    },
    mounted() {
        this.spin()
        this.connect()
        this.donation.addItem('옵션 1')
        this.donation.addItem('옵션 2')
        this.donation.addItem('옵션 3')
        this.donation.addItem('옵션 4')
        this.donation.addItem('옵션 5')
        this.donation.addItem('옵션 6')
    }
}
</script>

<style>
.rotateButton{
    @apply absolute h-12 w-24 bg-yellow-300 hover:bg-yellow-400 left-[336px] bottom-[196px]
        rounded-xl
}

.resultScreen{
    @apply absolute left-[364px] top-[224px] h-[600px] w-[630px] bg-black/50 p-4
}
</style>