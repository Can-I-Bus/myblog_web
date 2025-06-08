<template>
    <i :class="['iconfont', icons[props.type], 'icon']" :style="{ fontSize }" @click="handleClick"> </i>
</template>
<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
const emits = defineEmits(['click']);

const handleClick = () => {
    emits('click', props.type);
};
const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    fontSize: {
        type: String,
        default: '16px',
    },
});
const icons = ref({
    weixin: 'icon-weixin', // 微信
    qingtian: 'icon-baitian-qing', // 晴天
    github: 'icon-github-fill', // github
    empty: 'icon-empty', // 空心
    email: 'icon-youxiang', // 邮箱
    heiye: 'icon-heiyemoshi', // 黑夜
    position: 'icon-weizhi', // 位置
    topArrow: 'icon-xiangshang2', // 上箭头
    bottomArrow: 'icon-xiangxia2', // 下箭头
    version: 'icon-banben', // 版本
    code: 'icon-code', // 代码
    success: 'icon-success_fill', // 成功
    error: 'icon-error', // 错误
    info: 'icon-info', // 信息
    warning: 'icon-wraning', // 警告
    user: 'icon-user', // 用户图标
    folder: 'icon-folder', // 文件夹图标
    blog: 'icon-blog', // 博客图标
    close: 'icon-close', // 关闭图标
    eye: 'icon-eye', // 眼睛图标
    comment: 'icon-comment', // 评论图标
    leftArrow: 'icon-arrow-left', // 左箭头
    rightArrow: 'icon-arrow-right', // 右箭头
    list: 'icon-list', // 列表图标
    articles: 'icon-article', // 文章图标
});
</script>
<style scoped lang="scss">
.icon {
    cursor: pointer;
    color: var(--textSecColor);
}
</style>
