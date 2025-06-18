<!-- ParentComponent.vue -->
<template>
    <div class="message-page-container">
        <div class="message-header">
            <h1>留言墙</h1>
            <p>在这里留下你的足迹，分享你的想法</p>
        </div>

        <div class="message-content" v-loading="loading">
            <Waterfall :items="items" :cols="4" :gap="20" :item-width="240" :animation-delay="100" responsive>
                <template #item="{ item }">
                    <div class="message-item" :style="{ height: item.height + 'px' }">
                        <div class="message-item-header">
                            <div class="user-avatar">
                                <img src="../../../public/comment_avatar.png" alt="用户头像" />
                            </div>
                            <div class="user-info">
                                <h3>{{ item.nickname || '匿名用户' }}</h3>
                                <span>{{ parseTime(item.created_at) }}</span>
                            </div>
                        </div>
                        <div class="message-item-content">
                            <p>{{ item.content }}</p>
                        </div>
                    </div>
                </template>
            </Waterfall>

            <div class="empty-state" v-if="items.length === 0 && !loading">
                <div class="empty-icon">📝</div>
                <p>暂无留言，快来成为第一个留言的人吧！</p>
            </div>
        </div>

        <div class="message-footer">
            <Pager :total="total" :current-page="page" :page-size="limit" @page-change="handlePageChange" />
        </div>

        <FloatingButton :is-active="showMessageDialog" @click="showMessageDialog = true" />

        <MessageDialog v-model="showMessageDialog" @submit="handleMessageSubmit" />
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { parseTime } from '@/utils';
import Waterfall from './components/WaterFall.vue';
import Pager from '@/components/pager/index.vue';
import FloatingButton from './components/FloatingButton.vue';
import MessageDialog from './components/MessageDialog.vue';

const { $api } = getCurrentInstance().proxy;
const loading = ref(false);
const items = ref([]);
const page = ref(1);
const limit = ref(50);
const total = ref(0);
const showMessageDialog = ref(false);

// 获取留言列表
const getMessageList = async () => {
    items.value = [];
    loading.value = true;
    try {
        const res = await $api({
            type: 'getMessageList',
            data: { page: page.value, limit: limit.value },
        });

        if (res.code === 0) {
            const messageList = res.data?.rows || [];

            // 处理留言数据，添加随机高度
            items.value = messageList.map((message) => ({
                ...message,
                height: Math.floor(Math.random() * 100) + 200, // 随机高度
            }));

            total.value = res.data?.count || 0;
        }
    } catch (error) {
        console.error('获取留言列表失败', error);
    } finally {
        loading.value = false;
    }
};

// 分页变化
const handlePageChange = (newPage) => {
    page.value = newPage;
    getMessageList();

    // 回到顶部
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// 提交留言后的处理
const handleMessageSubmit = () => {
    page.value = 1;
    getMessageList();
};

onMounted(() => {
    getMessageList();
});
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;

.message-page-container {
    width: 100%;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @include respond-to('small') {
        height: calc(100vh - 64px);
    }
}

.message-header {
    text-align: center;
    padding: 40px 20px;
    margin-bottom: 20px;
    flex-shrink: 0;

    @include respond-to('small') {
        padding: 25px 15px 15px;
        margin-bottom: 10px;
    }

    h1 {
        font-size: 32px;
        color: var(--textMainColor);
        margin-bottom: 10px;

        @include respond-to('large') {
            font-size: 28px;
        }

        @include respond-to('small') {
            font-size: 24px;
            margin-bottom: 8px;
        }
    }

    p {
        font-size: 16px;
        color: var(--textSecColor);

        @include respond-to('small') {
            font-size: 14px;
        }
    }
}

.message-content {
    flex: 1;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0; /* 重要：让flex子元素能够收缩 */
    /* 隐藏滚动条但保持滚动功能 */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }

    @include respond-to('large') {
        width: 92%;
        padding: 0 18px;
    }

    @include respond-to('middle') {
        width: 95%;
        padding: 0 15px;
    }

    @include respond-to('small') {
        width: 100%;
        padding: 0 15px;
        display: flex;
        justify-content: center;
    }
}

.message-footer {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    border-top: 1px solid var(--borderMainColor);
    background: var(--mainBgColor);

    @include respond-to('small') {
        padding: 15px 0;
    }
}

.message-item {
    padding: 20px;
    background-color: var(--mainBgColor);
    border-radius: 12px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--borderMainColor);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;

    @include respond-to('large') {
        padding: 18px;
        border-radius: 10px;
    }

    @include respond-to('middle') {
        padding: 16px;
    }

    @include respond-to('small') {
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        border-color: var(--textHoverSecColor);

        @include respond-to('small') {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
    }

    &-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        @include respond-to('small') {
            margin-bottom: 12px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 12px;
            flex-shrink: 0;

            @include respond-to('small') {
                width: 32px;
                height: 32px;
                margin-right: 10px;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .user-info {
            flex: 1;
            min-width: 0;

            h3 {
                font-size: 16px;
                margin: 0 0 4px;
                color: var(--textMainColor);
                font-weight: 500;

                @include respond-to('small') {
                    font-size: 14px;
                    margin-bottom: 2px;
                }
            }

            span {
                font-size: 12px;
                color: var(--textFourthColor);

                @include respond-to('small') {
                    font-size: 11px;
                }
            }
        }
    }

    &-content {
        flex: 1;

        p {
            color: var(--textSecColor);
            line-height: 1.6;
            word-break: break-word;
            font-size: 14px;
            margin: 0;

            @include respond-to('small') {
                font-size: 13px;
                line-height: 1.5;
            }
        }
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    height: 100%;

    @include respond-to('small') {
        padding: 40px 15px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: auto;
        min-height: 200px;
    }

    .empty-icon {
        font-size: 60px;
        margin-bottom: 20px;

        @include respond-to('small') {
            font-size: 40px;
            margin-bottom: 15px;
        }
    }

    p {
        font-size: 16px;
        color: var(--textSecColor);
        text-align: center;

        @include respond-to('small') {
            font-size: 14px;
        }
    }
}
</style>
