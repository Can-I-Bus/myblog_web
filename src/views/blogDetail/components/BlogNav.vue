<template>
    <div class="article_nav_wrap">
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
                <Empty style="height: calc(100vh - 160px)" v-else :desc-font-size="'14px'" />
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
.article_nav_wrap {
    box-sizing: border-box;
    position: sticky;
    top: 0;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    padding-left: 16px;
    .article_nav_item {
        line-height: 1.5;
        transition: all 0.3s;

        > a {
            color: var(--textMainColor);
            text-decoration: none;
            display: block;
            margin-bottom: 14px;
            font-size: 14px;
            opacity: 0.8;
            &:hover {
                color: var(--textHoverColor);
            }
        }

        &.active > a {
            color: var(--textHoverColor);
        }
    }
}
</style>
