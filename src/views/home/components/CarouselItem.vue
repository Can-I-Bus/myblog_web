<template>
    <div class="carousel_item_wrap" ref="carousel" @mousemove="handleMove" @mouseleave="handleLeave" @mouseenter="handleEnter">
        <div class="carousel_item_info">
            <p ref="title">{{ carouselItem.title }}</p>
            <p ref="desc">{{ carouselItem.description }}</p>
        </div>
        <ImgLoader ref="imgLoader" :smallImg="carouselItem.mid_img" :bigImg="carouselItem.big_img" @loaded="handleLoad" />
    </div>
</template>

<script setup>
import Carousel from './Carousel.vue';
import ImgLoader from '@/components/imgLoader/index.vue';
import { ref, defineProps, onMounted, watch } from 'vue';

const props = defineProps({
    carouselItem: {
        type: Object,
        default: () => {},
    },
    currIdx: {
        type: Number,
    },
    idx: {
        type: Number,
    },
});

const carousel = ref(null);
const imgLoader = ref(null);
const title = ref(null);
const desc = ref(null);
const isBannerLoaded = ref(false);
const isInited = ref(false);
const extra = ref({
    width: 0,
    height: 0,
});

const handleMove = (e) => {
    const transformX = (-extra.value.width / window.innerWidth) * e.clientX;
    const transformY = (-extra.value.height / window.innerHeight) * e.clientY;
    carousel.value.style.transform = `translate(${transformX}px,${transformY}px)`;
};

const handleLeave = () => {
    carousel.value.style.transition = 'transform 0.5s ease';
    carousel.value.style.transform = 'translate(-5vw,-5vh)';
    setTimeout(() => {
        carousel.value.style.transition = 'none';
    }, 500);
};

const handleEnter = () => {
    if (carousel.value) {
        carousel.value.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            carousel.value.style.transition = 'none';
        }, 200);
    }
};

const initExtra = () => {
    if (carousel.value) {
        carousel.value.style.transform = 'translate(-5vw,-5vh)';
        extra.value.width = carousel.value.offsetWidth - window.innerWidth;
        extra.value.height = carousel.value.offsetHeight - window.innerHeight;
    }
};

const handleLoad = () => {
    isBannerLoaded.value = true;
};

const initText = () => {
    const titleWidth = title.value.clientWidth;
    const descWidth = desc.value.clientWidth;
    title.value.style.width = 0;
    desc.value.style.width = 0;
    title.value.style.opacity = 1;
    desc.value.style.opacity = 1;
    title.value.clientWidth; //reflow
    title.value.style.transition = '2s';
    title.value.style.width = titleWidth + 'px';
    setTimeout(() => {
        desc.value.clientWidth; //reflow
        desc.value.style.transition = '2s';
        desc.value.style.width = descWidth + 'px';
        isInited.value = true;
    }, 2000);
};

onMounted(() => {
    initExtra();
});

watch(
    () => props.currIdx,
    (val) => {
        if (!isBannerLoaded.value || isInited.value) return;
        if (props.idx === val) {
            console.log('watch props.currIdx', props.idx, props.currIdx, isBannerLoaded.value, val);
            title.value.clientWidth;
            initText();
        }
    },
    { immediate: true }
);

watch(
    () => isBannerLoaded.value,
    (val) => {
        if (props.currIdx !== props.idx || !val) return;
        console.log('watch isBannerLoaded', props.idx, props.currIdx, val);
        title.value.clientWidth;
        initText();
    },
    { immediate: true }
);
</script>

<style scoped lang="scss">
@use '@/css/media.scss' as *;

.carousel_item_wrap {
    height: 100%;
    width: 100%;
    position: relative;
}

.carousel_item_info {
    z-index: 10;
    position: absolute;
    top: 40%;
    left: calc(50%);
    transform: translateX(-50%);
    color: #fff;
    text-align: center;
    text-shadow: 1px 8px 4px rgba(0, 0, 0, 0.5);

    p {
        opacity: 0;
        overflow: hidden;
        white-space: nowrap;
    }

    p:nth-of-type(1) {
        font-size: 40px;
        margin-bottom: 20px;

        @include respond-to('small') {
            font-size: 28px;
            margin-bottom: 15px;
        }
    }

    .desc-text {
        position: relative;
        display: inline-block;
        font-size: 28px;

        @include respond-to('small') {
            font-size: 18px;
        }

        &::after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            height: 1em;
            width: 1px;
            background-color: #fff;
            animation: almostToShadow 0.8s ease-in-out infinite;
        }
    }
}

@keyframes almostToShadow {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 0.8;
    }
}
</style>
