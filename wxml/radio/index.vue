<template>
    <input type="radio" :value="value" :checked="checked">
</template>

<script>
export default {
    name: 'radio',
    props: {
        value: {
            default: ''
        },
        checked: {
            default: false
        }
    }
}
</script>
