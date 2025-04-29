<template>
    <div class="comment_wrap">
        <div class="comment_avatar">
            <img src="../../../../public/comment_avatar.png" />
        </div>
        <div class="comment_container">
            <div class="comment_header">
                <span class="comment_title">发表评论</span>
            </div>
            <div class="comment_body">
                <div class="input_group">
                    <Input v-model="name" type="text" placeholder="请输入你的昵称" class="nickname_input" />
                    <label class="floating_label">你的昵称</label>
                </div>
                <div class="input_group">
                    <Input v-model="comment" type="textarea" placeholder="其输入你的评论" class="comment_input" :rows="4" @change="commentInputChange" />
                    <label class="floating_label">说几句吧</label>
                    <div class="character_count">{{ comment.length }}/500</div>
                </div>
            </div>
            <div class="comment_footer">
                <button class="submit_btn" @click="handleClick" :disabled="loading">
                    <template v-if="!loading">
                        <span>发布评论</span>
                        <svg class="send_icon" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </template>
                    <template v-else>
                        <span>发布中...</span>
                    </template>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Input from '@/components/input/index.vue';
import toast from '@/utils/toast/index';
import { ref, getCurrentInstance } from 'vue';
const props = defineProps({
    articleId: {
        type: Number,
        required: true,
    },
});

const emits = defineEmits(['updateComment']);
const { $api } = getCurrentInstance().proxy;
const loading = ref(false);
const comment = ref('');
const name = ref('');

const commentInputChange = (val) => {
    if (val.length > 500) {
        toast({
            type: 'warning',
            message: '评论内容不能超过500个字符',
            duration: 2000,
        });
        comment.value = val.slice(0, 500);
    }
};

const handleClick = async () => {
    if (comment.value.length > 500) {
        toast({
            type: 'warning',
            message: '评论内容不能超过500个字符',
            duration: 2000,
        });
        return;
    }
    if (!comment.value || !name.value) {
        toast({
            type: 'warning',
            message: '请输入评论内容或昵称',
            duration: 2000,
        });
        return;
    }
    try {
        loading.value = true;
        const data = {
            article_id: props.articleId,
            content: comment.value,
            nickname: name.value,
        };
        const res = await $api({ type: 'postComment', data });
        if (res.code === 0) {
            toast({
                type: 'success',
                message: '评论成功',
                duration: 2000,
                cb: () => {
                    emits('updateComment');
                },
            });
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.comment_wrap {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 26px;
    padding: 0;
}

.comment_avatar {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background-color: #fff;
    border-radius: 50%;
    img {
        height: 100%;
        width: 100%;
    }
}

.comment_container {
    flex: 1;
    background: var(--mainBgColor);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--borderMainColor);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
}

.comment_header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--borderMainColor);
    background: var(--secBgColor);
}

.comment_title {
    font-size: 16px;
    font-weight: 600;
    color: var(--textMainColor);
}

.comment_body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.input_group {
    position: relative;
}

.floating_label {
    position: absolute;
    left: 12px;
    top: 16px;
    color: var(--textSecColor);
    font-size: 15px;
    pointer-events: none;
    transition: all 0.2s ease;
    background: var(--mainBgColor);
    padding: 0 4px;
}

.nickname_input,
.comment_input {
    width: 100%;
    padding: 4px 12px;
    background: var(--mainBgColor);
    color: var(--textMainColor);
    font-size: 15px;
    transition: all 0.3s ease;

    &:focus {
        border-color: var(--textHoverColor);
        outline: none;
        box-shadow: 0 0 0 2px rgba(var(--textHoverColor), 0.1);

        + .floating_label {
            top: -8px;
            font-size: 12px;
            color: var(--textHoverColor);
        }
    }

    &:not(:placeholder-shown) + .floating_label {
        top: -8px;
        font-size: 12px;
    }
}

.comment_input {
    min-height: 120px;
    resize: vertical;
    line-height: 1.6;
}

.character_count {
    text-align: right;
    font-size: 12px;
    color: var(--textSecColor);
    margin-top: 4px;
}

.comment_footer {
    padding: 16px 20px;
    border-top: 1px solid var(--borderMainColor);
    background: var(--secBgColor);
    display: flex;
    justify-content: flex-end;
}

.submit_btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--textHoverSecColor);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--hoverBgColor);
        transform: translateY(-1px);

        .send_icon {
            transform: translateX(2px);
        }
    }

    &:active {
        transform: translateY(0);
    }
}

.send_icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
    transition: transform 0.2s ease;
}

/* 修改按钮禁用状态 */
.submit_btn {
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--textHoverColor);

        &:hover {
            // background: var(--disabledBgColor);
            transform: none;
        }
    }
}
</style>
