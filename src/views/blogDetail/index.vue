<template>
    <div class="blog_detail_wrap" v-loading="loading">
        <!-- 阅读进度条 -->
        <div class="reading-progress">
            <div class="progress-bar" :style="{ width: readingProgress + '%' }"></div>
        </div>

        <!-- 左侧文章列表 -->
        <div class="blog_detail_sidebar_left" :class="{ 'mobile-active': showArticleList }">
            <div class="sidebar-header">
                <h3>文章列表</h3>
                <button class="close-btn" @click="showArticleList = false">
                    <Icon type="close" fontSize="20px" />
                </button>
            </div>
            <ArticleList :articleList="articleList" :currArticle="currArticle" :currCategoryInfo="currCategoryInfo" @handleClick="handleArticleClick" />
        </div>

        <!-- 主要内容区域 -->
        <div class="blog_detail_content">
            <!-- 文章头部信息 -->
            <div class="article-header">
                <div class="article-meta">
                    <span class="category">
                        <img :src="currArticle?.category?.icon" alt="分类图标" />
                        {{ currArticle?.category?.name }}
                    </span>
                    <span class="date">{{ parseTime(currArticle?.created_at) }}</span>
                </div>
                <h1 class="article-title">{{ currArticle?.title }}</h1>
                <div class="article-stats">
                    <span class="stat-item">
                        <Icon type="eye" fontSize="16px" />
                        {{ currArticle?.scan_number }} 次阅读
                    </span>
                    <span class="stat-item">
                        <Icon type="comment" fontSize="16px" />
                        {{ currArticle?.comment_number }} 条评论
                    </span>
                </div>
            </div>

            <!-- 文章内容 -->
            <div ref="articleContent" v-html="currArticle?.html_content" class="markdown-body html-render"></div>

            <!-- 文章底部信息 -->
            <div class="article-footer">
                <div class="article-tags" v-if="currArticle?.tags">
                    <span class="tag" v-for="tag in currArticle?.tags" :key="tag">#{{ tag }}</span>
                </div>
            </div>

            <!-- 上下篇导航 -->
            <div class="article-navigation" v-if="hasPrev || hasNext">
                <div class="nav-item prev" v-if="hasPrev" @click="handleArticleClick(prev)">
                    <div class="nav-label">
                        <Icon type="leftArrow" fontSize="16px" />
                        上一篇
                    </div>
                    <h4>{{ prev?.title }}</h4>
                </div>
                <div class="nav-spacer" v-if="!hasPrev"></div>

                <div class="nav-item next" v-if="hasNext" @click="handleArticleClick(next)">
                    <div class="nav-label">
                        下一篇
                        <Icon type="rightArrow" fontSize="16px" />
                    </div>
                    <h4>{{ next?.title }}</h4>
                </div>
                <div class="nav-spacer" v-if="!hasNext"></div>
            </div>

            <!-- 评论区域 -->
            <div class="comments-section">
                <div class="comments-header">
                    <h3>评论区</h3>
                    <span class="comments-count">{{ commentTotal }} 条评论</span>
                </div>

                <Comment ref="commentForm" class="comment-form" :loading="commentLoading" @submit="handlePostComment" />

                <div class="comments-list">
                    <div v-if="commentList.length > 0">
                        <CommentItem v-for="item in commentList" :key="item.id" :comment="item" />
                    </div>
                    <Empty v-else emptyText="暂无评论，快来抢沙发吧！" />
                </div>

                <div class="comments-pagination">
                    <Pager :total="commentTotal" :currentPage="commentListPage" @pageChange="handlePageChange" />
                </div>
            </div>
        </div>

        <!-- 右侧目录导航 -->
        <div class="blog_detail_sidebar_right" :class="{ 'mobile-active': showToc }">
            <div class="sidebar-header">
                <h3>目录</h3>
                <button class="close-btn" @click="showToc = false">
                    <Icon type="close" fontSize="20px" />
                </button>
            </div>
            <BlogNav :toc="currArticle?.toc" :isRoot="true" :active-id="activeHeadingId" @handleClick="handleNavClick" />
        </div>

        <!-- 移动端浮动按钮 -->
        <div class="mobile-actions">
            <button class="action-btn toc-btn" @click="showToc = !showToc" :class="{ active: showToc }">
                <Icon type="list" fontSize="20px" />
                <span>目录</span>
            </button>
            <button class="action-btn articles-btn" @click="showArticleList = !showArticleList" :class="{ active: showArticleList }">
                <Icon type="articles" fontSize="20px" />
                <span>文章</span>
            </button>
        </div>

        <!-- 移动端遮罩层 -->
        <div class="mobile-overlay" v-if="showToc || showArticleList" @click="closeMobileMenus"></div>
    </div>
