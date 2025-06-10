<template>
    <div class="home_body">
        <div class="home_body_left" :class="{ 'mobile-active': activeTab === 'info' }">
            <MyInfo class="sticky-info" />
        </div>
        <div class="home_body_main">
            <div class="home_body_main_top" :class="{ 'mobile-active': activeTab === 'info' }">
                <div>
                    <h2>Description</h2>
                    <p>💻 一名Web developmenter</p>
                    <p>🧠 想到有趣的点子就会去实现</p>
                    <p>🧑‍💻 努力成为一名更好的开发者</p>
                </div>
                <div>
                    <Signature />
                </div>
            </div>
            <div class="home_body_main_part_one" :class="{ 'mobile-active': activeTab === 'experience' }">
                <h2>About Me</h2>
                <div>
                    <div class="home_body_main_part_one_item">
                        <div>
                            <p>前端开发工程师💻</p>
                            <p>热爱技术，不断提升，致力于成为更优秀的开发者</p>
                        </div>
                    </div>
                    <div class="home_body_main_part_one_item">
                        <div>
                            <p>持续学习🧠</p>
                            <p>保持对新技术的好奇心，不断探索前端领域的最新发展，乐于分享技术心得。</p>
                        </div>
                    </div>
                    <div class="home_body_main_part_one_item">
                        <div>
                            <p>创意实践💡</p>
                            <p>将创意转化为实际项目与demo，注重用户体验与代码质量，追求技术与体验的平衡</p>
                        </div>
                    </div>
                    <div class="home_body_main_part_one_item">
                        <div>
                            <p>爱喝咖啡☕️</p>
                            <p>一杯咖啡，一段代码，普通简单而充实的工作日常。</p>
                        </div>
                    </div>
                    <div class="home_body_main_part_one_item">
                        <div>
                            <p>喜欢美食🍔</p>
                            <p>喜欢美食，喜欢探店，喜欢有烟火气的街边小摊和苍蝇馆子，喜欢做菜</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="home_body_main_part_two" :class="{ 'mobile-active': activeTab === 'demo' }">
                <h2>一些项目与demo，产自下班后与周末的闲暇空余时间</h2>
                <div>
                    <div v-for="item in demoList" :key="item.id" class="home_body_main_part_two_item">
                        <img style="margin-right: 10px" :src="item.thumb" />
                        <div>
                            <p>{{ item.name }}</p>
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="home_body_right" :class="{ 'mobile-active': activeTab === 'blog' }">
            <div class="blog-section">
                <div class="blog-header">
                    <h2>Blog | 博客</h2>
                    <div class="blog-subtitle">
                        <span>探索技术世界</span>
                    </div>
                </div>
                <div class="blog-category-container">
                    <BlogCategory :categoryList="blogCategoryList" @handleClick="handleClick" />
                </div>
            </div>
        </div>

        <!-- 移动端展示的底部导航 -->
        <div class="mobile-nav-tabs">
            <div class="tab" @click="activeTab = 'info'" :class="{ active: activeTab === 'info' }">
                <span>简介</span>
            </div>
            <div class="tab" @click="activeTab = 'experience'" :class="{ active: activeTab === 'experience' }">
                <span>关于我</span>
            </div>
            <div class="tab" @click="activeTab = 'demo'" :class="{ active: activeTab === 'demo' }">
                <span>Demo</span>
            </div>
            <div class="tab" @click="activeTab = 'blog'" :class="{ active: activeTab === 'blog' }">
                <span>博客</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import Icon from '@/components/icon/index.vue';
import MyInfo from '@/components/myInfo/index.vue';
import Signature from '@/components/signature/index.vue';
import BlogCategory from './components/BlogCategory.vue';
import baseConfig from '@/config/http.config';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const { $api } = getCurrentInstance().proxy;
const demoList = ref([]);
const blogCategoryList = ref([]);
const activeTab = ref('info'); // 控制移动端当前激活的标签

