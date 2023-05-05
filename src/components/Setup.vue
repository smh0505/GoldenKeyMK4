<template>
    <div v-if="show" class="setup-mask">
        <div class="setup-container">
            <div class="setup-header">기본 설정</div>
            <div class="setup-body">
                <div class="setup-tabs">
                    <button class="setup-tab" :class="tabIndex == 0 ? 'bg-white' : 'bg-transparent'" @click="tabIndex = 0">판때기</button>
                    <button class="setup-tab" :class="tabIndex == 1 ? 'bg-white' : 'bg-transparent'" @click="tabIndex = 1">황금열쇠</button>
                    <button class="setup-tab" :class="tabIndex == 2 ? 'bg-white' : 'bg-transparent'" @click="tabIndex = 2">투네이션</button>
                </div>
                <div class="body-container">
                    <div class="setup-board" v-show="tabIndex == 0" v-for="(theme, index) in themes" :key="index">
                        <input type="text" class="text-input" placeholder="대주제" v-model="theme.head">
                        <input type="text" class="text-input" placeholder="소주제" v-model="theme.tail">
                        <button class="button-input" @click="addTheme(index)">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                        <button class="button-input" @click="removeTheme(index)" v-if="index >= 1">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="setup-goldenkey" v-show="tabIndex == 1">
                        <div class="bg-green-400 rounded-lg max-h-[400px] overflow-auto">
                            <div class="m-2" v-for="(log, index) in logs" :key="index">
                                <button class="log" :class="index == logIndex ? 'bg-white' : 'bg-transparent'" @click="logIndex = index">{{ log }}</button>
                            </div>
                        </div>
                        <div class="bg-yellow-400 rounded-lg max-h-[400px] overflow-auto">
                            <div class="gk-default" v-show="logIndex == 0" v-for="(key, index) in logDefault" :key="index">
                                <input class="text-input" type="text" placeholder="열쇠 항목" v-model="key.option">
                                <input class="text-input" type="number" v-model="key.count">
                                <button class="button-input" @click="addKey()">
                                    <span class="material-symbols-outlined">add</span>
                                </button>
                                <button class="button-input" @click="removeKey()" v-if="index >= 1">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="text-center justify-center" v-show="tabIndex == 2">
                        <p class="font-bold text-lg">투네이션 통합 위젯 비밀키</p>
                        <input class="w-1/2 m-2 p-2 rounded-lg" type="password" v-model="password">
                    </div>
                </div>
            </div>
            <div class="setup-footer">
                <button class="setup-close" @click="printResult()">저장</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as LocalForage from 'localforage'
import axios from 'axios'

export default {
    props: {
        show: Boolean
    },
    data() {
        return {
            tabIndex: 0,
            themes: [{ head: "", tail: "" }],
            logIndex: 0,
            logs: ["기본 설정"],
            logDefault: [{ option: "", count: 1 }],
            password: ""
        }
    },
    methods: {
        addTheme(index: number) {
            this.themes.splice(index + 1, 0, { head: "", tail: "" })
        },
        removeTheme(index: number) {
            this.themes.splice(index, 1)
        },
        addKey() {
            this.logDefault.push({ option: "", count: 1 })  
        },
        removeKey() {
            this.logDefault.pop()  
        },
        async printResult() {
            if (this.themes.length < 14) {
                window.alert('오류: 판때기의 주제가 최소 14개가 있어야 정상 작동합니다.')
            } else {
                const response = await axios.get('https://toon.at/widget/alertbox/' + this.password)
                console.log(response.data)
                LocalForage.setItem('themes', JSON.parse(JSON.stringify(this.themes)))
                this.$emit('close', this.themes)
            }
        }
    },
    created() {
        LocalForage.getItem('themes').then(value => {
            if (value !== null) {
                const themes = value as Array<{ head: string, tail: string }>
                this.themes.splice(0, 1)
                themes.forEach(x => this.themes.push(x))
            }
        })
    }
}
</script>

<style>
.setup-mask{
    @apply fixed z-50 top-0 left-0 w-full h-full bg-black/50 flex;
}

.setup-container{
    @apply w-2/3 m-auto px-7 py-5 bg-cyan-300/70 rounded-sm shadow-md;
}

.setup-header{
    @apply text-4xl pb-6 text-center
}

.setup-tabs{
    @apply flex justify-center mb-2
}

.setup-tab{
    @apply mx-2 px-2 py-2 hover:bg-white/50
}

.body-container{
    @apply max-h-[400px] overflow-auto
}

.setup-board{
    @apply grid my-2 gap-x-2;
    grid-template-columns: 1fr 1fr 3rem 3rem
}

.text-input{
    @apply w-full p-2 rounded-lg
}

.button-input{
    @apply p-2 rounded-lg bg-blue-300 hover:bg-blue-400 hover:text-white
}

.setup-goldenkey{
    @apply grid grid-cols-2 gap-x-2
}

.log{
    @apply p-2 rounded-lg w-full hover:bg-white/50
}

.gk-default{
    @apply grid m-2 gap-x-2;
    grid-template-columns: 1fr 3rem 3rem 3rem
}

.setup-footer{
    @apply flex justify-center m-2
}

.setup-close{
    @apply px-4 py-2 bg-green-300 hover:bg-green-400 rounded-lg
}
</style>