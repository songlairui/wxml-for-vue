<template>
    <div class="swiper-overflow" :style="coverStyle" ref="container">
        <wrapper class="swiper" :style='outerStyle' :itemStyle="itemStyle" @touchstart="touchStart"
                 @touchmove="touchMove" @touchend="touchEnd">
            <slot></slot>
        </wrapper>
        <indicator :count="count"
                   :curr="curr"
                   :indicatorColor="indicatorColor"
                   :indicatorActiveColor="indicatorActiveColor"
                   :vertical="vertical"
                   v-if="indicatorDots && count">
        </indicator>
    </div>
</template>

<script>
    import Wrapper from './wrapper'
    import Indicator from './indicator'
    import props from './props'

    export default {
        props,
        name: 'swiper',
        components: {
            Wrapper,
            Indicator
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
                count: 0,
                translateXY: [0, 0],
                touching: false
                /* 未响应变量
                timerAni
                timerAuto
                */
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
            outerStyle() {
                let {width: w, height: h, transition, translateXY} = this
                if (!w || !h) return {}
                if (this.vertical) {
                    h = h * (this.count || 1)
                } else {
                    w = w * (this.count || 1)
                }
                return {
                    transition,
                    width: `${w}px`,
                    height: `${h}px`,
                    transform: `translate3d(${translateXY.map(n => n && `${n}px`).join(',')}, 0)`
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
        watch: {
            vertical() {
                this.show(this.curr, false)
            },
            autoplay(val) {
                val ? this.startAuto() : this.stopAuto()
            }
        },
        methods: {
            touchStart(e) {
                this.touching = true
                const {pageX: x, pageY: y} = e.changedTouches[0] || {}
                Object.assign(this.start, {x, y})
                this.transition = 'none'
            },
            touchMove(e) {
                const {pageX: x, pageY: y} = e.changedTouches[0] || {}
                Object.assign(this.move, {x, y})
                this.translateXY = this.vertical ?
                    [0, this.move.y - this.start.y - this.offset]
                    :
                    [this.move.x - this.start.x - this.offset, 0]

                e.preventDefault();
            },
            touchEnd(e) {
                this.touching = false
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
            show(idx, animate = true) {
                if (this.vertical) {
                    this.offset = idx * this.height
                    this.translateXY = [0, -this.offset]
                } else {
                    this.offset = idx * this.width
                    this.translateXY = [-this.offset, 0]
                }
                const duration = animate ? this.duration : 0
                this.transition = duration ? `${this.duration}ms` : 'none'
                clearTimeout(this.timerAni)
                this.timerAni = setTimeout(() => {
                    if (this.curr !== this.prev || this.timerAni !== null || this.goto > -1) {
                        const cb = this.eventHandlers.swiped || this.noop
                        cb.apply(this, [this.prev, this.curr])
                        this.autoplay && this.startAuto()
                        this.goto = -1
                        this.timerAni = null
                    }
                }, duration)
            },
            go(idx, animate = true) {
                if (idx < 0 || idx > this.count - 1 || idx === this.curr) {
                    return
                }
                this.curr = idx
                this.prev = Math.max(idx - 1, 0)
                this.goto = idx
                this.show(idx, animate)
            },
            next() {
                this.prev = this.curr
                this.curr = this.curr >= this.count - 1 ? 0 : this.curr + 1
                this.show(this.curr)
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
            },
            startAuto() {
                clearTimeout(this.timerAuto)
                this.timerAuto = setTimeout(() => {
                    this.timerAuto = null
                    if (this.touching) return
                    this.next()
                    this.startAuto()
                }, this.interval)
            },
            stopAuto() {
                clearTimeout(this.timerAuto)
                this.timerAuto = null
            }
        },
        mounted() {
            const $el = this.$refs.container
            const {offsetWidth: width, offsetHeight: height} = $el
            this.count = this.$children.length
            Object.assign(this, {width, height})
            this.autoplay && this.startAuto()
        }
    }
</script>
<style scoped>
    .swiper-overflow {
        overflow: hidden;
        width: auto;
        height: 150px;
        position: relative;
    }

    .swiper {
        height: 100%;
        display: block;
        overflow: hidden;
        transition: all 0.3s ease;
        position: relative;
    }
</style>
