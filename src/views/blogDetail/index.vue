<template>
    <div class="blog_detail_wrap">
        <BlogCategoryNav v-loading="true" />
        <div class="blog_detail_content">
            <h2 class="blog_detail_title">{{ currArticle?.title }}</h2>

            <div ref="articleContent" v-html="currArticle?.html_content" class="markdown-body html-render"></div>
            <div class="blog_detail_info">
                <div>
                    <span>日期:</span>
                    <span>{{ parseTime(currArticle?.created_at) }}</span>
                </div>
                <div>
                    <span>浏览:</span>
                    <span>{{ currArticle?.scan_number }}</span>
                </div>
                <div>
                    <span>评论:</span>
                    <span>{{ currArticle?.comment_number }}</span>
                </div>
                <div>
                    <span>分类:</span>
                    <span>{{ currArticle?.category?.name }}</span>
                </div>
            </div>
            <div class="blog_detail_nav" v-if="hasPrev || hasNext">
                <div class="prev" v-if="hasPrev">
                    <span>上一篇</span>
                    <p>{{ prev?.title }}</p>
                </div>
                <div class="next" v-if="hasNext">
                    <span>上一篇</span>
                    <p>{{ next?.title }}</p>
                </div>
            </div>
            <Comment />
            <div class="blog_detail_comment_list">
                <span>32条评论</span>
                <CommentItem v-for="item in 10" :key="item" />
                <Pager :total="100" :currentPage="commentListPage" @pageChange="handlePageChange" />
            </div>

            <!-- <div style="background-color: #fff; height: 200px; width: 100px"></div> -->
        </div>
        <BlogNav :toc="currArticle?.toc" :active-id="activeHeadingId" @handleClick="handleNavClick" />
    </div>
</template>

<script setup>
import Pager from '@/components/pager/index.vue';
import BlogCategoryNav from './components/BlogCategoryNav.vue';
import BlogNav from './components/BlogNav.vue';
import CommentItem from './components/CommentItem.vue';
import Comment from './components/Comment.vue';
import { ref, getCurrentInstance, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { parseTime } from '@/utils';
import hljs from 'highlight.js';

const { $api } = getCurrentInstance().proxy;
const route = useRoute();
const activeHeadingId = ref('');
const articleContent = ref(null);
const commentListPage = ref(1);
const page = ref(1);
const limit = ref(50);
const total = ref(0);
const articleList = ref([]);
const currArticleid = ref('');

const prev = computed(() => {
    return articleList.value.find((item) => item.id === currArticleid.value - 1);
});

const next = computed(() => {
    return articleList.value.find((item) => item.id === currArticleid.value + 1);
});

const hasPrev = computed(() => {
    return prev.value && Object.keys(prev.value).length > 0;
});
const hasNext = computed(() => {
    return next.value && Object.keys(next.value).length > 0;
});

const currArticle = computed(() => {
    return articleList.value.find((item) => item.id === currArticleid.value);
});

// 处理导航点击
const handleNavClick = (id) => {
    activeHeadingId.value = id;
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        // 更新URL hash（无刷新）
        history.replaceState(null, null, `#${id}`);
    }
};

// 滚动检测逻辑
const setupScrollObserver = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeHeadingId.value = entry.target.id;
                }
            });
        },
        {
            rootMargin: '0px 0px -70% 0px',
            threshold: 0.1,
        }
    );

    // 观察文章内所有标题
    const headings = articleContent.value?.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    headings?.forEach((h) => observer.observe(h));

    return observer;
};

const getArticle = async () => {
    const data = {
        page: page.value,
        limit: limit.value,
        category_id: route.params.id,
    };
    const res = await $api({ type: 'getArticle', data });
    if (res.code === 0) {
        articleList.value = [...res.data.rows];
        total.value = res.data.count;
        currArticleid.value = articleList.value[0].id;
        await nextTick();
        applyHighlight();
        setupScrollObserver();
        // 初始hash处理
        if (window.location.hash) {
            handleNavClick(window.location.hash.slice(1));
        }
    }
};

const handlePageChange = (page) => {
    commentListPage.value = page;
    // getArticle();
};

const applyHighlight = () => {
    document.querySelectorAll('.html-render pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
};

watch(currArticle, async () => {
    await nextTick();
    applyHighlight();
    const observer = setupScrollObserver();
    return () => observer?.disconnect();
});

onMounted(() => {
    //清除hash
    window.location.hash = '';
    // 获取文章列表
    getArticle();
    // 监听hash变化（浏览器前进/后退）
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (hash) handleNavClick(hash);
    });
});
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;
$padding: 50px;
.blog_detail_wrap {
    width: 100vw;
    margin: 0 auto;
    height: calc(100vh - 64px); // [!code focus]
    padding: 60px 80px 10px 80px;
    display: flex;
    justify-content: space-around;
    overflow: hidden; // [!code focus]
}

.blog_detail_content {
    width: 70%;
    position: relative;
    overflow: auto;
    @include scrollbar();
}

.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 100%;
    margin: 0 auto;
    padding: $padding;
    overflow: auto;
    // 为标题添加悬停锚点图标
    [id] {
        position: relative;
        &:hover::before {
            content: '#';
            position: absolute;
            left: 0px;
            color: var(--textMainColor);
            opacity: 0.7;
        }
    }
}

.blog_detail_title {
    color: var(--textMainColor);
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 50px;
}

.blog_detail_info {
    @include flexAlianCenter();
    @include bottomLine(100%, -30px);
    gap: 20px;
    margin: 100px 0 60px 0;
    > div {
        span {
            color: var(--textMainColor);
            font-size: 14px;
            opacity: 0.5;
        }
    }
}

.blog_detail_nav {
    @include flexAlianCenter();
    justify-content: space-between;
    margin-bottom: 30px;
    > div {
        border: 1px solid var(--borderMainColor);
        width: 30%;
        height: 70px;
        border-radius: 12px;
        padding: 10px 20px;
        transition: 0.2s;
        span {
            display: inline-block;
            color: var(--textMainColor);
            font-size: 14px;
            margin-bottom: 10px;
        }
        p {
            color: var(--textHoverColor);
            font-size: 14px;
        }
        &:hover {
            border: 1px solid var(--textHoverColor);
            cursor: pointer;
        }
    }
}
.blog_detail_comment_list {
    margin-top: 30px;
    > span {
        display: inline-block;
        color: var(--textMainColor);
        font-size: 16px;
        padding-left: 40px;
        // font-weight: 500;
        margin-bottom: 30px;
    }
}
</style>
