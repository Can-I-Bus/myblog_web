<template>
    <div class="tree_node_wrap">
        <div class="tree_node">
            <div class="tree_node_title" @click="handleTitleClick">
                <p>{{ node?.[titleKey] }}</p>
                <Icon v-if="node?.[childrenKey]?.length" type="topArrow" :style="{ transition: '.2s', transform: isExpand ? 'rotate(180deg)' : 'rotate(90deg)', marginLeft: '10px' }" />
            </div>
            <CollapseTransition>
                <div class="tree_node_content" v-show="isExpand">
                    <div v-for="(item, idx) in node?.[childrenKey]" :key="idx" class="tree_node_content_item" @click="toogleExpand(item.key)">
                        {{ item.title }}
                    </div>
                </div>
            </CollapseTransition>

            <div class="tree_children" v-show="isExpand">
                <CollapseTransition>
                    <TreeNode v-for="(item, idx) in node[recKey]" :key="idx" :node="item" :recKey="recKey" :childrenKey="childrenKey" :titleKey="titleKey" />
                </CollapseTransition>
            </div>
        </div>
    </div>
</template>
<script setup name="TreeNode">
import CollapseTransition from '../collapse/CollapseTransition.vue';
import Icon from '@/components/icon/index.vue';
import { defineProps, inject, computed, ref, onMounted } from 'vue';
const activeNames = inject('activeNames');
const toogleExpand = inject('toogleExpand');
const props = defineProps({
    node: {
        type: Object,
        default: () => {},
    },
    recKey: {
        type: String,
    },
    childrenKey: {
        type: String,
    },
    titleKey: {
        type: String,
    },
});

const expand = ref(false);

const isChildrenActive = computed(() => {
    return props.node[props.childrenKey]?.some((item) => {
        return activeNames.includes(item.key);
    });
});

const isExpand = computed(() => {
    return ((isChildrenActive.value || isChildInActive(props.node[props.recKey])) && expand.value) || expand.value;
});

const isChildInActive = (arr) => {
    //如果当前节点有子节点
    const has = arr.some((item) => {
        return item[props.childrenKey]?.some((child) => {
            return activeNames.includes(child.key);
        });
    });
    if (has) {
        return true;
    } else {
        //如果当前节点没有子节点，则递归查找子节点
        if (arr[props.recKey]?.length) {
            return isChildInActive(arr[props.recKey]);
        } else {
            return false;
        }
    }
};

const handleTitleClick = () => {
    if (!props.node[props.childrenKey]?.length) {
        return;
    }
    expand.value = !expand.value;
};

onMounted(() => {
    if (isChildrenActive.value) {
        expand.value = true;
    }
});
</script>
<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;
.tree_node_wrap {
    margin-bottom: 16px;
}
.tree_node_title {
    @include flexAlianCenter();
    justify-content: space-between;
    color: var(--textThirdColor);
    cursor: pointer;
    font-size: 15px;
    margin-bottom: 10px;
    font-weight: 700;
}
.tree_node_content,
.tree_children {
    color: var(--textFourthColor);
    cursor: pointer;
    padding-left: 16px;
    font-size: 14px;
}
.tree_children {
    margin-bottom: 10px;
}
.tree_node_content > div {
    padding: 10px 0;
    transition: 0.2s;
    &:hover {
        color: var(--textHoverColor);
    }
}
.tree_node_content > div:last-child {
    margin-bottom: 10px;
}
</style>
