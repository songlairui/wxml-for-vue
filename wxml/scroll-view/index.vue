<template>
    <div class="scroll-view" ref="wrapper">
        <div class="content" ref="scrollContent" :class="{'scroll-x':scrollX, 'scroll-y':scrollY}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
        name: "scroll-view",
        props: {
            scrollX: {
                type: Boolean,
                default: false
            },
            scrollY: {
                type: Boolean,
                default: false
            },
            upperThreshold: {
                type: Number,
                default: 50
            },
            lowerThreshold: {
                type: Number,
                default: 50
            },
            scrollTop: {
                type: Number
            },
            scrollLeft: {
                type: Number
            },
            scrollIntoView: {
                type: String
            },
            scrollWithAnimation: {
                type: Boolean,
                default: false
            },
            enableBackToTop: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                scroll: {},
                timeStamp: +new Date(),
                scrollHeight: 100,
                scrollWidth: 100,
                offsetLeft: 0,
                offsetTop: 0,
                wrapperWidth: 100,
                wrapperHeight: 100
            }
        },
        watch: {
            scrollTop: {
                immediate: true,
                handler(val) {
                    const bScroll = this.scroll.bScroll
                    if (typeof val === 'number' && !Number.isNaN(val) && bScroll) {
                        bScroll.scrollTo(
                            bScroll.x,
                            -val,
                            ...(this.scrollWithAnimation ? [] : [0])
                        )
                    }
                }
            },
            scrollLeft: {
                immediate: true,
                handler(val) {
                    const bScroll = this.scroll.bScroll
                    if (typeof val === 'number' && !Number.isNaN(val) && bScroll) {
                        bScroll.scrollTo(
                            -val,
                            bScroll.y,
                            ...(this.scrollWithAnimation ? [] : [0])
                        )
                    }
                }
            },
            scrollIntoView(id) {
                if (!id) return
                const bScroll = this.scroll.bScroll
                if (bScroll && typeof id === 'string') {
                    bScroll.scrollToElement(`#${id}`)
                }
            }
        },
        mounted() {
            const genScrollDetail = ({ scrollLeft, scrollTop, deltaX, deltaY } = {}) => ({
                scrollLeft, scrollTop,
                scrollHeight: this.scrollHeight,
                scrollWidth: this.scrollWidth,
                deltaX, deltaY
            })
            const genTarget = () => ({
                id: '', offsetLeft: this.offsetLeft, offsetTop: this.offsetTop,
                dataset: { comkey: 0, eventId: 4 }
            })
            const genParams = (type, params) => {
                const timeStamp = +new Date() - this.timeStamp
                let detail
                const { direction } = params
                let target = genTarget()
                let currentTarget = genTarget()
                switch (type) {
                    case 'scrolltoupper':
                    case 'scrolltolower':
                        detail = { direction }
                        break
                    case 'scroll':
                        detail = genScrollDetail(params)
                        break
                }
                return {
                    mp: {
                        type,
                        timeStamp,
                        target,
                        currentTarget,
                        detail
                    },
                    type,
                    timeStamp,
                    target: { ...target, ...detail },
                    currentTarget
                }
            }
            this.$nextTick(() => {
                const scroll = {
                    bScroll: new BScroll(this.$refs.wrapper, {
                        scrollX: this.scrollX,
                        scrollY: this.scrollY,
                        bounce: false,
                        probeType: 3,
                        swipeTime: 1500,
                        deceleration: 0.002,
                        click: true
                    })
                }
                this.timeStamp = +new Date()
                Object.freeze(scroll)
                this.scroll = scroll

                scroll.bScroll.on('refresh', () => {
                    this.scrollWidth = this.$refs.scrollContent.scrollWidth
                    this.scrollHeight = this.$refs.scrollContent.scrollHeight
                    this.offsetLeft = scroll.bScroll.wrapper.offsetLeft
                    this.offsetTop = scroll.bScroll.wrapper.offsetTop
                    this.wrapperHeight = scroll.bScroll.wrapper.offsetHeight
                    this.wrapperWidth = scroll.bScroll.wrapper.offsetWidth
                })

                const lastLocation = { x: 0, y: 0 }

                let even = false
                let odd = false
                scroll.bScroll.on('scroll', e => {
                    const { x, y } = e
                    const scrollLeft = 0 - Math.round(x)
                    const scrollTop = 0 - Math.round(y)
                    const deltaX = lastLocation.x - scrollLeft
                    const deltaY = lastLocation.y - scrollTop
                    if (deltaX || deltaY) {
                        lastLocation.x = scrollLeft
                        lastLocation.y = scrollTop

                        if (this.scrollX) {
                            if (even) {
                                if (deltaX > 0 && scrollLeft < this.upperThreshold) {
                                    const direction = 'left'
                                    this.$emit('scrolltoupper',
                                        genParams('scrolltoupper', { scrollLeft, scrollTop, deltaX, deltaY, direction })
                                    )
                                } else if (deltaX < 0 && scrollLeft > this.scrollWidth - this.wrapperWidth - this.lowerThreshold) {
                                    const direction = 'right'
                                    this.$emit('scrolltolower',
                                        genParams('scrolltolower', { scrollLeft, scrollTop, deltaX, deltaY, direction })
                                    )
                                }
                            }
                            even = !even
                        }
                        if (this.scrollY) {
                            if (odd) {
                                if (deltaY > 0 && scrollTop < this.upperThreshold) {
                                    const direction = 'top'
                                    this.$emit('scrolltoupper',
                                        genParams('scrolltoupper', { scrollLeft, scrollTop, deltaX, deltaY, direction })
                                    )
                                } else if (deltaY < 0 && scrollTop > this.scrollHeight - this.wrapperHeight - this.lowerThreshold) {
                                    const direction = 'bottom'
                                    this.$emit('scrolltolower',
                                        genParams('scrolltolower', { scrollLeft, scrollTop, deltaX, deltaY, direction })
                                    )
                                }
                            }
                            odd = !odd
                        }
                        this.$emit('scroll', genParams('scroll', { scrollLeft, scrollTop, deltaX, deltaY }))
                    }
                })
            })
        },
        updated() {
            if (this.scroll.bScroll) {
                const bScroll = this.scroll.bScroll
                if (bScroll) {
                    bScroll.refresh()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .scroll-view {
        overflow: hidden;

        .content {
            /*float: left;*/
            display: inline-block;
            min-width: 100%;
            min-height: 100%;
            &.scroll-x {
                height: 100%;
            }
            &.scroll-y {
                width: 100%;
            }
        }

    }
</style>
