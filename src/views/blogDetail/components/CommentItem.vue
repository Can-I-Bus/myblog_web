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
    width: 100%;
    max-width: 900px;
    margin: 0 auto 24px;
    display: flex;
    gap: 20px;
    padding: 0;
}

.comment_avatar {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f2f5;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.comment_container {
    flex: 1;
    background: var(--mainBgColor);
    border-radius: 12px;
    border: 1px solid var(--borderMainColor);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment_header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--borderMainColor);
    background: var(--secBgColor);
}

.comment_title {
    font-size: 14px;
    color: var(--textSecColor);
    font-weight: 500;

    &::before {
        content: '🗨';
        margin-right: 8px;
        opacity: 0.6;
    }
}

.comment_content {
    padding: 20px;
    font-size: 15px;
    line-height: 1.7;
    color: var(--textMainColor);
    white-space: pre-line;
    word-break: break-word;

    &:empty::before {
        content: '此评论暂无内容';
        color: var(--textSecColor);
        font-style: italic;
    }
}
</style>