const getDemos = async () => {
    const data = { page: 1, limit: 10 };
    const res = await $api({ type: 'getDemoList', data });
    if (res.code === 0) {
        demoList.value = res?.data?.rows ?? [];
    }
};

const getBlogCategoryList = async () => {
    const res = await $api({ type: 'getBlogCategoryList' });
    if (res.code === 0) {
        blogCategoryList.value = res?.data ?? [];
    }
};

const handleClick = (id) => {
    let seamItem = null;

    const findItem = (items, _id) => {
        for (const item of items) {
            if (item.id === _id) {
                seamItem = item;
                return true;
            }
            if (item.children && findItem(item.children, _id)) {
                return true;
            }
        }
        return false;
    };

    findItem(blogCategoryList.value, id);

    if (!seamItem) {
        console.error('未找到匹配的博客分类');
        return;
    }

    router.push({
        path: `/blog/${id}`,
        query: {
            name: seamItem.name,
            icon: seamItem.icon,
        },
    });
};

onMounted(() => {
    getDemos();
    getBlogCategoryList();
});
</script>
<style scoped lang="scss">
@use '../../css/media.scss' as *;
@use '../../css/mixin.scss' as *;
@mixin baseH2($mb, $fz) {
    font-size: $fz;
    font-weight: 600;
    margin-bottom: $mb;
    color: var(--textMainColor);
}
@mixin baseP($fz, $mb) {
    font-size: $fz;
    margin-bottom: $mb;
    font-weight: 300;
    color: var(--textMainColor);
    opacity: 0.7;
}
.home_body {
    display: grid;
    grid-template-columns: 1fr 7fr 2fr;
    gap: 80px;
    max-width: 1500px;
    margin: 0 auto;
    height: calc(100vh - 64px);
    padding: calc(64px + 3vh) 80px 30px 80px;
    overflow: hidden;
    position: relative;

    // 平板响应式
    @include respond-to('middle') {
        grid-template-columns: 1fr 5fr 2fr;
        gap: 40px;
        padding: calc(64px + 2vh) 40px 20px 40px;
    }

    // 移动端响应式
    @include respond-to('small') {
        grid-template-columns: 1fr;
        gap: 30px;
        padding: 20px 20px 80px 20px; // 底部增加padding为移动导航腾出空间
        height: auto;
        overflow-y: auto; // 确保整个页面可滚动
        overflow-x: hidden;

        // 在移动端默认隐藏所有部分，仅通过activeTab控制显示
        .home_body_left,
        .home_body_main_top,
        .home_body_main_part_one,
        .home_body_main_part_two,
        .home_body_right {
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;

            &.mobile-active {
                display: block;
                opacity: 1;
                transform: translateY(0);
                animation: fade-in 0.3s ease forwards;
            }
        }
    }

    &_left {
        @include respond-to('small') {
            order: 1;
            margin-bottom: 20px;
        }

        .sticky-info {
            position: sticky;
            top: 0;

            @include respond-to('small') {
                position: relative;
            }
        }
    }

    &_main {
        overflow: auto;
        /* 隐藏滚动条但保持滚动功能 */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }

        @include respond-to('small') {
            order: 2;
            overflow: visible; // 移动端不需要滚动
        }

        &_top {
            @include bottomLine(100%, -30px);
            margin-bottom: 80px;
            display: grid;
            grid-template-columns: 1fr auto;

            @include respond-to('small') {
                grid-template-columns: 1fr;
                margin-bottom: 40px;
                text-align: center; // 居中文字
                display: flex;
                flex-direction: column;
                align-items: center; // 居中内容
                justify-content: center;
                min-height: calc(100vh - 180px); // 适当的高度让内容居中
                padding: 20px 0;

                > div:first-child {
                    width: 100%;
                    max-width: 500px; // 限制最大宽度
                }

                > div:last-child {
                    display: none; // 移动端隐藏签名
                }
            }

            h2 {
                @include baseH2(32px, 40px);

                @include respond-to('small') {
                    @include baseH2(20px, 28px);
                }
            }

            p {
                @include baseP(18px, 22px);

                @include respond-to('small') {
                    @include baseP(16px, 16px);
                }
            }
        }

        &_part_one,
        &_part_two {
            @include bottomLine(100%, -50px);
            margin-bottom: 100px;

            @include respond-to('small') {
                margin-bottom: 50px;
            }

            h2 {
                @include baseH2(20px, 26px);

                @include respond-to('small') {
                    @include baseH2(16px, 22px);
                }
            }

            > div {
                display: grid;
                gap: 20px;
                grid-template-columns: repeat(2, minmax(0, 1fr));

                @include respond-to('small') {
                    grid-template-columns: 1fr;
                }
            }

            &_item {
                @include flexAlianCenter();
                border-radius: 14px;
                border: 1px solid var(--borderMainColor);
                padding: 16px 20px;

                @include respond-to('small') {
                    padding: 12px 16px;
                }

                p:nth-of-type(1) {
                    @include baseP(18px, 18px);
                    opacity: 1;

                    @include respond-to('small') {
                        @include baseP(16px, 14px);
                    }
                }

                p:nth-of-type(2) {
                    @include baseP(15px, 0);
                    line-height: 1.3;

                    @include respond-to('small') {
                        @include baseP(14px, 0);
                    }
                }
            }
        }

        &_part_two {
            @include bottomLine(100%, -50px);
            margin-bottom: 100px;

            @include respond-to('small') {
                margin-bottom: 50px;
            }

            h2 {
                @include baseH2(20px, 26px);

                @include respond-to('small') {
                    @include baseH2(16px, 22px);
                }
            }

            &_item {
                p:nth-of-type(1) {
                    @include baseP(18px, 10px);
                    opacity: 1;

                    @include respond-to('small') {
                        @include baseP(16px, 8px);
                    }
                }
            }
        }
    }

    &_right {
        position: sticky;
        top: 64px;
        overflow: auto;
        /* 隐藏滚动条但保持滚动功能 */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }

        @include respond-to('small') {
            order: 3;
            position: relative;
            top: 0;
        }

        .blog-section {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .blog-header {
            background-color: var(--mainBgColor);
            z-index: 3;
            position: sticky;
            top: 0;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--borderMainColor);
            margin-bottom: 20px;

            h2 {
                @include baseH2(10px, 24px);
                font-weight: 600;
                color: var(--textMainColor);
                position: relative;

                @include respond-to('small') {
                    @include baseH2(8px, 20px);
                }

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 30px;
                    height: 2px;
                    background-color: var(--textHoverColor);
                    border-radius: 1px;
                }
            }

            .blog-subtitle {
                span {
                    font-size: 13px;
                    color: var(--textSecColor);
                    font-weight: 400;
                    opacity: 0.8;

                    @include respond-to('small') {
                        font-size: 12px;
                    }
                }
            }
        }

        .blog-category-container {
            flex: 1;
            overflow-y: auto;
            padding: 4px;
            /* 隐藏滚动条但保持滚动功能 */
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
            &::-webkit-scrollbar {
                display: none; /* Chrome, Safari and Opera */
            }

            @include respond-to('small') {
                padding: 2px;
            }
        }
    }
}

// 移动端底部导航栏
.mobile-nav-tabs {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: var(--mainBgColor);
    border-top: 1px solid var(--borderMainColor);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 100;

    @include respond-to('small') {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .tab {
        @include flexColumn();
        @include flexAlianCenter();
        justify-content: center;
        width: 25%;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s;
        color: var(--textSecColor);
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 3px;
            background-color: var(--textHoverColor);
            transition: width 0.3s ease;
        }

        &.active {
            color: var(--textHoverColor);

            span {
                color: var(--textHoverColor);
            }

            &::after {
                width: 30px;
            }
        }

        span {
            font-size: 12px;
            margin-top: 4px;
            color: var(--textSecColor);
            transition: all 0.3s;
        }
    }
}

.carousel_com_wrap {
    top: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
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
