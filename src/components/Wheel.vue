<template>
    <v-stage :config="{ width: 712, height: 712 }">
        <v-layer ref="layer">
            <v-wedge v-if="show" v-for="(item, index) in items" :config="sectorConfig(index, item)"></v-wedge>
            <v-text v-if="show" v-for="(item, index) in items" :config="textConfig(index, item)"></v-text>
            <v-line v-if="show" :config="{points:[586, 356, 606, 366, 606, 346], fill: 'black', closed: true}"></v-line>
        </v-layer>
    </v-stage>
    <div v-if="show && rotateState === 3" class="absolute left-[364px] top-[224px] h-[600px] w-[630px] bg-black/50 p-4">
        <p class="text-2xl text-white">다음 황금열쇠는</p>
        <p class="text-5xl text-yellow-300">{{ result() }}</p>
    </div>
    <button v-if="show" class="rotateButton" v-show="rotateState !== 2" @click="click()">
        {{ rotateTexts[rotateState] }}
    </button>
</template>

<script lang="ts">
import { ref } from 'vue'

const rotateStates = {
    idle: 0,
    spinning: 1,
    stopping: 2,
    result: 3
}

export default {
    props: {
        show: Boolean,
        payload: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            socket: ref<WebSocket | null>(null),
            items: [
                { option: '가', count: 1, color: 30 },
                { option: '나', count: 1, color: 60 },
                { option: '다', count: 1, color: 90 },
                { option: '라', count: 1, color: 120 },
                { option: '마', count: 1, color: 150 },
                { option: '바', count: 1, color: 180 },
            ],//new Array<{ option: string, count: number, color: number }>,
            rotateAngle: 0,
            rotateSpeed: 50,
            rotateTexts: ['돌리기', '멈추기', '', '다음'],
            rotateState: 0
        }
    },
    methods: {
        // Properties
        sum(index: number) {
            var x = 0
            for (let i = 0; i < index; i++) {
                x += this.items[i].count
            }
            return x
        },
        unitAngle() {
            return 360 / this.sum(this.items.length)
        },
        sectorConfig(index: number, item: { option: string, count: number, color: number }) {
            return {
                x: 356,
                y: 356,
                radius: 240,
                angle: item.count * this.unitAngle(),
                fill: 'hsl(' + item.color + ', 70%, 60%)',
                stroke: 'black',
                rotation: this.rotateAngle + this.sum(index) * this.unitAngle()
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
                rotation: this.rotateAngle + this.sum(index) * this.unitAngle() + item.count * this.unitAngle() / 2
            }
        },
        result() {
            let output = ''
            let target = this.sum(this.items.length) - Math.floor(this.rotateAngle / this.unitAngle())
            for (let i = 0; i < this.items.length; i++) {
                if (target > this.sum(i)) {
                    output = this.items[i].option
                }
            }
            return output
        },
        // Main Functions
        spin() {
            switch (this.rotateState) {
                case rotateStates.idle:
                    this.rotateSpeed = 50
                    break
                case rotateStates.spinning:
                case rotateStates.stopping:
                    this.rotateAngle += this.rotateSpeed
                    if (this.rotateAngle >= 360) {
                        this.rotateAngle -= 360
                    }
                    if (this.rotateState === rotateStates.stopping) {
                        this.rotateSpeed -= 1 / Math.PI
                        if (this.rotateSpeed <= 0) {
                            this.rotateState += 1
                        }
                    }
            }
            window.requestAnimationFrame(this.spin)
        },
        connect() {
            this.socket = new WebSocket('wss://toon.at:8071/' + this.payload)
            this.socket.onopen = () => {
                console.log('connected')
            }
            this.socket.onmessage = msg => {
                if (msg.data.includes('roulette')) {
                    let roulette = JSON.parse(msg.data).content.message as string 
                    let rValue = roulette.split(' - ')[1]
                    if (rValue !== '꽝') {
                        this.addItem(rValue)
                    }
                }
            }
            this.socket.onclose = () => {
                console.log('disconnected')
                setTimeout(() => this.connect(), 5000)
            }
        },
        addItem(name: string) {
            const idx = this.items.findIndex(item => item.option === name)
            if (idx > -1) {
                this.items[idx].count += 1
            } else {
                this.items.push({option: name, count: 1, color: Math.random() * 360})
            }
        },
        subItem() {
            const idx = this.items.findIndex(item => item.option === this.result())
            this.items[idx].count -= 1
            if (this.items[idx].count === 0) {
                this.items.splice(idx, 1)
            }
        },
        click() {
            this.rotateState = (this.rotateState + 1) % 4
            if (this.rotateState === rotateStates.idle) {
                this.subItem()
            }
        }
    },
    mounted() {
        this.spin()
        this.connect()
    }
}
</script>

<style>
.rotateButton{
    @apply absolute h-12 w-24 bg-yellow-300 hover:bg-yellow-400 left-[336px] bottom-[196px]
        rounded-xl
}
</style>