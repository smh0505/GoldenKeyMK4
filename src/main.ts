import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import VueKonva from 'vue-konva'

const app = createApp(App)
const pinia = createPinia()

app.use(VueKonva)
app.use(pinia)
app.mount('#app')