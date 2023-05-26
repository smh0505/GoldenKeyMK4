<template>
    <div v-show="show" class="diceContainer">
        <iframe class="dice" src="https://shepherdingsheep.github.io/hdwv_2/"></iframe>
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
.diceContainer{
    @apply absolute top-[184px] left-[324px] h-[712px] w-[700px]
}

.diceContainer .dice{
    @apply flex h-full w-full px-24;
    scale: 90%
}
</style>