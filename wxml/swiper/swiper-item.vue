<template>
    <div class="paas-swiper__item">
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'PaaSSwiperItem',
  props: {
    itemId: {
      type: String
    }
  }
}
</script>
