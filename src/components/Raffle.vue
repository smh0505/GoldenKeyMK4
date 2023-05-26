<template>
    <div class="songlist" v-show="show">
        <div v-if="pool.length === 0" class="p-4">
            <p class="text-4xl">
                투표함 사용법<br>
                !픽 <span class="text-red-500">[칸 번호]</span> <span class="text-blue-500">[곡 제목]</span><br>
                ex) !픽 <span class="text-red-500">1</span> <span class="text-blue-500">바람에게 부탁해</span>
            </p>
            <p class="text-2xl">
                주의) 표는 인당 <span class="text-red-500">일반 칸은 3표까지</span>, <span class="text-red-500">무인도는 1표만 유효</span>하며,<br>
                나머지는 <span class="text-red-500">오래된 순으로 버려집니다</span>.<br>
            </p>
        </div>
        <div v-else>
            <div class="themeHeader" :style="{ backgroundColor: color }">
                <div style="width: calc(100% - 80px)">{{ theme }}</div>
            </div>
            <button class="counter" @click="$emit('reset', 0)">{{ pool.length }}</button>
            <div class="songs">
                <div class="list-none">
                    <div v-for="vote in pool">{{ vote.song }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="usedlist" v-if="show">

    </div>
</template>

<script lang="ts">
import { useBoardStore } from '../stores/BoardStore';

export default {
    props: {
        show: Boolean,
        index: Number
    },
    data() {
        return {
            board: useBoardStore()
        }
    },
    computed: {
        theme() {
            return this.board.board[Number(this.index)]
        },
        pool() {
            return this.board.selectAll(Number(this.index))
        },
        color() {
            const pair = this.board.colors.find(x => x.theme === this.theme)
            return pair ? 'hsl(' + String(pair.color) + ', 50%, 70%)' : 'white'
        }
    }
}
</script>

<style>
.songlist{
    @apply absolute top-[196px] left-[336px] w-[640px] h-[340px] bg-white;
    font-family: 'Galmuri14', sans-serif
}

.songlist .themeHeader{
    @apply flex h-14 w-full px-3 text-4xl text-ellipsis items-center;
    font-family: 'Galmuri14', sans-serif
}

.songlist .counter{
    @apply absolute flex top-0 right-0 w-20 h-14 hover:bg-black hover:text-white items-center justify-center text-3xl
}

.songlist .songs{
    @apply flex w-full p-3 text-lg overflow-y-hidden
}

.usedlist{
    @apply absolute top-[540px] left-[336px] w-[640px] h-[280px] bg-black;
    font-family: 'Galmuri14', sans-serif
}
</style>