</template>

<script setup>
import ArticleList from './components/ArticleList.vue';
import Pager from '@/components/pager/index.vue';
import BlogNav from './components/BlogNav.vue';
import CommentItem from './components/CommentItem.vue';
import Comment from './components/Comment.vue';
import Empty from '@/components/empty/index.vue';
import Icon from '@/components/icon/index.vue';
import hljs from 'highlight.js';
import { ref, getCurrentInstance, onMounted, computed, nextTick, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { parseTime } from '@/utils';
import toast from '@/utils/toast/index';

const { $api } = getCurrentInstance().proxy;
const route = useRoute();
const router = useRouter();
const activeHeadingId = ref('');
const loading = ref(false);
const articleContent = ref(null);
const articleObserver = ref(null);
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
const commentForm = ref(null);
const commentLoading = ref(false);

// 移动端状态
const showToc = ref(false);
const showArticleList = ref(false);
const readingProgress = ref(0);

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

// 关闭移动端菜单
const closeMobileMenus = () => {
    showToc.value = false;
    showArticleList.value = false;
};

// 计算阅读进度
const updateReadingProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) {
        readingProgress.value = 0;
        return;
    }

    const progress = (scrollTop / scrollHeight) * 100;
    readingProgress.value = Math.min(100, Math.max(0, progress));
};

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
    // 移动端关闭目录
    if (window.innerWidth <= 768) {
        showToc.value = false;
    }
};

// 检测是否浏览完文章
const setupArticleObserver = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    addScanNumber();
                    observer.disconnect();
                }
            });
        },
        { threshold: 1 }
    );
    const articleFooter = document.querySelector('.article-footer');
    articleFooter && observer.observe(articleFooter);
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
        if (window.location.hash) {
            handleNavClick(window.location.hash.slice(1));
        }
    }
};

const getCommentList = async () => {
    loading.value = true;
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
    loading.value = false;
};

const handlePageChange = (page) => {
    commentListPage.value = page;
    getCommentList();
};

const handleArticleClick = (item) => {
    if (item.id === currArticleid.value) return;

    // 关闭移动端菜单
    closeMobileMenus();

    // 更新当前文章ID
    currArticleid.value = item.id;

    // 更新路由，保持URL与当前文章一致
    router.push({
        path: `/blog/${route.params.id}`,
        query: {
            article_id: item.id,
            name: route.query.name,
            icon: route.query.icon,
        },
    });

    // 重置阅读进度
    readingProgress.value = 0;

    //重新获取评论列表
    getCommentList();

    // 跳转到页面顶部
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, 100);
};

const applyHighlight = () => {
    document.querySelectorAll('.html-render pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
};

const handlePostComment = async (commentData) => {
    commentLoading.value = true;
    try {
        const data = {
            article_id: currArticleid.value,
            content: commentData.content,
            nickname: commentData.nickname,
        };
        const res = await $api({ type: 'postComment', data });
        if (res.code === 0) {
            commentForm.value.reset();
            toast({
                type: 'success',
                message: '评论发布成功',
                duration: 2000,
            });
            setTimeout(() => {
                getCommentList(); // 刷新评论列表
            }, 200);
        }
    } catch (error) {
        console.error('评论发布失败', error);
        toast({
            type: 'error',
            message: '评论发布失败，请稍后再试',
            duration: 2000,
        });
    } finally {
        commentLoading.value = false;
    }
};

const init = async () => {
    loading.value = true;
    window.location.hash = '';
    await getArticle();
    await getCommentList();
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (hash) handleNavClick(hash);
    });
    if (route.query.article_id) {
        currArticleid.value = route.query.article_id;
    }
    loading.value = false;
};

watch(currArticle, async () => {
    await nextTick();
    applyHighlight();
    const observer = setupScrollObserver();
    if (articleObserver.value) {
        articleObserver.value.disconnect();
    }
    articleObserver.value = setupArticleObserver();
    return () => observer?.disconnect();
});

onMounted(() => {
    init();
    // 添加滚动监听
    window.addEventListener('scroll', updateReadingProgress);
    // 初始化进度
    updateReadingProgress();
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateReadingProgress);
});
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;
@use '@/css/mixin.scss' as *;

