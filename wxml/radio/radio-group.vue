<template>
    <div class="radio-group" @change="radioChange" @click="detectChange">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'radio-group',
    props: ['change'],
    methods: {
        radioChange(e) {
            if (typeof this.change !== 'function') return
            console.group()
            console.error('----Group 标签的 @change 事件未支持----')
            console.groupEnd()
            this.change(e)
        },
        detectChange() {
        }
    }
}
</script>
