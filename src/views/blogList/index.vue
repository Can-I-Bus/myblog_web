<template>
    <div class="blog_category_list_wrap">
        <div class="blog_category_list">
            <h2>Blog | 博客</h2>
            <Article v-for="item in articleList" :key="item.id" :article="item" />
        </div>
        <Pager :total="total" :pageSize="limit" @pageChange="handlePageChange" />
    </div>
</template>
<script setup>
import Pager from '@/components/pager/index.vue';
import Article from './components/Article.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';
const { $api } = getCurrentInstance().proxy;
const articleList = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(50);
const getArticleList = async () => {
    const data = { page: page.value, limit: limit.value };
    const res = await $api({ type: 'getArticle', data });
    if (res.code === 0) {
        articleList.value = res?.data?.rows ?? [];
        total.value = res?.data?.count ?? 0;
    }
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
.blog_category_list_wrap {
    height: calc(100vh - 68px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    .blog_category_list {
        h2 {
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 40px;
            text-align: center;
        }
        height: calc(100vh - 68px - 70px);
        box-sizing: border-box;
        padding: 40px 0;
        margin: 0 auto;
        width: 100vw;
        overflow: auto;
        .article_item {
            width: 800px;
            margin: 0 auto;
            margin-bottom: 30px;
        }
    }
}
</style>
