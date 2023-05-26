<template>
    <div class="inventoryBg">
        <div class="inventoryEmpty" v-if="inventory.items.length === 0">비었음!</div>
        <div class="grid grid-rows-5" v-else>
            <div v-for="(item, index) in inventory.pageView(pageNum)" class="inventoryRow">
                <div class="rowCount">{{ item.count }}</div>
                <div class="rowName" :key="index"><Marquee :title="item.option"></Marquee></div>
                <button v-show="item.type !== 2" class="rowPlus" @click="inventory.addOne(pageNum * 4 + index)">
                    <span class="material-symbols-outlined">add</span>
                </button>
                <button class="rowMinus" @click="inventory.subOne(pageNum * 4 + index)">
                    <span class="material-symbols-outlined">remove</span>
                </button>
            </div>
            <div class="inventoryPage">
                <button class="pageButton" @click="prevPage()">
                    <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <div class="pageNum">페이지 {{ pageNum + 1 }}/{{ inventory.maxPage }}</div>
                <button class="pageButton" @click="nextPage()">
                    <span class="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    </div>
    <div class="inventoryButtons">
        <button class="button1" @click="inventory.removeAll(0)">턴 감소</button>
        <button class="button2" @click="inventory.removeAll(1)">곡 감소</button>
    </div>
    
</template>

<script lang="ts">
import { useInventoryStore } from '../stores/InventoryStore';
import Marquee from './Marquee.vue'

export default {
    data() {
        return {
            inventory: useInventoryStore(),
            pageNum: 0,
        }
    },
    components: {
        Marquee
    },
    methods: {
        nextPage() {
            this.pageNum = (this.pageNum + 1) % this.inventory.maxPage
        },
        prevPage() {
            this.pageNum = ((this.pageNum - 1) % this.inventory.maxPage + this.inventory.maxPage) % this.inventory.maxPage
        }
    }
}
</script>

<style>
.inventoryBg{
    @apply absolute grid top-[260px] right-[336px] w-[280px] h-[200px] bg-purple-800;
    font-family: 'Galmuri14', sans-serif
}

.inventoryEmpty{
    @apply flex justify-center items-center text-white font-bold text-4xl
}

.inventoryRow{
    @apply grid grid-cols-4 text-white items-center;
    grid-template-columns: 10% 70% 10% 10%;
}

.inventoryRow .rowCount{
    @apply flex justify-center text-2xl;
    grid-column: 1
}

.inventoryRow .rowName{
    @apply overflow-x-hidden text-lg;
    grid-column: 2
}

.inventoryRow .rowPlus{
    grid-column: 3
}

.inventoryRow .rowMinus{
    grid-column: 4
}

.inventoryPage{
    @apply grid grid-cols-3 text-white;
    grid-template-columns: 20% 60% 20%;
    grid-row: 5
}

.inventoryPage .pageButton{
    @apply bg-transparent hover:bg-purple-600
}

.inventoryPage .pageNum{
    @apply flex justify-center text-lg
}

.inventoryButtons{
    @apply absolute grid top-[470px] right-[336px] w-[280px] h-12 grid-cols-2 gap-2 text-xl;
    font-family: 'Galmuri14', sans-serif
}

.inventoryButtons .button1{
    @apply rounded-xl bg-red-300 hover:bg-red-400;
}

.inventoryButtons .button2{
    @apply rounded-xl bg-lime-300 hover:bg-lime-400;
}
</style>