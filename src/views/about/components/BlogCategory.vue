<template>
    <div class="blog_category_wrap">
        <div v-for="item in categoryList" :key="item.id" class="blog_category_wrap_item" @click.stop="handleItemClick(item.id)">
            <div class="parent">
                <div>
                    <img :src="item.icon" />
                    <span>{{ item.name }}</span>
                </div>
                <Icon class="icon" type="topArrow" />
            </div>
            <div v-if="item.children" class="children_wrap">
                <BlogCategory :categoryList="item.children" @handleClick="handleItemClick" />
            </div>
        </div>
    </div>
</template>
<script setup name="BlogCategory">
import Icon from '@/components/icon/index.vue';
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
@use '../../../css/media.scss' as *;
@use '../../../css/mixin.scss' as *;
.blog_category_wrap {
    max-height: calc(100vh - 64px - 64px - 3vh - 30px);
    span {
        color: var(--textMainColor);
    }
    &_item .parent {
        > div {
            @include flexAlianCenter();
            img {
                margin-right: 14px;
                width: 20px;
                height: 20px;
            }
        }
        @include flexAlianCenter();
        justify-content: space-between;
        border-radius: 10px;
        transition: 0.2s;
        padding: 16px;
        margin-bottom: 10px;
        border: 1px solid var(--mainBgColor);
        cursor: pointer;

        .icon {
            transition: 0.4s;
            opacity: 0;
            transform: translateX(-40px) rotate(90deg);
        }
        &:hover {
            border: 1px solid var(--borderMainColor);
            background-color: var(--secBgColor);
            .icon {
                opacity: 1;
                transform: translateX(0) rotate(90deg);
            }
        }
    }
    .children_wrap {
        padding-left: 20px;
        @include leftLine(100%, 0, 0, var(--textHoverSecColor), 0.3);
    }
}
</style>
