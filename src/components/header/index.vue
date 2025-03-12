<template>
    <div :class="['header_wrap', isScroll ? 'border_bottom' : '', 'fz14']">
        <Signature :width="'80pt'" :height="'20pt'" />
        <div class="header_right">
            <div class="header_nav">
                <img src="../../../public/avatar.png" />
                <router-link
                    :class="[
                        'nav_item',
                        { active: route.fullPath === '/home' },
                    ]"
                    to="/home"
                    >首页</router-link
                >
                <router-link
                    :class="[
                        'nav_item',
                        { active: route.fullPath === '/about' },
                    ]"
                    to="/about"
                    >关于我</router-link
                >
                <router-link
                    :class="[
                        'nav_item',
                        { active: route.fullPath === '/blog' },
                    ]"
                    to="/blog"
                    >博客</router-link
                >
                <router-link
                    :class="[
                        'nav_item',
                        { active: route.fullPath === '/resource' },
                    ]"
                    to="/resource"
                >
                    一些资源
                </router-link>
                <router-link
                    :class="[
                        'nav_item',
                        { active: route.fullPath === '/demo' },
                    ]"
                    to="/demo"
                >
                    一些demo
                </router-link>
                <router-link
                    :class="[
                        'nav_item',
                        { active: route.fullPath === '/message' },
                    ]"
                    to="/message"
                >
                    留言墙
                </router-link>
            </div>
            <ThemeSwitch class="before_line" />
            <Icon class="icon before_line" type="github" fontSize="28px" />
        </div>
    </div>
</template>
<script setup>
import Signature from '../signature/index.vue'
import Icon from '../icon/index.vue'
import ThemeSwitch from '../themeSwitch/index.vue'
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const route = useRoute()
const isScroll = ref(false)

const scroll = () => {
    if (window.scrollY > 10) {
        isScroll.value = true
    } else {
        isScroll.value = false
    }
}

onMounted(() => {
    window.addEventListener('scroll', scroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scroll)
})
</script>
<style scoped lang='scss'>
@use '../../css/media.scss' as *;
@use '../../css/mixin.scss' as *;
$gap: 30px;
.header_wrap {
    width: 100vw;
    position: fixed;
    top: 0;
    height: 64px;
    padding: 0 32px;
    justify-content: space-between;
    transition: 0.3s;
    z-index: 9;

    @include flexAlianCenter();
    @include respond-to('small') {
        display: none;
    }
    .header_right {
        @include flexAlianCenter();
        gap: $gap;
        .header_nav {
            @include flexAlianCenter();
            gap: $gap;
            > img {
                height: 30px;
                width: 30px;
                border-radius: 50%;
            }
            .nav_item {
                color: var(--textMainColor);
                opacity: 0.8;
                transition: 0.2s;
                &:hover {
                    color: var(--textHoverColor);
                }
            }
            .active.nav_item {
                color: var(--textHoverColor) !important;
            }
        }
        .icon {
            color: var(--textSecColor);
            transition: 0.3s;
            &:hover {
                color: var(--textMainColor);
            }
        }
    }
}

.border_bottom {
    border-bottom: 1px solid var(--borderMainColor);
}
</style>