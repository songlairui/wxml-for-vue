<template>
    <div class="swiper-overflow" :style="coverStyle" ref="container">
        <wrapper class="swiper" :style='outerStyle' :itemStyle="itemStyle" @touchstart="touchStart"
                 @touchmove="touchMove" @touchend="touchEnd">
            <slot></slot>
        </wrapper>
    </div>
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
                threshold: 50,
                start: {},
                move: {},
                end: {},
                prev: 0,
                curr: 0,
                offset: 0,
                goto: -1,
                eventHandlers: {},
                width: 0,
                height: 0,
                transition: 'none',
                transform: ''
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
                let {width: w, height: h, transition, transform} = this
                if (!w || !h) return {}
                if (this.vertical) {
                    h = h * this.count
                } else {
                    w = w * this.count
                }
                return {
                    width: `${w}px`, height: `${h}px`,
                    transition, transform
                }
            },
            coverStyle() {
                let {width, height} = this
                if (!width || !height) return {}
                return {
                    width: `${width}px`, height: `${height}px`
                }
            }
        },
        methods: {
            touchStart(e) {
                const {pageX: x, pageY: y} = e.changedTouches[0] || {}
                Object.assign(this.start, {x, y})
                this.transition = 'none'
            },
            touchMove(e) {
                const {pageX: x, pageY: y} = e.changedTouches[0] || {}
                Object.assign(this.move, {x, y})
                let distance
                if (this.vertical) {
                    distance = this.move.y - this.start.y
                    this.transform = `translate3d(0, ${distance - this.offset}px, 0`
                } else {
                    distance = this.move.x - this.start.x
                    this.transform = `translate3d(${distance - this.offset}px, 0, 0)`
                }
                e.preventDefault();
            },
            touchEnd(e) {
                const {pageX: x, pageY: y} = e.changedTouches[0] || {}
                Object.assign(this.end, {x, y})
                let distance
                if (this.vertical) {
                    distance = this.end.y - this.start.y
                } else {
                    distance = this.end.x - this.start.x

                }
                this.prev = this.curr
                if (distance > this.threshold) {
                    this.curr = this.curr === 0 ? 0 : --this.curr
                    e.preventDefault()
                } else if (distance < -this.threshold) {
                    this.curr = this.curr < (this.count - 1) ? ++this.curr : this.curr
                    e.preventDefault()
                }
                this.show(this.curr)
            },
            show(idx) {
                if (this.vertical) {
                    this.offset = idx * this.height
                    this.transform = `translate3d(0, -${this.offset}px, 0)`
                } else {
                    this.offset = idx * this.width
                    this.transform = `translate3d(-${this.offset}px, 0, 0)`
                }
                this.transition = `${this.duration}ms`
                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    if (this.curr !== this.prev || this.timeout !== null || this.goto > -1) {
                        this.activate(this.curr)
                        const cb = this.eventHandlers.swiped || this.noop
                        cb.apply(this, [this.prev, this.curr])
                        this.goto = -1
                        this.timeout = null
                    }
                }, this.duration)
            },
            activate() {
                // add class via computed
            },
            go(idx) {
                if (idx < 0 || idx > this.count - 1 || idx === this.curr) {
                    return
                }
                this.curr = idx
                this.prev = Math.max(idx - 1, 0)
                this.goto = idx
                this.show(idx)
            },
            next() {
                if (this.curr >= this.count - 1) {
                    return
                }
                this.prev = this.curr
                this.show(++this.curr)
            },
            on(eventName, cb) {
                if (this.eventHandlers[eventName]) {
                    throw new Error(`event ${eventName} is already register`)
                }
                if (typeof cb !== 'function') {
                    throw new Error(`parameter callback must be a function`)
                }
                this.eventHandlers[eventName] = Object.freeze(cb)
            },
            noop() {
            }
        },
        mounted() {
            const $el = this.$refs.container
            const {offsetWidth: width, offsetHeight: height} = $el
            Object.assign(this, {width, height})

        }
    }
</script>
<style scoped>
    .swiper-overflow {
        overflow: hidden;
        width: auto;
        height: 150px;
    }

    .swiper {
        height: 100%;
        display: block;
        overflow: hidden;
        transition: all 0.3s ease;
    }
</style>
