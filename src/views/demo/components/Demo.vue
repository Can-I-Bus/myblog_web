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
                <a :href="'https://www.baidu.com'" target="_blank">{{ github }}</a>
            </div>
        </div>
        <div class="demo_item_right">
            <img :src="demo.thumb" v-if="demo?.thumb && demo?.thumb !== ''" />
            <Empty v-else emptyText="暂无封面" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { parseTime } from '@/utils/index.js';
import Icon from '@/components/icon/index.vue';
import Empty from '@/components/empty/index.vue';
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
