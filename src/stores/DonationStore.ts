import { defineStore } from "pinia";

export const useDonationStore = defineStore('DonationStore', {
    state: () => {
        return {
            items: [] as Donation[]
        }
    },
    actions: {
        sum(index: number): number {
            let x = 0
            for (let i = 0; i < index; i++){
                x += this.items[i].count
            }
            return x
        },
        unitAngle(): number {
            return 360 / this.sum(this.items.length)
        },
        addItem(name: string): void {
            const idx = this.items.findIndex(item => item.option === name)
            if (idx > -1) {
                this.items[idx].count += 1
            } else {
                this.items.push({ option: name, count: 1, color: Math.random() * 360 })
            }
        },
        subItem(name: string): void {
            const idx = this.items.findIndex(item => item.option === name)
            this.items[idx].count -= 1
            if (this.items[idx].count === 0) {
                this.items.splice(idx, 1)
            }
        }
    }
})

interface Donation{
    option: string,
    count: number,
    color: number
}