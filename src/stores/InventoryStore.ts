import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('InventoryStore', {
    state: () => {
        return {
            items: [] as Inventory[]
        }
    },
    getters: {
        maxPage(state) {
            return Math.ceil(state.items.length / 4)
        }
    },
    actions: {
        checkType(name: string) {
            for (let i = 0; i < temp.length; i++){
                let match = name.match(temp[i])
                if (match !== null) {
                    let groups = match.groups
                    return {
                        option: String(groups?.option.trim()),
                        count: Number(groups?.count),
                        type: i
                    }
                }
            }
        },
        addItem(name: string) {
            const object = this.checkType(name)
            if (object !== undefined) {
                const idx = this.items.findIndex(item => item.option === object.option)
                if (idx > -1) {
                    if (object.type !== countType.limit) {
                        this.items[idx].count += object.count
                    }
                } else {
                    this.items.push(object)
                }
            }
        },
        removeAll(type: number) {
            for (let i = this.items.length - 1; i > -1; i--){
                if (this.items[i].type === type) {
                    this.subOne(i)
                }
            }
        },
        addOne(index: number) {
            this.items[index].count += 1
        },
        subOne(index: number) {
            this.items[index].count -= 1
            if (this.items[index].count === 0) {
                this.items.splice(index, 1)
            }
        },
        pageView(page: number) {
            return this.items.slice(page * 4, page * 4 + 4)
        }
    }
})

interface Inventory{
    option: string,
    count: number,
    type: number
}

const countType = {
    dice: 0,
    song: 1,
    limit: 2
}

const temp = [
    /(?<count>\d+)턴간(?<option>.+)/,
    /(?<count>\d+)곡 동안(?<option>.+)/,
    /(?<option>.+)\((?<count>\d+)회\)/
]