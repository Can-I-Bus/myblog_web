<template>
    <div class="blog_category_list_wrap" v-loading="loading">
        <div class="blog_category_list">
            <h2 class="animate-in">Blog | 博客</h2>
            <div style="height: 100%">
                <Empty v-if="articleList.length === 0" />
                <div v-else class="animate-in-container">
                    <Article v-for="(item, index) in articleList" :key="item.id" :article="item" :style="{ animationDelay: `${index * 0.1}s` }" class="animate-item" />
                </div>
            </div>
        </div>
        <Pager :total="total" :currentPage="page" :pageSize="limit" @pageChange="handlePageChange" class="animate-in" />
    </div>
</template>
<script setup>
import Empty from '@/components/empty/index.vue';
import Pager from '@/components/pager/index.vue';
import Article from './components/Article.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';
const { $api } = getCurrentInstance().proxy;
const articleList = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(50);
const loading = ref(true);
const getArticleList = async () => {
    loading.value = true;
    const data = { page: page.value, limit: limit.value };
    const res = await $api({ type: 'getArticle', data });
    if (res.code === 0) {
        articleList.value = res?.data?.rows ?? [];
        total.value = res?.data?.count ?? 0;
    }
    loading.value = false;
};
const handlePageChange = (pageNum) => {
    page.value = pageNum;
    getArticleList();
};

onMounted(() => {
    getArticleList();
});
</script>
<style scoped lang="scss">
@use '@/css/media.scss' as *;

.empty_wrap {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
    padding: 0 20px;

    @include respond-to('small') {
        padding: 0 15px;
    }
}

.blog_category_list_wrap {
    height: calc(100vh - 68px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;

    .blog_category_list {
        height: calc(100vh - 68px - 70px);
        box-sizing: border-box;
        padding: 40px 20px;
        margin: 0 auto;
        width: 100%;
        max-width: 1000px;
        overflow: auto;
        /* 隐藏滚动条但保持滚动功能 */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }

        @include respond-to('large') {
            padding: 35px 18px;
        }

        @include respond-to('middle') {
            padding: 30px 16px;
        }

        @include respond-to('small') {
            padding: 20px 15px;
            height: calc(100vh - 68px - 80px);
        }

        h2 {
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 40px;
            text-align: center;
            color: var(--textMainColor);

            @include respond-to('large') {
                font-size: 28px;
                margin-bottom: 35px;
            }

            @include respond-to('middle') {
                font-size: 26px;
                margin-bottom: 30px;
            }

            @include respond-to('small') {
                font-size: 24px;
                margin-bottom: 25px;
            }
        }

        .article_item {
            width: 100%;
            max-width: 800px;
            margin: 0 auto 30px;

            @include respond-to('large') {
                margin-bottom: 25px;
            }

            @include respond-to('middle') {
                margin-bottom: 22px;
            }

            @include respond-to('small') {
                margin-bottom: 20px;
            }
        }
    }
}

// 进入动画样式
.animate-in {
    animation: fade-in 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
}

.animate-in-container {
    .animate-item {
        animation: fade-in 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
