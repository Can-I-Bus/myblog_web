<template>
    <div class="article_item" @click="handleClick">
        <div class="article_item_left">
            <h4>{{ title }}</h4>
            <p>{{ description }}</p>
            <div class="article_item_left_bottom">
                <div class="article_item_left_bottom_info">
                    <div>
                        <svg t="1745652418577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" width="200" height="200">
                            <path
                                d="M512 619.789474c-59.284211 0-107.789474-48.505263-107.789474-107.789474s48.505263-107.789474 107.789474-107.789474 107.789474 48.505263 107.789474 107.789474-48.505263 107.789474-107.789474 107.789474z m0-80.842106c16.168421 0 26.947368-10.778947 26.947368-26.947368s-10.778947-26.947368-26.947368-26.947368-26.947368 10.778947-26.947368 26.947368 10.778947 26.947368 26.947368 26.947368z"
                                fill="#999999"
                                p-id="2605"></path>
                            <path
                                d="M509.305263 781.473684C231.747368 781.473684 80.842105 512 80.842105 512S234.442105 242.526316 512 242.526316c280.252632 0 431.157895 269.473684 431.157895 269.473684s-153.6 266.778947-433.852632 269.473684c2.694737 0 0 0 0 0z m2.694737-80.842105c167.073684 0 282.947368-123.957895 334.147368-188.631579-48.505263-64.673684-164.378947-188.631579-334.147368-188.631579-167.073684 0-282.947368 123.957895-334.147368 188.631579 48.505263 64.673684 164.378947 188.631579 334.147368 188.631579z"
                                fill="#999999"
                                p-id="2606"></path>
                        </svg>
                        <span>{{ scanNumber }}</span>
                    </div>
                    <div>
                        <svg t="1745652816519" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3904" width="200" height="200">
                            <path
                                d="M546.833384 804.54212L61.548205 1020.232549c-14.628039 6.509477-31.669703 4.388412-44.396097-5.485515a44.688658 44.688658 0 0 1-8.045421-62.169164l125.654851-164.931134A219.420578 219.420578 0 0 1 0.037303 585.121542V219.420578a219.420578 219.420578 0 0 1 219.420578-219.420578h731.401928a219.420578 219.420578 0 0 1 219.420578 219.420578v365.700964a219.420578 219.420578 0 0 1-219.420578 219.420578H546.833384zM292.598074 438.841157a73.140193 73.140193 0 1 0 0-146.280386 73.140193 73.140193 0 0 0 0 146.280386z m292.560771 0a73.140193 73.140193 0 1 0 0-146.280386 73.140193 73.140193 0 0 0 0 146.280386z m292.560771 0a73.140193 73.140193 0 1 0 0-146.280386 73.140193 73.140193 0 0 0 0 146.280386z"
                                fill="#CCCCCC"
                                p-id="3905"></path>
                        </svg>
                        <span>{{ commentNumber }}</span>
                    </div>
                </div>
                <div class="article_item_left_bottom_category">
                    <img :src="categoryIcon" />
                    <div>{{ categoryName }}</div>
                </div>
            </div>
        </div>
        <div class="article_item_right">
            <img :src="article.thumb" v-if="article.thumb && article.thumb !== ''" />
            <Empty v-else emptyText="暂无封面" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Empty from '@/components/empty/index.vue';
const router = useRouter();
const props = defineProps({
    article: {
        type: Object,
        default: () => {},
    },
});

const title = computed(() => {
    return props.article?.title ?? '暂无标题';
});

const description = computed(() => {
    return props.article?.description ?? '暂无描述';
});

const commentNumber = computed(() => {
    return props.article?.comment_number ?? 0;
});

const scanNumber = computed(() => {
    return props.article?.scan_number ?? 0;
});

const categoryIcon = computed(() => {
    return props.article?.category?.icon ?? '';
});
const categoryName = computed(() => {
    return props.article?.category?.name ?? '暂无分类';
});

const handleClick = () => {
    router.push({
        path: `/blog/${props.article.category.id}`,
        query: {
            article_id: props.article.id,
            name: props.article.category.name,
            icon: props.article.category.icon,
        },
    });
};
</script>

<style lang="scss" scoped>
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;
.article_item {
    @include flexAlianCenter();
    justify-content: space-between;
    border: 1px solid var(--borderFourthColor);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        border-color: var(--textHoverSecColor);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    &_left {
        width: 0;
        flex: 1;
        h4 {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 14px;
            color: var(--textMainColor);
        }
        > p {
            font-size: 14px;
            margin-bottom: 20px;
            color: var(--textFourthColor);
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        &_bottom {
            @include flexAlianCenter();
            justify-content: space-between;
            &_info {
                @include flexAlianCenter();
                > div {
                    @include flexAlianCenter();
                    margin-right: 20px;
                    font-size: 14px;
                    color: var(--textFourthColor);
                }
            }
            &_category {
                @include flexAlianCenter();
                margin-left: 20px;
                > img {
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;
                }
                > div {
                    font-size: 14px;
                    color: var(--textFourthColor);
                    background-color: var(--fourthBgColor);
                    border-radius: 8px;
                    padding: 5px 10px;
                    cursor: pointer;
                }
            }
        }
    }
    &_right {
        margin-left: 30px;
        width: 180px;
        height: 100px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            object-fit: cover;
            object-position: center;
        }
    }
}
.icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}
</style>
