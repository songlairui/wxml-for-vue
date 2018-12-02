<template>
    <div class="swiper-overflow" :style="coverStyle" ref="container">
        <wrapper class="swiper" :style='outerStyle' :itemStyle="itemStyle"
                 :circular="circular"
                 @touchstart="touchStart"
                 @touchmove="touchMove"
                 @touchend="touchEnd"
                 @count="count = $event">
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

    const wait = (num = 0) => new Promise(r => setTimeout(r, num))

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
                curr: this.current,
                offset: 0,
                goto: -1,
                width: 0,
                height: 0,
                transition: 'none',
                count: 0,
                translateXY: [0, 0],
                touching: false,
                source: ''
                /* 未响应变量
                timerAni
                timerAuto
                */
            }
        },
        computed: {
            rCount() {
                return this.circular ? this.count + 2 : this.count
            },
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
                    h = h * (this.rCount || 1)
                } else {
                    w = w * (this.rCount || 1)
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
            current(val) {
                this.curr = val
            },
            vertical() {
                this.show(this.curr, false)
            },
            circular() {
                this.show(this.curr, false)
            },
            autoplay(val) {
                val ? this.startAuto() : this.stopAuto()
            },
            curr(val) {
                if (val > -1 && val < this.count) {
                    this.$emit('change', {detail: {current: val, source: this.source}})
                }
            }
        },
        methods: {
            async prepareEnd(last) {
                this.transition = 'none'
                const delta = last || 1
                let [x, y] = this.translateXY
                if (this.vertical) {
                    y += this.height * this.count * delta
                } else {
                    x += this.width * this.count * delta
                }
                this.translateXY = [x, y]
                await wait()
                this.transition = `${this.duration}ms`
            },
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
            async touchEnd(e) {
                this.source = 'touch'
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
                if (distance > Math.abs(this.threshold)) {
                    e.preventDefault()
                }
                if (distance > this.threshold) {
                    if (this.curr > 0) {
                        this.curr--
                    } else if (!this.circular) {
                        this.curr = 0
                    } else {
                        this.curr = this.count - 1
                        // 挪动
                        await this.prepareEnd(-1)
                    }
                } else if (distance < -this.threshold) {
                    if (this.curr < this.count - 1) {
                        this.curr++

                    } else if (!this.circular) {
                        this.curr = this.count - 1
                    } else {
                        this.curr = 0
                        // reset
                        await this.prepareEnd(1)
                    }
                }
                this.show(this.curr)
            },
            show(idx, animate = true) {
                if (this.circular) idx = idx + 1
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
                        this.$emit('animationfinish', {detail: {current: this.curr, source: this.source}})
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
            async next() {
                this.prev = this.curr
                if (this.curr >= this.count - 1) {
                    this.curr = -1
                    await this.prepareEnd(1)
                }
                this.curr++
                this.show(this.curr)
            },
            startAuto() {
                this.source = 'autoplay'
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
            Object.assign(this, {width, height})
            this.autoplay && this.startAuto()
            this.show(0, false)
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
