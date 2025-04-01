<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue';
import useTheme from '@/hooks/useTheme';
const { toogleLink } = useTheme();
const props = defineProps({});
onMounted(() => {
    toogleLink();
});
</script>
<style lang="scss">
html {
    background-color: var(--mainBgColor);
}
</style>
<style scoped lang="scss">
#app {
    background-color: var(--mainBgColor);
}
</style>
