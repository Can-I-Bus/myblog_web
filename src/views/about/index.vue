<template>
    <div class="home_wrap">
        <div class="home_body">
            <MyInfo />
            <div class="home_body_main">
                <div class="home_body_main_top">
                    <div>
                        <h2>About Me</h2>
                        <p>💻一名Web developmenter</p>
                        <p>🧠一名Web developmenter</p>
                        <p>🧑‍💻一名Web developmenter</p>
                    </div>
                    <div>
                        <Signature />
                    </div>
                </div>
                <div class="home_body_main_part_one">
                    <h2>What have I been doing?</h2>
                    <div>
                        <div class="home_body_main_part_one_item">
                            <Icon />
                            <div>
                                <p>Web Developer</p>
                                <p>
                                    A Developer with a passion for creating
                                    innovative and user-friendly web
                                    applications.
                                </p>
                            </div>
                        </div>
                        <div class="home_body_main_part_one_item">
                            <Icon />
                            <div>
                                <p>Web Developer</p>
                                <p>
                                    The blog is being updated to a new version,
                                    with a more modern and responsive design.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="home_body_main_part_two">
                    <h2>
                        一些demo，突然想codeing或突然有了些想法，于是它们诞生了～
                    </h2>
                    <div>
                        <div
                            v-for="item in demoList"
                            :key="item.id"
                            class="home_body_main_part_two_item"
                        >
                            <img :src="baseConfig.baseURL + item.thumb" />
                            <div>
                                <p>{{ item.name }}</p>
                                <p>{{ item.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home_body_right">
                <h2>Blog | 博客</h2>
                <div class="home_body_right_blog_wrap">
                    <div
                        v-for="item in blogCategoryList"
                        :key="item.id"
                        class="home_body_right_blog_item"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Icon from '@/components/icon/index.vue'
import Header from '@/components/header/index.vue'
import Layout from '@/components/layout/index.vue'
import MyInfo from '@/components/myInfo/index.vue'
import Signature from '@/components/signature/index.vue'
import baseConfig from '@/config/http.config'
import { ref, onMounted, getCurrentInstance } from 'vue'
const { $api } = getCurrentInstance().proxy
const demoList = ref([])
const blogCategoryList = ref([])

const getDemos = async () => {
    const data = { page: 1, limit: 10 }
    const res = await $api({ type: 'getDemoList', data })
    if (res.code === 0) {
        demoList.value = res?.data?.rows ?? []
    }
}

const getBlogCategoryList = async () => {
    const res = await $api({ type: 'getBlogCategoryList' })
    if (res.code === 0) {
        blogCategoryList.value = res?.data ?? []
    }
}

onMounted(() => {
    getDemos()
    getBlogCategoryList()
})
</script>
<style scoped lang='scss'>
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
    height: 100vh;
    padding: calc(64px + 3vh) 80px 0 80px;
    &_main {
        &_top {
            @include bottomLine(100%, -30px);
            margin-bottom: 80px;
            display: grid;
            grid-template-columns: 1fr auto;
            h2 {
                @include baseH2(32px, 40px);
            }
            p {
                @include baseP(18px, 22px);
            }
        }
        &_part_one,
        &_part_two {
            @include bottomLine(100%, -50px);
            margin-bottom: 100px;
            h2 {
                @include baseH2(20px, 26px);
            }
            > div {
                display: grid;
                gap: 20px;
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            &_item {
                @include flexAlianCenter();
                border-radius: 14px;
                border: 1px solid var(--borderMainColor);
                padding: 16px 20px;
                p:nth-of-type(1) {
                    @include baseP(18px, 18px);
                    opacity: 1;
                }
                p:nth-of-type(2) {
                    @include baseP(15px, 0);
                    line-height: 1.3;
                }
            }
        }
        &_part_two {
            @include bottomLine(100%, -50px);
            margin-bottom: 100px;
            h2 {
                @include baseH2(20px, 26px);
            }
            &_item {
                p:nth-of-type(1) {
                    @include baseP(18px, 10px);
                    opacity: 1;
                }
            }
        }
    }
}
.carousel_com_wrap {
    top: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
</style>