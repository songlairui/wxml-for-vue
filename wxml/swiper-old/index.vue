<template>
    <div class="paas-swiper">
        <div class="paas-swiper__wrapper" @touchstart="onTouchStart">
            <slot></slot>
        </div>
        <div class="paas-swiper-indicator">
            <indicator-dot :activateIdx='activateIdx' :indicatorsArr='indicatorsArr' v-for="(item, idx) in indicatorArr" :key="idx"></indicator-dot>
        </div>
        <div class="meta" style="position: fixed;left: 0;top:0">
          {{ touchStartX }}
          {{ touchStartY }}
        </div>
    </div>
</template>
<script>
import IndicatorDot from './indicator-dots'

export default {
  name: 'PaasSwiper',
  components: { IndicatorDot },
  props: {
    indicatorDots: {
      type: Boolean,
      default: false
    },
    indicatorColor: {
      type: String,
      default: 'rgba(0,0,0,.3)'
    },
    indicatorActiveColor: {
      type: String,
      default: '#000000'
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    current: {
      type: Number,
      default: 0
    },
    currentItemId: {
      type: String,
      default: ''
    },
    interval: {
      type: Number,
      default: 5000
    },
    duration: {
      type: Number,
      default: 500
    },
    circular: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    previousMargin: {
      type: Number,
      default: 0
    },
    nextMargin: {
      type: Number,
      default: 0
    },
    displayMultipleItems: {
      type: Number,
      default: 0
    },
    skipHiddenItemLayout: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      indicatorArr: [],
      swiperTimer: null,
      touchStartX: 0,
      touchStartY: 0,
      swiperGap: 0,
      swiperDirection: 'none',
      diff: 0,
      wrapperWidth: 320,
      // swiper.js
      animating: false,
      touching: false,
      currentIndex: 0,
      translate: 0,
      touchId: 0,
      og: 0,
      wrapperWidth: 320,
      wrapperHeight: 150,
      containerWidth: 320,
      containerHeight: 150,
      ogTranslate: 0
    }
  },
  computed: {
    swiperStyle() {
      return {
        transform: this.transform
      }
    }
  },
  methods: {
    startAutoPlay() {
      if (!this.autoplay) return
      this.swiperTimer = setInterval(() => {
        this.slideNext('autoplay')
      }, this.interval)
    },
    pauseAutoPlay() {
      clearTimeout(this.swiperTimer)
    },
    slideNext(type) {},
    slidePre() {},
    swiperTo(idx, type) {},
    onTouchStart(e) {
      if (this.animating) return
      if (this.touching || this.$slots.default.length <= 1) return
      if (this.autoplay) this.pauseAutoPlay()
      let og = 0
      if (!this.vertical) {
        og = e.targetTouches[0].pageX - this.translate
      } else {
        og = e.targetTouches[0].pageY - this.translate
      }
      this.touchStartX = e.touches[0].pageX
      this.touchStartY = e.touches[0].pageY
      Object.assign(this, {
        animating: false,
        touching: true,
        ogTranslate: this.translate,
        touchId: e.targetTouches[0].identifier,
        og
      })
      console.info('start')
    },
    onTouchMove(e) {
      console.info('move')
      if (!this.circular) {
        let touchEndX = e.touches[0].pageX
        let touchEndY = e.touches[0].pageY
        let offsetMoveX = touchEndX - this.touchStartX
        let offsetMoveY = touchEndY - this.touchStartY
        if (this.isFirstIndex()) {
          // new
          if (
            (this.vertical && offsetMoveY > 0) ||
            (!this.vertical && offsetMoveX > 0)
          ) {
            return
          }
        }
        if (this.isLastIndex()) {
          if (
            (this.vertical && offsetMoveY < 0) ||
            (!this.vertical && offsetMoveX < 0)
          ) {
            return
          }
        }
      }
      if (!this.touching || this.$slots.default.length <= 1) return
      if (e.targetTouches[0].identifier !== this.touchId) return
      e.preventDefault()
      this.diff = this.state.translate
      if (!this.vertical) {
        const pageX = e.targetTouches[0].pageX
        diff = pageX - this.og
      } else {
        const pageY = e.targetTouches[0].pageY
        diff = pageY - this.og
      }
      this.translate = diff
    },
    onTouchEnd(e) {
      console.info('end')
      if (!this.touching || this.$slots.default.length <= 1) return
      let { translate, currentIndex } = this
      let og = currentIndex
      let max = !this.vertical
        ? this.wrapperWidth - this.containerWidth
        : this.wrapperHeight - this.containerHeight
      if (translate > 0) {
        translate = 0
      } else if (translate < -max) {
        translate = -max
      } else {
        let changeV = this.isChangeSlide(translate, currentIndex) // new
        translate = changeV.translate
        currentIndex = changeV.currentIndex
      }
      Object.assign(this, {
        touching: false,
        og: 0,
        touchId: undefined,
        ogTranslate: 0,
        animating: true,
        translate,
        currentIndex
      })
    }
  },
  mounted() {
    console.info('this', this)
  }
}
</script>

<style lang="less">
.red {
  color: red;
}
.paas-swiper {
  position: relative;
  overflow: hidden;
  height: 150px;
  width: 100%;
  box-sizing: content-box;

  &__wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
  }

  &__item {
    float: left;
    flex: 1 0 100%;
  }
}

// 轮播点
.paas-swiper_indicators {
  position: absolute;
  width: 100%;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  &__item {
    margin: 0 2.5px;
    width: 7px;
    height: 7px;
    border-radius: 7px;
    background-color: rgba(150, 150, 150, 0.2);
    &.active {
      background-color: rgba(150, 150, 150, 0.5);
    }
  }
}
</style>

