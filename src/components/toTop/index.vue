<template>
    <Transition name="fade">
        <div v-if="showButton" class="toTop_wrap" @click="toTop" :class="{ mobile: isMobile }">
            <div class="toTop_icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showButton = ref(false);
const isMobile = ref(false);

const checkScroll = () => {
    showButton.value = window.scrollY > 300;
};

const checkDevice = () => {
    isMobile.value = window.innerWidth <= 767;
};

const toTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

onMounted(() => {
    checkDevice();
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkDevice);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', checkScroll);
    window.removeEventListener('resize', checkDevice);
});
</script>

<style scoped lang="scss">
@use '../../css/media.scss' as *;

.toTop_wrap {
    position: fixed;
    left: 30px;
    bottom: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--mainBgColor);
    color: var(--textMainColor);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid var(--borderMainColor);

    &.mobile {
        left: 20px;
        bottom: 120px;
        width: 40px;
        height: 40px;

        @include respond-to('small') {
            bottom: 100px; // 避免与移动端浮动按钮重叠
        }
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        color: var(--textHoverColor);
        border-color: var(--textHoverColor);
    }

    &:active {
        transform: translateY(0);
    }
}

.toTop_icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 24px;
        height: 24px;

        .mobile & {
            width: 20px;
            height: 20px;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
