<template>
    <div v-if="visible" class="preview-mask" @click.self="close">
        <span class="close-btn" @click="close">×</span>
        <img class="preview-img" :src="img" alt="预览" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
const props = defineProps({
    img: String,
    visible: Boolean,
});
const emits = defineEmits(['close']);

const close = () => {
    emits('close');
};

// 禁止滚动
onMounted(() => {
    if (props.visible) document.body.style.overflow = 'hidden';
});
watch(
    () => props.visible,
    (v) => {
        document.body.style.overflow = v ? 'hidden' : '';
    }
);
onBeforeUnmount(() => {
    document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.preview-mask {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s;
    overflow: auto;
    touch-action: none;
}
.close-btn {
    position: fixed;
    right: 24px;
    top: 20px;
    font-size: 40px;
    color: #fff;
    cursor: pointer;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
    &:hover {
        background: rgba(0, 0, 0, 0.6);
        color: #ff6666;
    }
    @media (max-width: 600px) {
        right: 10px;
        top: 10px;
        font-size: 32px;
        width: 40px;
        height: 40px;
    }
}
.preview-img {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    object-fit: contain;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    margin: 0;
    z-index: 9999;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    background-color: transparent;
    @media (max-width: 600px) {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
    }
}
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
