<template>
    <Teleport to="body">
        <Transition name="dialog-fade">
            <div v-if="modelValue" class="dialog-overlay" @click="closeOnClickOutside">
                <div class="dialog-container" @click.stop>
                    <div class="dialog-header">
                        <h3>留言板</h3>
                        <button class="dialog-close" @click="close">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>
                    <div class="dialog-body">
                        <!-- 使用改造后的Comment组件 -->
                        <Comment ref="commentForm" :loading="loading" @submit="handleCommentSubmit" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref, getCurrentInstance } from 'vue';
import Comment from '../../blogDetail/components/Comment.vue';
import toast from '@/utils/toast/index';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    closeOnOutsideClick: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue', 'submit']);
const { $api } = getCurrentInstance().proxy;

const loading = ref(false);
const commentForm = ref(null);

const close = () => {
    emit('update:modelValue', false);
};

const closeOnClickOutside = (e) => {
    if (props.closeOnOutsideClick) {
        close();
    }
};

const handleCommentSubmit = async (formData) => {
    loading.value = true;
    try {
        const res = await $api({ type: 'addMessage', data: formData });
        if (res.code === 0) {
            commentForm.value.reset();
            toast({ type: 'success', message: '留言成功！', duration: 2000 });
            emit('submit');
            close();
        }
    } catch (error) {
        console.error('留言失败', error);
        toast({ type: 'error', message: '留言失败，请稍后再试' });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    backdrop-filter: blur(4px);
}

.dialog-container {
    width: 90%;
    max-width: 600px;
    background-color: var(--mainBgColor);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: dialog-zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    @include respond-to('small') {
        width: 95%;
        max-height: 85vh;
    }
}

.dialog-header {
    padding: 20px;
    border-bottom: 1px solid var(--borderMainColor);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--mainBgColor);

    @include respond-to('small') {
        padding: 15px;
    }

    h3 {
        margin: 0;
        font-size: 20px;
        color: var(--textMainColor);
        font-weight: 600;

        @include respond-to('small') {
            font-size: 18px;
        }
    }
}

.dialog-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--textSecColor);
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        color: var(--textHoverColor);
        background-color: var(--thirdBgColor);
    }

    svg {
        width: 20px;
        height: 20px;

        @include respond-to('small') {
            width: 18px;
            height: 18px;
        }
    }
}

.dialog-body {
    padding: 20px;
    overflow-y: auto;

    @include respond-to('small') {
        padding: 15px;
    }
}

// 动画
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
}

@keyframes dialog-zoom-in {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes dialog-zoom-out {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.9);
    }
}
</style>
