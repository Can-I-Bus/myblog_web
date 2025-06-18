<template>
    <div class="demo_item">
        <div class="demo_item_left">
            <h4>{{ title }}</h4>
            <p>{{ description }}</p>
            <div class="time_item">
                <span>创建时间: </span>
                <span>{{ parseTime(demo?.created_at) }}</span>
            </div>
            <div class="github_link">
                <Icon type="github" />
                <span>源码地址: </span>
                <a :href="github" target="_blank">{{ github }}</a>
            </div>
        </div>
        <div class="demo_item_right">
            <img :src="demo.thumb" v-if="demo?.thumb && demo?.thumb !== ''" @click="openPreview" style="cursor: zoom-in" />
            <Empty v-else emptyText="暂无封面" />
        </div>
        <Teleport to="body">
            <ImagePreview :img="previewImg" :visible="previewVisible" @close="closePreview" />
        </Teleport>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { parseTime } from '@/utils/index.js';
import Icon from '@/components/icon/index.vue';
import Empty from '@/components/empty/index.vue';
import ImagePreview from './ImagePreview.vue';
const props = defineProps({
    demo: {
        type: Object,
        default: () => {},
    },
});

const title = computed(() => {
    return props.demo?.title ?? '暂无标题';
});

const github = computed(() => {
    return props.demo?.github ?? '暂无链接';
});

const description = computed(() => {
    return props.demo?.description ?? '暂无描述';
});

// 预览相关
const previewVisible = ref(false);
const previewImg = computed(() => props.demo?.thumb || '');
const openPreview = () => {
    if (previewImg.value) previewVisible.value = true;
};
const closePreview = () => {
    previewVisible.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.demo_item {
    @include flexAlianCenter();
    justify-content: space-between;
    border: 1px solid var(--borderFourthColor);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;

    @include respond-to('large') {
        padding: 18px;
        border-radius: 8px;
    }

    @include respond-to('middle') {
        padding: 16px;
    }

    @include respond-to('small') {
        flex-direction: column;
        padding: 15px;
        align-items: stretch;
    }

    &:hover {
        border-color: var(--textHoverSecColor);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        @include respond-to('small') {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
    }

    &_left {
        width: 0;
        flex: 1;

        @include respond-to('small') {
            width: 100%;
            flex: none;
        }

        h4 {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 14px;
            color: var(--textMainColor);
            line-height: 1.4;

            @include respond-to('large') {
                font-size: 18px;
                margin-bottom: 12px;
            }

            @include respond-to('middle') {
                font-size: 17px;
                margin-bottom: 10px;
            }

            @include respond-to('small') {
                font-size: 16px;
                margin-bottom: 8px;
            }
        }

        > p {
            font-size: 14px;
            margin-bottom: 20px;
            color: var(--textFourthColor);
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            @include respond-to('large') {
                margin-bottom: 18px;
                font-size: 13px;
                line-height: 20px;
            }

            @include respond-to('middle') {
                margin-bottom: 16px;
                line-height: 19px;
            }

            @include respond-to('small') {
                margin-bottom: 12px;
                font-size: 13px;
                line-height: 18px;
                -webkit-line-clamp: 3;
            }
        }

        &_bottom {
            @include flexAlianCenter();
            justify-content: space-between;

            @include respond-to('small') {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }

            &_info {
                @include flexAlianCenter();
                flex-wrap: wrap;
                gap: 15px;

                @include respond-to('small') {
                    gap: 12px;
                }

                > div {
                    @include flexAlianCenter();
                    font-size: 14px;
                    color: var(--textFourthColor);

                    @include respond-to('small') {
                        font-size: 13px;
                    }
                }
            }

            &_category {
                @include flexAlianCenter();
                margin-left: 20px;

                @include respond-to('small') {
                    margin-left: 0;
                }

                > img {
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;

                    @include respond-to('small') {
                        width: 14px;
                        height: 14px;
                        margin-right: 4px;
                    }
                }

                > div {
                    font-size: 14px;
                    color: var(--textFourthColor);
                    background-color: var(--fourthBgColor);
                    border-radius: 8px;
                    padding: 5px 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    @include respond-to('small') {
                        font-size: 12px;
                        padding: 4px 8px;
                        border-radius: 6px;
                    }

                    &:hover {
                        background-color: var(--textHoverColor);
                        color: white;
                    }
                }
            }
        }
    }

    &_right {
        margin-left: 30px;
        width: 180px;
        height: 100px;
        flex-shrink: 0;

        @include respond-to('large') {
            margin-left: 25px;
            width: 160px;
            height: 90px;
        }

        @include respond-to('middle') {
            margin-left: 20px;
            width: 140px;
            height: 80px;
        }

        @include respond-to('small') {
            margin-left: 0;
            margin-top: 15px;
            width: 100%;
            height: 160px;
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            object-fit: cover;
            object-position: center;

            @include respond-to('large') {
                border-radius: 8px;
            }

            @include respond-to('small') {
                border-radius: 6px;
            }
        }
    }
}

.icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;

    @include respond-to('small') {
        width: 14px;
        height: 14px;
        margin-right: 4px;
    }
}

.github_link {
    a {
        position: relative;
        &:after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -2px;
            left: 0;
            background-color: var(--textHoverSecColor);
            transition: all 0.3s;
        }
        &:hover {
            color: var(--textHoverSecColor);
            &:after {
                width: 100%;
            }
        }
    }
    @include flexAlianCenter();
    margin-top: 14px;
    font-size: 12px;
    color: var(--textFourthColor);
    span {
        margin-right: 5px;
    }
}
.time_item {
    @include flexAlianCenter();
    color: var(--textFourthColor);
    font-size: 12px;
}
</style>
