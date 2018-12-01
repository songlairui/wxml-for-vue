<template>
    <div class="swiper-item" :style="itemStyle">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'swiper-item',
        props: {
            itemStyle: Object
        }
    }
</script>
