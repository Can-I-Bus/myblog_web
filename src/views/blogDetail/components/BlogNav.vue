<template>
    <div class="article_nav_wrap">
        <div class="article_nav">
            <div v-for="item in props.toc" :key="item.id" class="article_nav_item" :class="{ active: activeId === item.id }">
                <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id)">
                    {{ item.name }}
                </a>
                <div v-if="item?.children">
                    <BlogNav :toc="item.children" :active-id="activeId" @handleClick="scrollToHeading" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    toc: {
        type: Array,
        default: () => [],
    },
    activeId: String,
});

const emits = defineEmits(['handleClick']);

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
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding-left: 16px;

    .article_nav_item {
        margin-bottom: 8px;
        line-height: 1.5;
        transition: all 0.3s;

        > a {
            color: var(--textMainColor);
            text-decoration: none;
            display: block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 15px;

            &:hover {
                color: var(--textHoverColor);
            }
        }

        &.active > a {
            color: var(--textHoverColor);
        }

        > div {
            padding-left: 8px;
            border-left: 1px dashed var(--border-color);
            margin-top: 4px;
            font-size: 14px;
        }
    }
}
</style>
