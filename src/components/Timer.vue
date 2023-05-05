<template>
    <div class="frame">
        <button class="laps ml-2" @click="lapsIdx = ((lapsIdx - 1) % 4 + 4) % 4">
            <span class="material-symbols-outlined clockbutton">navigate_before</span>
        </button>
        <span class="clockbutton w-6 justify-center">{{ laps[lapsIdx] }}</span>
        <button class="laps" @click="lapsIdx = ((lapsIdx + 1) % 4 + 4) % 4">
            <span class="material-symbols-outlined clockbutton">navigate_next</span>
        </button>
        <button class="reverse ml-2 w-36 text-right" @click="reverse = !reverse">
            <span class="material-symbols-outlined clockbutton float-left" :style="reverse ? { transform: 'scaleX(-1)'} : {}">cycle</span>
            <span class="text-3xl mx-1">{{ reverse ? '반시계' : '시계' }}</span>
        </button>
        <button class="edittime ml-2" @click="minus()">
            <span class="material-symbols-outlined clockbutton">exposure_neg_1</span>
        </button>
        <button @click="startButton()" class="ml-2 rounded-lg" :class="paused ? 'bg-red-300 hover:bg-red-400' : 'bg-blue-300 hover:bg-blue-400'">
            <span class="clockbutton justify-center">
                {{ elapsed.toFormat('hh:mm:ss') }}
            </span>
        </button>
        <button class="edittime ml-2" @click="plus()">
            <span class="material-symbols-outlined clockbutton">exposure_plus_1</span>
        </button>
    </div>
</template>

<style>
.frame{
    @apply absolute top-[196px] right-[336px] w-[543px] h-14 bg-white flex items-center
}
.clockbutton{
    @apply flex text-4xl mx-1
}
.laps{
    @apply bg-yellow-300 hover:bg-yellow-400 rounded-lg
}
.reverse{
    @apply bg-green-300 hover:bg-green-400 rounded-lg
}
.edittime{
    @apply bg-purple-300 hover:bg-purple-400 rounded-lg
}
</style>

<script lang="ts">
import { DateTime, Duration } from 'luxon'

export default {
    data() {
        return {
            laps: ['1', '2', '3', 'B'],
            lapsIdx: 0,
            reverse: false,
            start: DateTime.now(),
            elapsed: Duration.fromMillis(0),
            paused: true,
            intervalId: 0
        }
    },
    methods: {
        minus() {
            this.elapsed = this.elapsed.minus({ minutes: 1 })
            this.start = this.start.plus({ minutes: 1 })
        },
        plus() {
            this.elapsed = this.elapsed.plus({ minutes: 1 })
            this.start = this.start.minus({ minutes: 1 })
        },
        startButton() {
            if (this.paused) {
                this.paused = false
                this.start = DateTime.now().minus(this.elapsed)
                this.intervalId = window.setInterval(() => {this.elapsed = DateTime.now().diff(this.start)}, 1000)
            } else {
                this.paused = true
                this.elapsed = DateTime.now().diff(this.start)
                window.clearInterval(this.intervalId)
            }
        }
    }
}
</script>