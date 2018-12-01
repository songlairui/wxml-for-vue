<template>
    <wrapper class="swiper" :style='outerStyle' ref="container" :itemStyle="itemStyle">
        <slot></slot>
    </wrapper>
</template>

<script>
    import Wrapper from './wrapper'
    import props from './props'

    export default {
        props,
        name: 'swiper',
        components: {
            Wrapper
        },
        data() {
            return {
                start: {},
                move: {},
                end: {},
                prev: 0,
                tmpCurrent: 0,
                offset: 0,
                goto: -1,
                eventHandlers: {},
                width: 0,
                height: 0

            }
        },
        computed: {
            itemStyle() {
                return (this.width) ? {
                    width: `${this.width}px`, height: `${this.height}px`
                } : {}
            },
            direction() {
                return this.vertical ? 'vertical' : 'horizontal'
            },
            items() {
                return this.$children
            },
            count() {
                return this.items.length
            },
            outerStyle() {
                let {width: w, height: h} = this
                if (!w || !h) return {}
                if (this.vertical) {
                    h = h * this.count
                } else {
                    w = w * this.count
                }
                return {
                    width: `${w}px`, height: `${h}px`
                }
            }
        },
        methods: {},
        mounted() {
            const {offsetWidth: width, offsetHeight: height} = this.$refs.container
            Object.assign(this, {width, height})

        }
    }
</script>
