<template>
    <div class="blog_detail_wrap" v-loading="loadng">
        <ArticleList :articleList="articleList" :currArticle="currArticle" :currCategoryInfo="currCategoryInfo" @handleClick="handleArticleClick" />
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
                <div class="prev" :style="{ opacity: hasPrev ? 1 : 0 }" @click="handleArticleClick(prev)">
                    <span>上一篇</span>
                    <p>{{ prev?.title }}</p>
                </div>
                <div class="next" :style="{ opacity: hasNext ? 1 : 0 }" @click="handleArticleClick(next)">
                    <span>下一篇</span>
                    <p>{{ next?.title }}</p>
                </div>
            </div>
            <Comment style="margin-bottom: 50px" :articleId="currArticleid" @updateComment="getCommentList" />
            <div class="blog_detail_comment_list">
                <div>
                    <p style="margin-bottom: 20px">{{ commentTotal }}条评论</p>
                    <div>
                        <div v-if="commentList.length > 0" class="comment_list">
                            <CommentItem v-for="item in commentList" :key="item.id" :comment="item" />
                        </div>
                        <Empty v-else fontSize="40px" />
                    </div>
                </div>
                <Pager :total="commentTotal" :currentPage="commentListPage" @pageChange="handlePageChange" />
            </div>
        </div>
        <BlogNav :toc="currArticle?.toc" :isRoot="true" :active-id="activeHeadingId" @handleClick="handleNavClick" />
    </div>
</template>

<script setup>
import ArticleList from './components/ArticleList.vue';
import Pager from '@/components/pager/index.vue';
import BlogNav from './components/BlogNav.vue';
import CommentItem from './components/CommentItem.vue';
import Comment from './components/Comment.vue';
import Empty from '@/components/empty/index.vue';
import hljs from 'highlight.js';
import { ref, getCurrentInstance, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { parseTime } from '@/utils';

const { $api } = getCurrentInstance().proxy;
const route = useRoute();
const activeHeadingId = ref('');
const loadng = ref(false);
const articleContent = ref(null);
const articleObserver = ref(null); // 文章观察者
const commentListPage = ref(1);
const page = ref(1);
const limit = ref(50);
const total = ref(0);
const commentQuery = ref({
    page: 1,
    limit: 50,
});
const commentTotal = ref(0);
const commentList = ref([]);
const articleList = ref([]);
const currArticleid = ref('');

const currCategoryInfo = computed(() => {
    return {
        name: route.query.name,
        icon: route.query.icon,
    };
});

const prev = computed(() => {
    const index = articleList.value.findIndex((item) => item.id === currArticleid.value);
    return articleList.value[index - 1];
});

const next = computed(() => {
    const index = articleList.value.findIndex((item) => item.id === currArticleid.value);
    return articleList.value[index + 1];
});

const hasPrev = computed(() => {
    return prev.value && Object.keys(prev.value).length > 0;
});
const hasNext = computed(() => {
    return next.value && Object.keys(next.value).length > 0;
});

const currArticle = computed(() => {
    return articleList.value.find((item) => item.id == currArticleid.value);
});

const handleNavClick = (id) => {
    activeHeadingId.value = id;
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        history.replaceState(null, null, `#${id}`);
    }
};

// 检测是否浏览完文章
const setupArticleObserver = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    addScanNumber();
                    observer.disconnect(); // 触发后立即断开
                }
            });
        },
        { threshold: 1 }
    );
    const blogInfo = document.querySelector('.blog_detail_info');
    blogInfo && observer.observe(blogInfo);
    return observer;
};

// 滚动检测
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

const addScanNumber = async () => {
    const res = await $api({ type: 'addScanNumber', data: { id: currArticleid.value } });
    if (res.code === 0) {
        articleList.value = articleList.value.map((item) => {
            if (item.id === currArticleid.value) {
                item.scan_number += 1;
            }
            return item;
        });
    }
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

const getCommentList = async () => {
    const data = {
        article_id: currArticleid.value,
        page: commentQuery.value.page,
        limit: commentQuery.value.limit,
    };
    const res = await $api({ type: 'getCommentList', data });
    if (res.code === 0) {
        commentList.value = res.data.rows;
        commentTotal.value = res.data.count;
    }
};

const handlePageChange = (page) => {
    commentListPage.value = page;
    getCommentList();
};

const handleArticleClick = (item) => {
    if (item.id === currArticleid.value) return;
    currArticleid.value = item.id;
    setTimeout(() => {
        document.querySelector('.blog_detail_content').scrollTo(0, 0);
    }, 0);
};

const applyHighlight = () => {
    document.querySelectorAll('.html-render pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
};

const init = async () => {
    loadng.value = true;
    //清除hash
    window.location.hash = '';
    // 获取文章列表
    await getArticle();
    await getCommentList();
    // 监听hash变化（浏览器前进/后退）
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (hash) handleNavClick(hash);
    });
    if (route.query.article_id) {
        currArticleid.value = route.query.article_id;
    }
    loadng.value = false;
};

watch(currArticle, async () => {
    await nextTick();
    applyHighlight();
    const observer = setupScrollObserver();
    // 销毁旧观察者
    if (articleObserver.value) {
        articleObserver.value.disconnect();
    }
    // 创建新观察者
    articleObserver.value = setupArticleObserver();
    return () => observer?.disconnect();
});

onMounted(() => {
    init();
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
    min-height: 80vh;
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
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: space-between;

    margin-top: 30px;
    .comment_list {
        height: calc(500px - 36px);
        overflow: auto;
    }
    > div:nth-of-type(1) {
        min-height: 500px;
        > div:nth-of-type(1) {
            height: calc(500px - 36px);
        }
    }
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
