<template>
    <div class="blog_category_wrap">
        <div v-for="(item, index) in categoryList" :key="item.id" class="blog_category_item" :style="{ '--item-index': index }" @click.stop="handleItemClick(item.id)">
            <div class="category_content">
                <div class="category_icon">
                    <img :src="item.icon" alt="分类图标" />
                </div>
                <div class="category_info">
                    <span class="category_name">{{ item.name }}</span>
                    <div class="category_description" v-if="item.description">
                        <span>{{ item.description }}</span>
                    </div>
                </div>
                <div class="category_stats" v-if="item.article_count">
                    <span class="stats_number">{{ item.article_count }}</span>
                </div>
            </div>
            <div v-if="item.children && item.children.length > 0" class="children_wrap">
                <BlogCategory :categoryList="item.children" @handleClick="handleItemClick" />
            </div>
        </div>
    </div>
</template>

<script setup name="BlogCategory">
const emits = defineEmits(['handleClick']);
const props = defineProps({
    categoryList: {
        type: Array,
        default: () => [],
    },
});

const handleItemClick = (id) => {
    emits('handleClick', id);
};
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.blog_category_wrap {
    max-height: calc(100vh - 64px - 64px - 3vh - 30px);

    @include respond-to('small') {
        max-height: none;
        margin-bottom: 30px;
    }
}

.blog_category_item {
    margin-bottom: 10px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
    animation-delay: calc(var(--item-index) * 0.08s);

    .category_content {
        display: flex;
        align-items: center;
        padding: 16px 18px;
        background-color: var(--mainBgColor);
        border: 1px solid var(--borderMainColor);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        @include respond-to('small') {
            padding: 18px 20px;
        }

        &:hover {
            background-color: rgba(var(--textHoverColorRGB), 0.08);
            border-color: rgba(var(--textHoverColorRGB), 0.4);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
        }

        &:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
    }

    .category_icon {
        margin-right: 14px;

        img {
            width: 22px;
            height: 22px;
            border-radius: 5px;
            transition: transform 0.3s ease;

            @include respond-to('small') {
                width: 24px;
                height: 24px;
            }
        }

        .category_content:hover & img {
            transform: scale(1.05);
        }
    }

    .category_info {
        flex: 1;

        .category_name {
            display: block;
            color: var(--textMainColor);
            font-size: 15px;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 2px;
            transition: color 0.3s ease;

            @include respond-to('small') {
                font-size: 16px;
            }
        }

        .category_description {
            span {
                font-size: 12px;
                color: var(--textSecColor);
                opacity: 0.8;
                line-height: 1.3;

                @include respond-to('small') {
                    font-size: 13px;
                }
            }
        }

        .category_content:hover & .category_name {
            color: var(--textHoverColor);
        }
    }

    .category_stats {
        .stats_number {
            background-color: var(--thirdBgColor);
            color: var(--textSecColor);
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 12px;
            min-width: 24px;
            text-align: center;
            transition: all 0.3s ease;

            @include respond-to('small') {
                font-size: 13px;
                padding: 5px 10px;
            }
        }

        .category_content:hover & .stats_number {
            background-color: var(--textHoverColor);
            color: white;
        }
    }

    // 子级分类样式
    .children_wrap {
        margin-left: 18px;
        margin-top: 8px;
        padding-left: 18px;
        position: relative;

        @include respond-to('small') {
            margin-left: 20px;
            padding-left: 20px;
        }

        // 使用圆点连接线
        &::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 0;
            bottom: 0;
            width: 1px;
            background: repeating-linear-gradient(to bottom, var(--borderMainColor) 0px, var(--borderMainColor) 4px, transparent 4px, transparent 8px);
        }

        // 添加连接点
        &::after {
            content: '';
            position: absolute;
            left: -9px;
            top: 20px;
            width: 6px;
            height: 6px;
            background-color: var(--borderMainColor);
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }

        &:hover::after {
            background-color: var(--textHoverColor);
        }

        // 子级分类项样式调整
        .blog_category_item {
            .category_content {
                background-color: var(--secBgColor);
                border: 1px solid rgba(var(--borderMainColorRGB), 0.6);
                padding: 12px 16px;

                &:hover {
                    background-color: rgba(var(--textHoverColorRGB), 0.12);
                    border-color: rgba(var(--textHoverColorRGB), 0.4);
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
                }
            }

            .category_icon {
                margin-right: 12px;

                img {
                    width: 18px;
                    height: 18px;

                    @include respond-to('small') {
                        width: 20px;
                        height: 20px;
                    }
                }
            }

            .category_info .category_name {
                font-size: 13px;
                font-weight: 400;

                @include respond-to('small') {
                    font-size: 14px;
                }
            }

            .category_stats .stats_number {
                font-size: 11px;
                padding: 3px 6px;

                @include respond-to('small') {
                    font-size: 12px;
                    padding: 4px 8px;
                }
            }
        }
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
