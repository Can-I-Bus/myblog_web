<template>
    <div class="comment_wrap">
        <div class="comment_avatar">
            <img src="../../../../public/comment_avatar.png" />
        </div>
        <div class="comment_container">
            <div class="comment_header">
                <span class="comment_title">{{ formatAuthor(comment.nickname) }} 评论于 {{ formatDate(comment.created_at) }}</span>
            </div>
            <div class="comment_content">
                {{ comment?.content ?? '' }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
});

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const formatAuthor = (author) => {
    return author || '匿名用户';
};
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.comment_wrap {
    display: flex;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;

    @include respond-to('small') {
        flex-direction: column;
        gap: 12px;
    }
}

.comment_avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;

    @include respond-to('small') {
        width: 36px;
        height: 36px;
        align-self: flex-start;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.comment_container {
    flex: 1;
    min-width: 0;
}

.comment_header {
    margin-bottom: 12px;

    @include respond-to('small') {
        margin-bottom: 10px;
    }
}

.comment_title {
    font-size: 13px;
    color: var(--textSecColor);
    font-weight: 500;
    word-break: break-word;

    &::before {
        content: '💬';
        margin-right: 6px;
        opacity: 0.7;
    }

    @include respond-to('small') {
        font-size: 12px;
    }
}

.comment_content {
    font-size: 14px;
    line-height: 1.6;
    color: var(--textMainColor);
    white-space: pre-line;
    word-break: break-word;
    overflow-wrap: break-word;

    @include respond-to('small') {
        font-size: 13px;
        line-height: 1.5;
    }

    &:empty::before {
        content: '此评论暂无内容';
        color: var(--textSecColor);
        font-style: italic;
        opacity: 0.7;
    }
}
</style>