.blog_detail_wrap {
    display: grid;
    grid-template-columns: 280px 1fr 260px;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    position: relative;
    box-sizing: border-box;
    width: 100%;

    @include respond-to('large') {
        grid-template-columns: 260px 1fr 240px;
        gap: 25px;
        max-width: 1200px;
        padding: 20px 15px;
    }

    @include respond-to('middle') {
        grid-template-columns: 1fr 240px;
        gap: 25px;
        padding: 20px 15px;
    }

    @include respond-to('small') {
        grid-template-columns: 1fr;
        gap: 0;
        padding: 15px;
        min-height: auto;
        overflow-x: hidden;
    }
}

// 阅读进度条
.reading-progress {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(var(--borderMainColorRGB), 0.1);
    z-index: 999;
    overflow: hidden;

    @include respond-to('small') {
        height: 3px;
    }

    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--textHoverColor) 0%, var(--textHoverSecColor) 50%, #ff6b6b 100%);
        border-radius: 0 2px 2px 0;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        box-shadow: 0 0 10px rgba(var(--textHoverColorRGB), 0.3);

        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 20px;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
            animation: shimmer 2s infinite;
        }
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-20px);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateX(20px);
        opacity: 0;
    }
}

// 确保整体布局的滚动平滑
html {
    scroll-behavior: smooth;
}

// 为侧边栏添加滚动条样式
.blog_detail_sidebar_left,
.blog_detail_sidebar_right {
    background-color: var(--mainBgColor);
    border-radius: 12px;
    padding: 20px;
    height: fit-content;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    position: sticky;
    top: 90px;
    border: 1px solid var(--borderMainColor);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    align-self: start; // 确保从顶部对齐

    @include respond-to('large') {
        padding: 18px;
        max-height: calc(100vh - 130px);
        top: 85px;
    }

    @include respond-to('middle') {
        &.blog_detail_sidebar_left {
            display: none;
        }
        padding: 18px;
        max-height: calc(100vh - 130px);
        top: 85px;
    }

    @include respond-to('small') {
        display: none;
        position: fixed;
        top: 64px;
        left: 0;
        bottom: 0;
        width: 85%;
        max-width: 320px;
        height: calc(100vh - 64px);
        max-height: none;
        border-radius: 0;
        border: none;
        z-index: 1001;
        transform: translateX(-100%);
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        opacity: 0;
        padding: 20px;

        &.mobile-active {
            display: block;
            transform: translateX(0);
            opacity: 1;
            animation: slideInLeft 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        &.blog_detail_sidebar_right {
            left: auto;
            right: 0;
            transform: translateX(100%);

            &.mobile-active {
                transform: translateX(0);
                animation: slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            }
        }
    }

    // 自定义滚动条样式
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(var(--borderMainColorRGB), 0.1);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(var(--textSecColorRGB), 0.3);
        border-radius: 3px;

        &:hover {
            background: rgba(var(--textHoverColorRGB), 0.5);
        }

        &:active {
            background: rgba(var(--textHoverColorRGB), 0.7);
        }
    }
}

// 右侧目录导航特殊处理
.blog_detail_sidebar_right {
    overflow-y: hidden; // 让BlogNav组件自己控制滚动
}

.sidebar-header {
    display: none;

    @include respond-to('small') {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--borderMainColor);

        h3 {
            margin: 0;
            font-size: 18px;
            color: var(--textMainColor);
            font-weight: 600;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--textSecColor);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: var(--thirdBgColor);
                color: var(--textMainColor);
                transform: scale(1.1);
            }
        }
    }
}

// 主要内容区域
.blog_detail_content {
    background-color: var(--mainBgColor);
    border-radius: 12px;
    overflow-x: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--borderMainColor);
    align-self: start; // 确保从顶部对齐
    width: 100%;
    max-width: 750px; // 限制最大宽度
    margin: 0 auto; // 居中显示
    min-width: 0; // 防止flex子项溢出

    @include respond-to('large') {
        max-width: 700px;
    }

    @include respond-to('middle') {
        max-width: none; // 中屏移除限制
    }

    @include respond-to('small') {
        border-radius: 8px;
        margin-bottom: 80px; // 为移动端浮动按钮腾出空间
        max-width: none;
    }
}

