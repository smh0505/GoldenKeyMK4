<template>
    <div class="logBox">
        <div v-for="(log, index) in board.log" :class="logConfig(index)">{{ log.name }}</div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '../stores/BoardStore'

export default {
    props: {
        begin: Boolean  
    },
    data() {
        return {
            socket: ref<WebSocket | null>(null),
            board: useBoardStore()
        }
    },
    methods: {
        connect() {
            this.socket = new WebSocket('wss://irc-ws.chat.twitch.tv')
            this.socket.onopen = () => {
                this.socket?.send('CAP REQ :twitch.tv/commands twitch.tv/tags')
                this.socket?.send('NICK justinfan9705')
                this.socket?.send('JOIN #arpa__')
                this.board.update('연결됨!', 2) // Connected
            }
            this.socket.onmessage = msg => {
                if (msg.data.includes('PING')) {
                    this.socket?.send('PONG :tmi.twitch.tv')
                }
                if (this.begin && msg.data.includes('!픽')) {
                    this.board.parse(msg.data)
                }
            }
            this.socket.onclose = () => {
                this.board.update('연결 중...', 3) // Disconnected
                setTimeout(() => this.connect(), 5000)
            }
        },
        logConfig(index: number) {
            return {
                accepted: this.board.log[index].state === 0,
                declined: this.board.log[index].state === 1,
                connected: this.board.log[index].state === 2,
                disconnected: this.board.log[index].state === 3,
                'toon-connected': this.board.log[index].state === 4,
                'toon-disconnected': this.board.log[index].state === 5
            }
        }
    },
    mounted() {
        this.connect()
    }
}
</script>

<style>
.logBox{
    @apply absolute grid top-[260px] right-[624px] w-[255px] h-[258px] font-bold text-ellipsis;
    grid-template-rows: repeat(10, minmax(0, 1fr));
}

.logBox .accepted{
    @apply flex w-full h-full bg-blue-400
}

.logBox .declined{
    @apply flex w-full h-full bg-red-400
}

.logBox .connected{
    @apply flex w-full h-full bg-yellow-400
}

.logBox .disconnected{
    @apply flex w-full h-full bg-yellow-700 text-white
}

.logBox .toon-connected{
    @apply flex w-full h-full bg-green-400
}

.logBox .toon-disconnected{
    @apply flex w-full h-full bg-green-700 text-white
}
</style>