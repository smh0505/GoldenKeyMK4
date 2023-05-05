<template>
    <div v-if="show" class="modal-mask">
        <div class="modal-container">
            <div class="modal-header">출발 메뉴</div>
            <div class="modal-body">
                <slot name="body">
                    <div class="grid grid-cols-2 gap-6 auto-cols-fr auto-rows-fr">
                        <button class="modal-button" @click="$emit('shuffle')">판 섞기</button>
                        <button class="modal-button" @click="$emit('addkey')">판 섞기 + 열쇠 추가</button>
                        <button class="modal-button" @click="$emit('restore')">판 초기화</button>
                        <button class="modal-button"></button>
                    </div>
                </slot>
            </div>

            <div class="modal-footer">
                <button class="close-button" @click="$emit('close')">닫기</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        show: Boolean
    }
}
</script>

<style>
.modal-mask {
    @apply fixed z-50 top-0 left-0 w-full h-full bg-black/50 flex;
}

.modal-container{
    @apply w-1/3 m-auto px-7 py-5 bg-cyan-300/70 rounded-sm shadow-md;
}

.modal-header{
    @apply text-4xl pb-6 text-center;
}

.modal-button{
    @apply h-16 w-full grid place-content-center 
        bg-blue-600 hover:bg-blue-400 transition-colors 
        text-white hover:text-black text-lg;
}

.modal-footer{
    @apply font-bold text-2xl text-center pt-6;
}

.close-button{
    @apply p-4 bg-gradient-to-r from-cyan-300 hover:to-cyan-300 hover:from-transparent rounded-xl
}
</style>