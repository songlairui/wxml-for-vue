<template>
    <div id="app">
        <p class="red">
            {{hi}}
        </p>
        <hr>
        <div class="stage">
            <swiper
                :indicatorDots="indicatorDots" :autoplay="autoplay" :circular="circular" :vertical="vertical"
                :interval="interval" :duration="duration" :previousMargin="previousMargin" :nextMargin="nextMargin">
                <swiper-item v-for="(item, idx) in background" :key="idx">
                    <div class="swiper-item">{{item}}</div>
                </swiper-item>
            </swiper>
        </div>
    </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      hi: 'hello',
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      circular: false,
      interval: 2000,
      duration: 500,
      previousMargin: 0,
      nextMargin: 0
    }
  }
}
</script>
<style>
.stage {
  width: 375px;
  box-shadow: 0 0 4px;
  min-height: 600px;
}
</style>

