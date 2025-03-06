<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script setup>
import { ref, onMounted, defineProps, defineEmits, defineExpose } from 'vue'
const emits = defineEmits([''])
const props = defineProps({})
onMounted(() => {})
defineExpose({})
</script>
<style lang="scss">
html {
    background-color: var(--mainBgColor);
}
</style>
<style scoped lang='scss'>
#app {
    background-color: var(--mainBgColor);
}
</style>