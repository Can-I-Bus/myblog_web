<template>
    <div class="article-list-container">
        <div class="category-header">
            <img :src="currCategoryInfo?.icon" alt="分类图标" />
            <div class="category-info">
                <h3>{{ currCategoryInfo?.name }}</h3>
                <span>{{ articleList.length }} 篇文章</span>
            </div>
        </div>
        <div class="article-list">
            <div class="article-item" v-for="item in articleList" :key="item.id" @click="emits('handleClick', item)" :class="{ active: item.id === currArticle.id }">
                <div class="article-item-content">
                    <h4>{{ item.title }}</h4>
                    <div class="article-meta">
                        <span class="date">{{ formatDate(item.created_at) }}</span>
                        <span class="views">{{ item.scan_number }} 次阅读</span>
                    </div>
                </div>
                <div class="article-item-indicator"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

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

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
    });
};
</script>

<style lang="scss" scoped>
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.article-list-container {
    height: 100%;
}

.category-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--borderMainColor);

    img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        object-fit: cover;
    }

    .category-info {
        flex: 1;

        h3 {
            margin: 0 0 4px;
            font-size: 18px;
            font-weight: 600;
            color: var(--textMainColor);

            @include respond-to('small') {
                font-size: 16px;
            }
        }

        span {
            font-size: 12px;
            color: var(--textSecColor);
        }
    }
}

.article-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.article-item {
    position: relative;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:hover {
        background-color: var(--thirdBgColor);
        border-color: var(--borderMainColor);

        .article-item-indicator {
            opacity: 0.5;
        }
    }

    &.active {
        background-color: var(--textHoverColor);
        border-color: var(--textHoverColor);

        .article-item-content {
            h4 {
                color: white;
            }

            .article-meta span {
                color: rgba(255, 255, 255, 0.8);
            }
        }

        .article-item-indicator {
            opacity: 1;
            background-color: white;
        }
    }

    .article-item-content {
        h4 {
            margin: 0 0 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--textMainColor);
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;

            @include respond-to('small') {
                font-size: 15px;
                -webkit-line-clamp: 3;
            }
        }

        .article-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;

            span {
                font-size: 11px;
                color: var(--textSecColor);

                @include respond-to('small') {
                    font-size: 12px;
                }
            }

            .views {
                opacity: 0.8;
            }
        }
    }

    .article-item-indicator {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background-color: var(--textHoverColor);
        border-radius: 2px;
        opacity: 0;
        transition: all 0.3s ease;
    }
}
</style>
