<template>
    <input type="checkbox" :value="value" :checked="checked">
</template>

<script>
export default {
    name: 'checkbox',
    props: {
        value: {
            default: []
        },
        checked: {
            default: false
        }
    }
}
</script>
