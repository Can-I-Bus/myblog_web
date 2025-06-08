<template>
    <div class="article_nav_wrap" :class="{ 'has-content': hasContent, 'no-content': !hasContent }">
        <div class="article_nav">
            <!-- 仅在最外层判断空状态 -->
            <template v-if="isRoot">
                <template v-if="hasContent">
                    <div v-for="item in props.toc" :key="item.id" class="article_nav_item" :class="{ active: activeId === item.id }">
                        <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id)">
                            {{ item.name }}
                        </a>
                        <div v-if="item?.children">
                            <BlogNav :toc="item.children" :active-id="activeId" :is-root="false" @handleClick="$emit('handleClick', $event)" />
                        </div>
                    </div>
                </template>
                <div class="empty-state" v-else>
                    <div class="empty-icon">📋</div>
                    <div class="empty-text">暂无目录</div>
                </div>
            </template>

            <!-- 子组件始终不显示空状态 -->
            <template v-else>
                <div v-for="item in props.toc" :key="item.id" class="article_nav_item" :class="{ active: activeId === item.id }">
                    <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id)">
                        {{ item.name }}
                    </a>
                    <div v-if="item?.children">
                        <BlogNav :toc="item.children" :active-id="activeId" :is-root="false" @handleClick="$emit('handleClick', $event)" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Empty from '@/components/empty/index.vue';

const props = defineProps({
    toc: {
        type: Array,
        default: () => [],
    },
    activeId: String,
    isRoot: {
        // 新增属性标识是否根节点
        type: Boolean,
        default: true,
    },
});

const emits = defineEmits(['handleClick']);

// 计算是否显示内容（仅根组件需要判断）
const hasContent = computed(() => props.toc.length > 0);
// 平滑滚动到指定标题
const scrollToHeading = (id) => {
    emits('handleClick', id);
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        history.replaceState(null, null, `#${id}`);
    }
};
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.article_nav_wrap {
    box-sizing: border-box;
    height: 100%;

    // 有内容时允许滚动
    &.has-content {
        overflow-y: auto;
    }

    // 无内容时禁用滚动
    &.no-content {
        overflow-y: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .article_nav_item {
        margin-bottom: 8px;
        border-radius: 6px;
        transition: all 0.3s ease;

        > a {
            display: block;
            padding: 12px 16px;
            color: var(--textMainColor);
            text-decoration: none;
            font-size: 14px;
            line-height: 1.5;
            border-radius: 6px;
            border-left: 3px solid transparent;
            transition: all 0.3s ease;
            position: relative;

            &:hover {
                background-color: var(--thirdBgColor);
                color: var(--textHoverColor);
                border-left-color: var(--textHoverColor);
            }

            // 限制文本行数
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;

            @include respond-to('small') {
                padding: 14px 18px;
                font-size: 15px;
                -webkit-line-clamp: 3;
            }
        }

        &.active > a {
            background-color: var(--textHoverColor);
            color: white;
            border-left-color: var(--textHoverColor);
            font-weight: 500;

            &::before {
                content: '';
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 6px;
                background-color: white;
                border-radius: 50%;
            }
        }

        // 子级目录样式
        > div {
            margin-left: 16px;
            border-left: 2px solid var(--borderMainColor);
            padding-left: 12px;
            margin-top: 8px;

            .article_nav_item {
                > a {
                    font-size: 13px;
                    padding: 8px 12px;

                    @include respond-to('small') {
                        font-size: 14px;
                        padding: 10px 14px;
                    }
                }

                &.active > a {
                    background-color: rgba(var(--textHoverColorRGB), 0.1);
                    color: var(--textHoverColor);
                    border-left-color: var(--textHoverColor);
                    font-weight: normal;

                    &::before {
                        background-color: var(--textHoverColor);
                    }
                }
            }
        }
    }

    // 空状态样式
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--textSecColor);
        text-align: center;

        .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-text {
            font-size: 14px;
            line-height: 1.5;
        }
    }
}
</style>
