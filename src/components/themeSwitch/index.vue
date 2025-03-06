<template>
    <div class="theme_switch_wrap" @click="handleClick($event)">
        <Icon
            class="theme_switch_icon"
            :type="iconName"
            :fontSize="theme === 'dark' ? '20px' : '24px'"
        />
    </div>
</template>

<script setup>
import Icon from '../icon/index.vue'
import useTheme from '@/hooks/useTheme'
import { ref, onMounted, computed } from 'vue'
const { theme, toggleTheme } = useTheme()

// 动态计算图标的名称
const iconName = computed(() => {
    return theme.value === 'dark' ? 'qingtian' : 'heiye'
})

// 切换主题
const handleClick = (e) => {
    const isDark = theme.value === 'dark'
    const transition = document.startViewTransition(() => {
        toggleTheme()
    })
    transition.ready.then(() => {
        const x = e.clientX
        const y = e.clientY

        const radius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        )
        const clipPath = [
            `circle(0 at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
            {
                clipPath: isDark ? clipPath.reverse() : clipPath,
            },
            {
                duration: 500,
                easing: 'ease-in',
                pseudoElement: isDark
                    ? '::view-transition-old(root)'
                    : '::view-transition-new(root)',
            }
        )
    })
}
</script>

<style scoped lang='scss'>
@use '@/css/mixin.scss' as *;
$size: 30px;

.theme_switch_wrap {
    @include flexCenter();
    position: relative;
    height: $size;
    width: $size;
    border-radius: 50%;
    border: 1px solid var(--borderFourthColor);
    box-shadow: var(--shadowMain);
    transition: 0.2s;
    &:hover {
        border-color: var(--textHoverColor);
    }
    .theme_switch_icon {
        color: var(--textMainColor);
    }
}
</style>
