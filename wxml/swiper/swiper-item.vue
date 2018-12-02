<template>
    <div class="swiper-item" :style="itemStyle">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'swiper-item',
        props: {
            itemStyle: Object,
            itemId: [Number, String]
        }
    }
</script>
<style scoped>
    .swiper-item {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center center;
        position: relative;
        overflow: hidden;
        float: left;
    }

    .swiper-item.active .animated {
        animation-fill-mode: both;
        opacity: 1;
    }

    .swiper-item:not(.active) .animated {
        animation: none;
        opacity: 0;
    }

</style>
