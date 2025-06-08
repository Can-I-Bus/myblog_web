<template>
    <div :class="['header_wrap', isScroll ? 'border_bottom' : '']">
        <div class="header_left">
            <Signature :width="'80pt'" :height="'20pt'" />
        </div>
        <div class="header_right">
            <div class="header_nav">
                <router-link :class="['nav_item', { active: route.fullPath === '/home' }]" to="/home">首页</router-link>
                <router-link :class="['nav_item', { active: route.fullPath === '/about' }]" to="/about">关于我</router-link>
                <router-link :class="['nav_item', { active: route.fullPath === '/blog' }]" to="/blog">博客</router-link>
                <router-link :class="['nav_item', { active: route.fullPath === '/demo' }]" to="/demo">一些demo</router-link>
                <router-link :class="['nav_item', { active: route.fullPath === '/message' }]" to="/message">留言墙</router-link>
            </div>
            <div class="header_actions">
                <ThemeSwitch />
                <Icon class="icon" type="github" fontSize="24px" />
                <div class="avatar_container">
                    <img src="/avatar.png" alt="头像" class="avatar" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Signature from '../signature/index.vue';
import Icon from '../icon/index.vue';
import ThemeSwitch from '../themeSwitch/index.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
const route = useRoute();
const isScroll = ref(false);

const scroll = () => {
    if (window.scrollY > 10) {
        isScroll.value = true;
    } else {
        isScroll.value = false;
    }
};

onMounted(() => {
    window.addEventListener('scroll', scroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scroll);
});
</script>
<style scoped lang="scss">
@use '../../css/media.scss' as *;
@use '../../css/mixin.scss' as *;

.header_wrap {
    width: 100%;
    position: fixed;
    top: 0;
    height: 64px;
    padding: 0 32px;
    background-color: var(--mainBgColor);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
    z-index: 9;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    @include respond-to('small') {
        display: none;
    }
}

.header_left {
    display: flex;
    align-items: center;
}

.header_right {
    display: flex;
    align-items: center;
    gap: 30px;
}

.header_nav {
    display: flex;
    align-items: center;
    gap: 24px;

    .nav_item {
        position: relative;
        color: var(--textMainColor);
        font-size: 15px;
        padding: 6px 0;
        opacity: 0.8;
        transition: all 0.3s;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--textHoverColor);
            transition: all 0.3s;
        }

        &:hover {
            color: var(--textHoverColor);
            opacity: 1;

            &::after {
                width: 100%;
            }
        }

        &.active {
            color: var(--textHoverColor) !important;
            opacity: 1;

            &::after {
                width: 100%;
            }
        }
    }
}

.header_actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .icon {
        color: var(--textSecColor);
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            color: var(--textMainColor);
        }
    }

    .avatar_container {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid transparent;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            border-color: var(--textHoverColor);
        }

        .avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

.border_bottom {
    border-bottom: 1px solid var(--borderMainColor);
}
</style>
