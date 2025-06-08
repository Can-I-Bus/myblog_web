<template>
    <div class="comment_wrap">
        <div class="comment_avatar">
            <img src="../../../../public/comment_avatar.png" alt="评论头像" />
        </div>
        <div class="comment_form">
            <div class="form_header">
                <h3>发表评论</h3>
            </div>

            <div class="input_group">
                <input v-model="name" type="text" placeholder="请输入你的昵称" class="form_input" required />
                <label class="input_label">昵称</label>
            </div>

            <div class="input_group">
                <textarea v-model="comment" placeholder="说几句吧..." class="form_textarea" rows="4" @input="commentInputChange" required></textarea>
                <label class="input_label">评论内容</label>
                <div class="character_count">{{ comment.length }}/500</div>
            </div>

            <div class="form_footer">
                <button class="submit_btn" @click="handleClick" :disabled="loading || !canSubmit">
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
import toast from '@/utils/toast/index';
import { ref, getCurrentInstance, computed } from 'vue';

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

const canSubmit = computed(() => {
    return comment.value.trim() && name.value.trim() && comment.value.length <= 500;
});

const commentInputChange = (event) => {
    const val = event.target.value;
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
    if (!canSubmit.value) {
        toast({
            type: 'warning',
            message: '请输入昵称和评论内容',
            duration: 2000,
        });
        return;
    }

    try {
        loading.value = true;
        const data = {
            article_id: props.articleId,
            content: comment.value.trim(),
            nickname: name.value.trim(),
        };
        const res = await $api({ type: 'postComment', data });
        if (res.code === 0) {
            comment.value = '';
            name.value = '';
            toast({
                type: 'success',
                message: '评论发布成功',
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
    display: flex;
    gap: 16px;
    margin-bottom: 30px;
    width: 100%;
    box-sizing: border-box;

    @include respond-to('small') {
        flex-direction: column;
        gap: 12px;
    }
}

.comment_avatar {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;

    @include respond-to('small') {
        width: 40px;
        height: 40px;
        align-self: flex-start;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.comment_form {
    flex: 1;
    min-width: 0;

    .form_header {
        margin-bottom: 20px;

        h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--textMainColor);

            @include respond-to('small') {
                font-size: 16px;
            }
        }
    }
}

.input_group {
    position: relative;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;

    .input_label {
        position: absolute;
        left: 12px;
        top: -8px;
        font-size: 12px;
        color: var(--textSecColor);
        background: var(--mainBgColor);
        padding: 0 4px;
        pointer-events: none;
        transition: all 0.2s ease;
        z-index: 1;
    }
}

.form_input,
.form_textarea {
    width: 100%;
    max-width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--borderMainColor);
    border-radius: 8px;
    background: var(--mainBgColor);
    color: var(--textMainColor);
    font-size: 14px;
    font-family: inherit;
    transition: all 0.3s ease;
    outline: none;
    box-sizing: border-box;

    @include respond-to('small') {
        padding: 10px 14px;
        font-size: 14px;
    }

    &::placeholder {
        color: var(--textSecColor);
        opacity: 0.6;
    }

    &:focus {
        border-color: var(--textHoverColor);
        box-shadow: 0 0 0 3px rgba(var(--textHoverColorRGB), 0.1);

        ~ .input_label {
            color: var(--textHoverColor);
        }
    }

    &:hover {
        border-color: var(--textHoverSecColor);
    }
}

.form_textarea {
    min-height: 100px;
    max-height: 300px;
    resize: vertical;
    line-height: 1.5;

    @include respond-to('small') {
        min-height: 80px;
        max-height: 200px;
    }
}

.character_count {
    position: absolute;
    bottom: -18px;
    right: 0;
    font-size: 11px;
    color: var(--textSecColor);

    @include respond-to('small') {
        bottom: -16px;
        font-size: 10px;
    }
}

.form_footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;

    @include respond-to('small') {
        margin-top: 20px;
    }
}

.submit_btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--textHoverColor);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    @include respond-to('small') {
        padding: 10px 20px;
        font-size: 13px;
        border-radius: 6px;
    }

    &:hover:not(:disabled) {
        background: var(--textHoverSecColor);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

        .send_icon {
            transform: translateX(2px);
        }
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--textSecColor);

        &:hover {
            transform: none;
            box-shadow: none;

            .send_icon {
                transform: none;
            }
        }
    }
}

.send_icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
    transition: transform 0.2s ease;

    @include respond-to('small') {
        width: 14px;
        height: 14px;
    }
}
</style>
