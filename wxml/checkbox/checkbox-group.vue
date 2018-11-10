<template>
    <div class="checkbox-group" @change="checkboxChange" @click="detectChange">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'checkbox-group',
    props: ['change'],
    methods: {
        checkboxChange(e) {
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
