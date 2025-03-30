<template>
    <div class="collapse_wrap">
        <slot></slot>
    </div>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, provide, ref } from 'vue'
const props = defineProps({
    accordion: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: [String, Number, Array],
    },
})
const emit = defineEmits(['update:modelValue'])
const activeName = ref([])

const hanldeToogle = (name) => {
    if (activeName.value.includes(name)) {
        activeName.value = activeName.value.filter((item) => item !== name)
    } else {
        activeName.value.push(name)
    }
    if (props.accordion) {
        activeName.value.splice(activeName.value.findIndex(name), 1)
    }
    emit('update:modelValue', activeName.value)
}

onMounted(() => {
    activeName.value = [...props.modelValue]
})
provide('activeName', activeName)
provide('hanldeToogle', hanldeToogle)
</script>
<style scoped lang='scss'>
.collapse_wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>