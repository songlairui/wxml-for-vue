<template>
    <div class="indicators" :style="outerStyle">
        <div class="dot" v-for="(bg, idx) in dotsBg" :key="idx"
             :style="{background: bg}"></div>
    </div>
</template>
<script>
    import { isInChunk } from './utils'

    export default {
        name: 'indicator',
        props: {
            count: {
                type: Number,
                default: 0
            },
            curr: {
                type: Number,
                default: 0
            },
            indicatorColor: {
                type: String,
                default: 'rgba(0,0,0,.3)'
            },
            indicatorActiveColor: {
                type: String,
                default: '#000000'
            },
            vertical: Boolean,
            displayMultipleItems: Number
        },
        computed: {
            dotsBg() {
                let arr = []
                arr.length = this.count
                return arr.fill(0).map((__, idx) => isInChunk(this.curr, this.displayMultipleItems, this.count)(idx) ? this.indicatorActiveColor : this.indicatorColor)
            },
            outerStyle() {
                return this.vertical ? {
                    flexDirection: 'column',
                    top: '50%',
                    right: '6px',
                    transform: 'translateY(-50%)'
                } : {
                    flexDirection: 'row',
                    left: '50%',
                    bottom: '6px',
                    transform: 'translateX(-50%)'
                }
            }
        }
    }
</script>
<style scoped>
    .indicators {
        position: absolute;
        display: flex;
    }

    .dot {
        flex: 0 0 8px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 4px;
    }
</style>
