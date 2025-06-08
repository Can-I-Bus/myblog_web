<template>
    <div class="app_layout">
        <Header />
        <MobileHeader />
        <div class="app_layout_content">
            <RouterView />
        </div>
        <ToTop />
    </div>
</template>
<script setup>
import Header from '@/components/header/index.vue';
import MobileHeader from '@/components/header/MobileHeader.vue';
import ToTop from '@/components/toTop/index.vue';
</script>
<style scoped lang="scss">
@use '@/css/media.scss' as *;

.app_layout_content {
    padding-top: 64px;
}
</style>
