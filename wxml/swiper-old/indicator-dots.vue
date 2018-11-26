<template>
    <div className={indicatorClass}>
        <i 
          v-for="(item, idx) in indicatorsArr"
          :key="idx"
          :class="[indicatorItemClass, {active: idx === activeIdx}]"
          :style="idx === activeIdx ? activeColor : color"
        />
    </div>
</template>
<script>
export default {
  name: 'IndicatorDots',
  props: {
    activeIdx: { type: Number, default: 0 },
    indicatorsArr: { type: Array, default: () => [] },
    indicatorClass: { type: String, default: 'swiper_indicators' },
    indicatorItemClass: { type: String, default: 'swiper_indicators_item' }
  },
  data() {
    return {
      wrapperClass: 'swiper_wrapper'
    }
  }
}
</script>
