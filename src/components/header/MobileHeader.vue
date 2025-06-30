<template>
    <div class="mobile-header">
        <div class="mobile-header-container" :class="{ 'border-bottom': isScroll }">
            <div class="logo-container">
                <Signature :width="'60pt'" :height="'15pt'" @click="router.push('/home')" />
            </div>
            <div class="menu-button" @click="toggleMenu">
                <div class="menu-icon">
                    <span :class="{ open: menuOpen }"></span>
                    <span :class="{ open: menuOpen }"></span>
                    <span :class="{ open: menuOpen }"></span>
                </div>
            </div>
        </div>

        <Transition name="slide-fade">
            <div class="mobile-menu" v-if="menuOpen">
                <div class="mobile-menu-container">
                    <div class="menu-header">
                        <img src="/avatar.png" alt="头像" class="menu-avatar" />
                        <h3>MAX的博客</h3>
                    </div>
                    <div class="menu-links">
                        <router-link class="menu-item" to="/home" @click="closeMenu" :class="{ active: route.path === '/home' }" active-class="" exact-active-class="">首页</router-link>
                        <router-link class="menu-item" to="/about" @click="closeMenu" :class="{ active: route.path === '/about' }" active-class="" exact-active-class="">关于我</router-link>
                        <router-link
                            class="menu-item"
                            to="/blog"
                            @click="closeMenu"
                            :class="{ active: route.path === '/blog' || route.path.startsWith('/blog/') }"
                            active-class=""
                            exact-active-class=""
                            >博客</router-link
                        >
                        <router-link class="menu-item" to="/demo" @click="closeMenu" :class="{ active: route.path === '/demo' }" active-class="" exact-active-class="">一些demo</router-link>
                        <router-link class="menu-item" to="/games" @click="closeMenu" :class="{ active: route.path === '/games' || route.path === '/tictactoe' }" active-class="" exact-active-class=""
                            >一些游戏</router-link
                        >
                        <router-link class="menu-item" to="/message" @click="closeMenu" :class="{ active: route.path === '/message' }" active-class="" exact-active-class="">留言墙</router-link>
                    </div>
                    <div class="menu-footer">
                        <ThemeSwitch />
                        <Icon class="icon" type="github" fontSize="24px" @click="handleToGithub" />
                    </div>
                </div>
            </div>
        </Transition>

        <div class="mobile-menu-backdrop" v-if="menuOpen" @click="closeMenu"></div>
    </div>
</template>

<script setup>
import Signature from '../signature/index.vue';
import Icon from '../icon/index.vue';
import ThemeSwitch from '../themeSwitch/index.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isScroll = ref(false);
const menuOpen = ref(false);

const scroll = () => {
    if (window.scrollY > 10) {
        isScroll.value = true;
    } else {
        isScroll.value = false;
    }
};

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
    if (menuOpen.value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};

const closeMenu = () => {
    menuOpen.value = false;
    document.body.style.overflow = '';
};

onMounted(() => {
    window.addEventListener('scroll', scroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scroll);
    document.body.style.overflow = '';
});

const handleToGithub = () => {
    window.open('https://github.com/Can-I-Bus', '_blank');
};
</script>

<style scoped lang="scss">
@use '../../css/media.scss' as *;
@use '../../css/mixin.scss' as *;

.mobile-header {
    display: none;

    @include respond-to('small') {
        display: block;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
    }
}

.mobile-header-container {
    height: 64px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--mainBgColor);
    transition: all 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.border-bottom {
    border-bottom: 1px solid var(--borderMainColor);
}

.logo-container {
    display: flex;
    align-items: center;
}

.menu-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.3s;
}

.menu-icon {
    width: 24px;
    height: 20px;
    position: relative;

    span {
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background: var(--textMainColor);
        border-radius: 2px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: 0.25s ease-in-out;

        &:nth-child(1) {
            top: 0px;
        }

        &:nth-child(2) {
            top: 9px;
        }

        &:nth-child(3) {
            top: 18px;
        }

        &.open {
            &:nth-child(1) {
                top: 9px;
                transform: rotate(135deg);
            }

            &:nth-child(2) {
                opacity: 0;
                left: -60px;
            }

            &:nth-child(3) {
                top: 9px;
                transform: rotate(-135deg);
            }
        }
    }
}

.mobile-menu {
    position: fixed;
    top: 64px;
    right: 0;
    bottom: 0;
    width: 75%;
    max-width: 300px;
    background-color: var(--mainBgColor);
    z-index: 999;
    overflow-y: auto;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    border-left: 1px solid var(--borderMainColor);
}

.mobile-menu-backdrop {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    backdrop-filter: blur(3px);
}

.mobile-menu-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.menu-header {
    padding: 20px;
    border-bottom: 1px solid var(--borderMainColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .menu-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin-bottom: 12px;
        border: 2px solid var(--textHoverColor);
        padding: 2px;
    }

    h3 {
        margin: 0;
        font-size: 18px;
        color: var(--textMainColor);
        font-weight: normal;
    }
}

.menu-links {
    flex: 1;
    padding: 15px 0;

    .menu-item {
        display: block;
        padding: 15px 20px;
        color: var(--textMainColor);
        font-size: 16px;
        transition: all 0.3s;
        border-left: 3px solid transparent;

        &.active {
            background-color: var(--thirdBgColor);
            color: var(--textHoverColor);
            border-left-color: var(--textHoverColor);
        }

        // 只在支持hover的设备上启用hover效果
        @media (hover: hover) {
            &:hover {
                background-color: var(--thirdBgColor);
                color: var(--textHoverColor);
                border-left-color: var(--textHoverColor);
            }
        }

        // 在触摸设备上使用active伪类代替hover
        @media (hover: none) {
            &:active {
                background-color: var(--secBgColor);
                transition: all 0.1s;
            }
        }
    }
}

.menu-footer {
    padding: 20px;
    border-top: 1px solid var(--borderMainColor);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icon {
        color: var(--textSecColor);
        transition: 0.3s;
        cursor: pointer;

        &:hover {
            color: var(--textMainColor);
        }
    }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
