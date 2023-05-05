<template>
    <div class="h-full w-full">
        <canvas></canvas>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
    data() {
        return {
            socket: ref<WebSocket | null>(null)
        }
    }
}
</script>