// 文章头部
.article-header {
    padding: 40px 50px 30px;
    border-bottom: 1px solid var(--borderMainColor);
    background: linear-gradient(135deg, var(--mainBgColor) 0%, var(--secBgColor) 100%);

    @include respond-to('large') {
        padding: 35px 45px 25px;
    }

    @include respond-to('middle') {
        padding: 30px 40px 25px;
    }

    @include respond-to('small') {
        padding: 25px 20px 20px;
    }

    .article-meta {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;

        @include respond-to('small') {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 15px;
        }

        .category {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background-color: var(--thirdBgColor);
            border-radius: 20px;
            font-size: 14px;
            color: var(--textHoverColor);
            font-weight: 500;

            img {
                width: 16px;
                height: 16px;
            }
        }

        .date {
            color: var(--textSecColor);
            font-size: 14px;
        }
    }

    .article-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--textMainColor);
        line-height: 1.3;
        margin: 0 0 20px;

        @include respond-to('small') {
            font-size: 1.8rem;
            margin-bottom: 15px;
        }
    }

    .article-stats {
        display: flex;
        gap: 24px;

        @include respond-to('small') {
            gap: 16px;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--textSecColor);
            font-size: 14px;
        }
    }
}

// Markdown内容
.markdown-body {
    padding: 40px 50px;
    line-height: 1.8;
    font-size: 16px;
    color: var(--textMainColor);
    max-width: 100%;
    margin: 0 auto;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;

    @include respond-to('large') {
        padding: 35px 45px;
    }

    @include respond-to('middle') {
        padding: 30px 40px;
        font-size: 15px;
    }

    @include respond-to('small') {
        padding: 25px 20px;
        font-size: 15px;
    }

    // 覆盖markdown样式文件中的滚动条样式
    .highlight pre::-webkit-scrollbar,
    pre::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .highlight pre::-webkit-scrollbar-track,
    pre::-webkit-scrollbar-track {
        background: rgba(var(--borderMainColorRGB), 0.1) !important;
        border-radius: 3px;
    }

    .highlight pre::-webkit-scrollbar-thumb,
    pre::-webkit-scrollbar-thumb {
        background: rgba(var(--textSecColorRGB), 0.3) !important;
        border-radius: 3px;

        &:hover {
            background: rgba(var(--textHoverColorRGB), 0.5) !important;
        }

        &:active {
            background: rgba(var(--textHoverColorRGB), 0.7) !important;
        }
    }

    // 标题样式
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-top: 2em;
        margin-bottom: 1em;
        font-weight: 600;
        line-height: 1.4;
        color: var(--textMainColor);

        &:first-child {
            margin-top: 0;
        }
    }

    h1 {
        font-size: 2rem;
        border-bottom: 2px solid var(--borderMainColor);
        padding-bottom: 0.5em;
    }

    h2 {
        font-size: 1.7rem;
        border-bottom: 1px solid var(--borderMainColor);
        padding-bottom: 0.3em;
    }

    h3 {
        font-size: 1.4rem;
    }

    // 段落和文本
    p {
        margin: 1.2em 0;
        text-align: justify;
    }

    // 代码块
    pre {
        background-color: var(--secBgColor);
        border-radius: 8px;
        padding: 20px;
        overflow-x: auto;
        margin: 1.5em 0;
        border: 1px solid var(--borderMainColor);
        max-width: 100%;
        box-sizing: border-box;

        @include respond-to('small') {
            padding: 15px;
            font-size: 14px;
            margin: 1em 0;
        }

        code {
            background: none;
            padding: 0;
            font-size: 14px;
            word-break: break-all;

            @include respond-to('small') {
                font-size: 13px;
            }
        }
    }

    // 内联代码
    code {
        background-color: var(--thirdBgColor);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 90%;
        color: var(--textHoverColor);
    }

    // 引用块
    blockquote {
        border-left: 4px solid var(--textHoverColor);
        padding: 0 1em;
        margin: 1.5em 0;
        color: var(--textSecColor);
        background-color: var(--thirdBgColor);
        border-radius: 0 8px 8px 0;

        p:first-child {
            margin-top: 0;
        }

        p:last-child {
            margin-bottom: 0;
        }
    }

    // 列表
    ul,
    ol {
        padding-left: 2em;
        margin: 1em 0;

        li {
            margin: 0.5em 0;
        }
    }

    // 表格
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 1.5em 0;
        overflow-x: auto;
        display: block;
        white-space: nowrap;

        @include respond-to('small') {
            font-size: 14px;
        }

        thead tr {
            background-color: var(--thirdBgColor);
        }

        th,
        td {
            border: 1px solid var(--borderMainColor);
            padding: 12px;
            text-align: left;

            @include respond-to('small') {
                padding: 8px;
            }
        }

        th {
            font-weight: 600;
            color: var(--textMainColor);
        }

        tr:nth-child(even) {
            background-color: var(--secBgColor);
        }
    }

    // 图片
    img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1em 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

        @include respond-to('small') {
            margin: 0.8em 0;
        }
    }

    // 水平分割线
    hr {
        border: none;
        height: 2px;
        background: linear-gradient(to right, transparent, var(--borderMainColor), transparent);
        margin: 2em 0;
    }

    // 移动端表格优化
    @include respond-to('small') {
        table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;

            thead,
            tbody,
            tr {
                display: table;
                width: 100%;
                table-layout: fixed;
            }

            th,
            td {
                white-space: normal;
                word-wrap: break-word;
            }
        }
    }

    // 锚点图标
    [id] {
        position: relative;
    }
}

