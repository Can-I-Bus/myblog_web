<template>
    <div>
        <div class="article_list_title">
            <img :src="currCategoryInfo?.icon" />
            <span>{{ currCategoryInfo?.name }}</span>
        </div>
        <div class="article_list">
            <div class="article_item" :style="{ color: item.id === currArticle.id ? 'var(--textHoverColor)' : '' }" v-for="item in articleList" :key="item.id" @click="emits('handleClick', item)">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    articleList: {
        type: Array,
        default: () => [],
    },
    currArticle: {
        type: Object,
        default: () => {},
    },
    currCategoryInfo: {
        type: Object,
        default: () => {},
    },
});

const emits = defineEmits(['handleClick']);
</script>

<style lang="scss" scoped>
.article_list_title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
    }
    span {
        font-size: 20px;
        font-weight: bold;
        color: var(--textMainColor);
    }
}
.article_list {
    margin-top: 10px;
    .article_item {
        cursor: pointer;
        margin-top: 10px;
        font-size: 14px;
        color: var(--textMainColor);
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
            color: var(--textHoverColor);
        }
    }
}
</style>
