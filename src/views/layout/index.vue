<template>
    <div class="app_layout">
        <Header />
        <div class="app_layout_content">
            <RouterView />
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/header/index.vue'
</script>
<style scoped lang='scss'>
.app_layout_content {
    padding-top: 64px;
}
</style>