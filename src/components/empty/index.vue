<template>
    <div class="empty_wrap">
        <p :style="{ fontSize: descFontSize }">{{ emptyText }}</p>
        <Icon type="empty" :fontSize="fontSize" />
    </div>
</template>
<script setup>
import Icon from '../icon/index.vue';
import { defineProps } from 'vue';
const props = defineProps({
    emptyText: {
        type: String,
        default: '目前还是空的...',
    },
    fontSize: {
        type: String,
        default: '20px',
    },
    descFontSize: {
        type: String,
        default: '20px',
    },
});
</script>
<style scoped lang="scss">
@use '../../css/mixin.scss' as *;
.empty_wrap {
    @include flexCenter();
    padding: 20px;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 12px;
    background-color: var(--secBgColor);
    p {
        margin-bottom: 20px;
        color: var(--textSecColor);
        text-align: center;
    }
}
</style>
