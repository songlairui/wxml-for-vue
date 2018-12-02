<template>
    <div class="swiper-overflow" :style="coverStyle" ref="container">
        <wrapper class="swiper" :style='outerStyle' :itemStyle="itemStyle"
                 :circular="circular"
                 :displayMultipleItems="displayMultipleItems"
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
                   :displayMultipleItems="displayMultipleItems"
                   :vertical="vertical"
                   v-if="indicatorDots && count">
        </indicator>
    </div>
</template>

<script>
    import Wrapper from './wrapper'
    import Indicator from './indicator'
    import props from './props'
    import { wait, inChunk } from './utils'

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
                coverWidth: 0,
                coverHeight: 0,
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
            circularable() {
                return this.circular && this.count > this.col
            },
            width() {
                return this.coverWidth / (this.vertical ? 1 : this.col)
            },
            height() {
                return this.coverHeight / (this.vertical ? this.col : 1)
            },
            col() {
                return this.displayMultipleItems || 1
            },
            rCount() {
                return this.circularable ? this.count + 2 : this.count
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
                let { width: w, height: h, transition, translateXY } = this
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
                let { coverWidth, coverHeight } = this
                if (!coverWidth || !coverHeight) return {}
                return {
                    width: `${coverWidth}px`, height: `${coverHeight}px`
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
            circular(val) {
                const maxCur = this.count - this.col
                if (!val && this.curr > maxCur) {
                    this.curr = maxCur
                }
                this.show(this.curr, false)
            },
            autoplay(val) {
                val ? this.startAuto() : this.stopAuto()
            },
            curr(val) {
                if (val > -1 && val < this.count) {
                    this.$emit('change', { detail: { current: val, source: this.source } })
                }
            }
        },
        methods: {
            touchStart(e) {
                this.touching = true
                const { pageX: x, pageY: y } = e.changedTouches[0] || {}
                Object.assign(this.start, { x, y })
                this.transition = 'none'
            },
            async touchMove(e) {
                e.preventDefault();
                const { pageX: x, pageY: y } = e.changedTouches[0] || {}
                Object.assign(this.move, { x, y })
                let [a, b] = [0, 0]
                // 如果是首尾衔接，则move时补位translate的周期，实现无限循环的感觉
                if (this.vertical) {
                    const target = this.move.y - this.start.y - this.offset
                    b = this.circularable ? inChunk(-this.height * this.count, 0)(target) : target
                } else {
                    const target = this.move.x - this.start.x - this.offset
                    a = this.circularable ? inChunk(-this.width * this.count, 0)(target) : target
                }
                this.translateXY = [a, b]
            },
            async touchEnd(e) {
                this.source = 'touch'
                this.touching = false
                const { pageX: x, pageY: y } = e.changedTouches[0] || {}
                Object.assign(this.end, { x, y })
                let distance
                if (this.vertical) {
                    distance = this.end.y - this.start.y
                } else {
                    distance = this.end.x - this.start.x

                }
                this.prev = this.curr
                if (distance > this.threshold) {
                    const minCur = this.circular ? 1 - this.col : 0
                    this.curr = this.curr === minCur ? minCur : --this.curr
                    e.preventDefault()
                } else if (distance < -this.threshold) {
                    const maxCur = this.circular ? (this.count - 1) : (this.count - this.col)
                    this.curr = this.curr < maxCur ? ++this.curr : this.circular ? 0 : this.curr
                    e.preventDefault()
                } else if (this.circular && distance < 0 && this.curr === this.count - 1) {
                    // 用于处理 current为count-1时，向current = 0拖动并未达到threshold到界面表现
                    this.curr = -1
                }
                this.show(this.curr)
            },
            show(idx, animate = true) {
                if (this.curr < 0) {
                    this.curr += this.count
                }
                if (this.circularable) idx = idx + 1
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
                        this.$emit('animationfinish', { detail: { current: this.curr, source: this.source } })
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
                if (this.curr === this.count - 1) {
                    this.show(-1, false)
                    await wait()
                }
                this.curr++
                this.show(this.curr)
            },
            startAuto() {
                this.source = 'autoplay'
                clearTimeout(this.timerAuto)
                this.timerAuto = setTimeout(() => {
                    this.timerAuto = null
                    if (this.touching || this.count <= this.col) return
                    this.next()
                    this.startAuto()
                }, this.interval)
            },
            stopAuto() {
                clearTimeout(this.timerAuto)
                this.timerAuto = null
            },
            init() {
                const $el = this.$refs.container
                if (!$el) return
                const { offsetWidth: coverWidth, offsetHeight: coverHeight } = $el
                Object.assign(this, { coverWidth, coverHeight })
                this.autoplay && this.startAuto()
                this.show(this.curr, false)
            }
        },
        mounted() {
            this.init()
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
