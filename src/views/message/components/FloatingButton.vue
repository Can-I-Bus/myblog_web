<template>
    <div class="floating-button" @click="$emit('click')" :class="{ active: isActive }">
        <div class="button-icon">
            <div class="icon-line horizontal"></div>
            <div class="icon-line vertical"></div>
        </div>
        <span class="button-tooltip" v-if="showTooltip">发布留言</span>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['click']);
const showTooltip = ref(false);
let tooltipTimer = null;

onMounted(() => {
    // 延迟显示工具提示，给用户提示
    tooltipTimer = setTimeout(() => {
        showTooltip.value = true;
        // 3秒后隐藏提示
        setTimeout(() => {
            showTooltip.value = false;
        }, 3000);
    }, 1000);
});

onBeforeUnmount(() => {
    if (tooltipTimer) {
        clearTimeout(tooltipTimer);
    }
});
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;

.floating-button {
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: var(--textHoverColor);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 99;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    @include respond-to('small') {
        right: 20px;
        bottom: 20px;
        width: 48px;
        height: 48px;
    }

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(0);
    }

    &.active .button-icon {
        transform: rotate(45deg);
    }
}

.button-icon {
    position: relative;
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;

    @include respond-to('small') {
        width: 18px;
        height: 18px;
    }
}

.icon-line {
    position: absolute;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;

    &.horizontal {
        width: 100%;
        height: 2px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
    }

    &.vertical {
        height: 100%;
        width: 2px;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
    }
}

.button-tooltip {
    position: absolute;
    top: -40px;
    right: 0;
    background-color: var(--mainBgColor);
    color: var(--textMainColor);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--borderMainColor);
    opacity: 1;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 100;

    &::after {
        content: '';
        position: absolute;
        bottom: -6px;
        right: 20px;
        width: 12px;
        height: 12px;
        background-color: var(--mainBgColor);
        border-right: 1px solid var(--borderMainColor);
        border-bottom: 1px solid var(--borderMainColor);
        transform: rotate(45deg);
    }

    @include respond-to('small') {
        right: -80px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        padding: 4px 8px;

        &::after {
            bottom: auto;
            right: -4px;
            top: 50%;
            left: -4px;
            border: none;
            border-left: 1px solid var(--borderMainColor);
            border-bottom: 1px solid var(--borderMainColor);
            transform: translateY(-50%) rotate(45deg);
        }
    }
}
</style>
