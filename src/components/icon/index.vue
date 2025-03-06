<template>
    <i
        :class="['iconfont', icons[props.type], 'icon']"
        :style="{ fontSize }"
        @click="handleClick"
    >
    </i>
</template>
<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
const emits = defineEmits(['click'])

const handleClick = () => {
    emits('click', props.type)
}
const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    fontSize: {
        type: String,
        default: '16px',
    },
})
const icons = ref({
    weixin: 'icon-weixin', // 微信
    qingtian: 'icon-baitian-qing', // 晴天
    github: 'icon-github-fill', // github
    empty: 'icon-empty', // 空心
    email: 'icon-youxiang', // 邮箱
    heiye: 'icon-heiyemoshi', // 黑夜
})
</script>
<style scoped lang='scss'>
.icon {
    cursor: pointer;
}
</style>