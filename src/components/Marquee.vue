<template>
    <div ref="container" class="w-full m-0 p-0">
        <div class="relative flex text-lg whitespace-nowrap">
            <div :class="{ 'animate-marquee': isOverflown }">
                <span class="mr-10">{{ title }}</span>
            </div>
            <div v-if="isOverflown" class="animate-marquee2 absolute">
                <span class="mr-10">{{ title }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        title: String
    },
    data() {
        return {
            isOverflown: false
        }
    },
    methods: {
        measure() { 
            const container = this.$refs.container as HTMLDivElement
            return container.scrollWidth > container.clientWidth
        }
    },
    mounted() {
        this.isOverflown = this.measure()
    },
    updated() {
        this.isOverflown = this.measure()
    }
}
</script>