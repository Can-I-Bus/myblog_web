<template>
    <div id="collapse_item" @click="handleClick">
        <div>
            <slot name="title" v-if="slots.title"></slot>
            <div class="title" v-else>
                <span>{{ title }}</span>
                <Icon type="topArrow" style="transform: rotate(90deg)" />
            </div>
        </div>
        <CollapseTransition>
            <div v-show="isCollapse">
                <slot></slot>
            </div>
        </CollapseTransition>
    </div>
</template>
<script setup>
import Icon from '@/components/icon/index.vue'
import CollapseTransition from './CollapseTransition.vue'
import { computed, inject, defineProps, useSlots } from 'vue'
const props = defineProps({
    title: {
        type: [String, Number],
        default: '',
    },
    name: {
        type: [String, Number],
        default: '',
    },
})
const slots = useSlots()
const activeName = inject('activeName')
const hanldeToogle = inject('hanldeToogle')

const handleClick = () => {
    hanldeToogle(props.name)
}

const isCollapse = computed(() => {
    return activeName.value?.includes(props.name)
})
</script>

<style scoped lang='scss'>
#collapse_item {
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.title {
    color: var(--textMainColor);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>