// 文章底部
.article-footer {
    padding: 30px 50px;
    border-top: 1px solid var(--borderMainColor);

    @include respond-to('large') {
        padding: 30px 45px;
    }

    @include respond-to('middle') {
        padding: 25px 40px;
    }

    @include respond-to('small') {
        padding: 20px 20px;
    }

    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .tag {
            padding: 4px 12px;
            background-color: var(--thirdBgColor);
            color: var(--textHoverColor);
            border-radius: 16px;
            font-size: 14px;
            font-weight: 500;
        }
    }
}

// 文章导航
.article-navigation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 30px 50px;
    border-top: 1px solid var(--borderMainColor);

    @include respond-to('large') {
        padding: 30px 45px;
        gap: 20px;
    }

    @include respond-to('middle') {
        padding: 25px 40px;
        gap: 15px;
    }

    @include respond-to('small') {
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 20px 20px;
    }

    .nav-item {
        padding: 20px;
        border: 1px solid var(--borderMainColor);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            border-color: var(--textHoverColor);
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        &.next {
            text-align: right;

            @include respond-to('small') {
                text-align: left;
            }
        }

        .nav-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--textSecColor);
            margin-bottom: 8px;

            &:has(.icon) {
                justify-content: flex-start;
            }
        }

        h4 {
            margin: 0;
            font-size: 16px;
            color: var(--textHoverColor);
            line-height: 1.4;
        }
    }

    .nav-spacer {
    }
}

// 评论区域
.comments-section {
    padding: 40px 50px;
    border-top: 1px solid var(--borderMainColor);

    @include respond-to('large') {
        padding: 35px 45px;
    }

    @include respond-to('middle') {
        padding: 30px 40px;
    }

    @include respond-to('small') {
        padding: 25px 20px;
    }

    .comments-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--borderMainColor);

        h3 {
            margin: 0;
            font-size: 24px;
            color: var(--textMainColor);

            @include respond-to('small') {
                font-size: 20px;
            }
        }

        .comments-count {
            color: var(--textSecColor);
            font-size: 14px;
            padding: 4px 12px;
            background-color: var(--thirdBgColor);
            border-radius: 12px;

            @include respond-to('small') {
                font-size: 12px;
                padding: 3px 8px;
            }
        }
    }

    .comment-form {
        margin-bottom: 40px;
        padding: 20px;
        background-color: var(--secBgColor);
        border-radius: 12px;
        border: 1px solid var(--borderMainColor);

        @include respond-to('small') {
            margin-bottom: 30px;
            padding: 16px;
            border-radius: 8px;
        }
    }

    .comments-list {
        margin-bottom: 30px;

        .comment_wrap {
            margin-bottom: 20px;
            padding: 20px;
            background-color: var(--mainBgColor);
            border-radius: 12px;
            border: 1px solid var(--borderMainColor);
            transition: all 0.2s ease;

            @include respond-to('small') {
                margin-bottom: 16px;
                padding: 16px;
                border-radius: 8px;
            }

            &:hover {
                border-color: var(--textHoverSecColor);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
        }
    }

    .comments-pagination {
        display: flex;
        justify-content: center;
        padding-top: 20px;
        border-top: 1px solid var(--borderMainColor);
    }
}

// 移动端浮动按钮
.mobile-actions {
    display: none;

    @include respond-to('small') {
        display: flex;
        position: fixed;
        bottom: 20px;
        right: 20px;
        gap: 12px;
        z-index: 1000;
    }

    .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background-color: var(--mainBgColor);
        border: 1px solid var(--borderMainColor);
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.3s;
        color: var(--textSecColor);

        &:hover,
        &.active {
            background-color: var(--textHoverColor);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        span {
            font-size: 10px;
            margin-top: 2px;
            font-weight: 500;
        }
    }
}

// 移动端遮罩层
.mobile-overlay {
    display: none;

    @include respond-to('small') {
        display: block;
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        backdrop-filter: blur(3px);
        animation: fadeIn 0.3s ease forwards;
    }
}

// 动画关键帧
@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
