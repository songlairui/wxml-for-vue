<template>
    <div class="paas-swiper">
        <div class="paas-swiper__wrapper">
          <slot></slot>
        </div>
        <div class="paas-swiper-indicator">
          <i class="indicator-item" :key="idx" :class="{active: idx === activeIdx }" v-for="(item, idx) in indicatorArr"></i>
        </div>  
    </div>
</template>
<script>
export default {
  name: 'PaasSwiper',
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
      type: String,
      default: '#000000'
    },
    nextMargin: {
      type: String,
      default: '#000000'
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
    return {}
  }
}
</script>

<style lang="less">
.red {
  color: red
}
.paas-swiper {
  position: relative;
  overflow: hidden;
  height: 150px;

  &__wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__item {
    float: left;
    height: 100%;
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

