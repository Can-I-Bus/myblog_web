<template>
    <div class="home_wrap">
        <div class="nav">
            <router-link class="nav_item" to="/about">关于我</router-link>
            <router-link class="nav_item" to="/blog">博客</router-link>
            <router-link class="nav_item" to="/demo"> 一些demo </router-link>
            <router-link class="nav_item" to="/message"> 留言墙 </router-link>
        </div>

        <Carousel ref="carousel" class="carousel_com_wrap" @mousemove="handleMove" :carouselList="bannerList" />
    </div>
</template>

<script setup>
import Carousel from './components/Carousel.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const { $api } = getCurrentInstance().proxy;

const bannerList = ref([]);

const getBannerList = async () => {
    const res = await $api({ type: 'getBannerList' });
    if (res.code === 0) {
        bannerList.value = res.data;
    }
};

onMounted(() => {
    getBannerList();
});
</script>

<style scoped lang="scss">
@use '../../css/mixin.scss' as *;
.carousel_com_wrap {
    height: 110vh;
    width: 110vw;
}
.home_wrap {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .nav {
        @include flexAlianCenter();
        justify-content: flex-end;
        z-index: 10;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        padding-right: 30px;
        gap: 20px;
        .nav_item {
            font-size: 14px;
            color: #f1f0f0;
            text-shadow: 1px 0 0 rgba(0, 0, 0, 0.6), 0 0 0 rgba(0, 0, 0, 0.6), 0 1px 0 rgba(0, 0, 0, 0.6), 0 1px 0 rgba(0, 0, 0, 0.6);
        }
    }
}
</style>
