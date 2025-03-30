<!-- 
    组件接收key值，每层级的key值都是唯一的，通过key值来控制展开和收起
-->

<template>
    <div class="tree_wrap">
        <TreeNode v-for="(item, idx) in treeData" :key="idx" :node="item" :titleKey="titleKey" :recKey="recKey" :childrenKey="childrenKey" />
    </div>
</template>
<script setup>
import TreeNode from './TreeNode.vue';
import { provide, defineProps, defineEmits } from 'vue';
const emits = defineEmits(['update:modelValue']);
const props = defineProps({
    treeData: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: Array,
        default: () => [],
    },
    recKey: {
        //用哪个键名当递归节点
        type: String,
        required: true,
    },
    childrenKey: {
        //用哪个键名当子节点
        type: String,
        default: 'children',
    },
    titleKey: {
        //用哪个键名当标题
        type: String,
        default: 'title',
    },
});

const toogleExpand = (name) => {
    if (props.modelValue.includes(name)) {
        const newNodeNames = props.modelValue.filter((item) => item !== name);
        emits('update:modelValue', newNodeNames);
    } else {
        emits('update:modelValue', [...props.modelValue, name]);
    }
};

provide('activeNames', props.modelValue);
provide('toogleExpand', toogleExpand);
</script>
<style scoped lang="scss">
.tree_wrap {
    width: 108%;
}
</style>
