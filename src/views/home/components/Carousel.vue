<template>
    <div class="carousel_container">
        <Avatar size="8vw" class="avatar" />

        <Icon @click="handleClick(currIdx - 1)" :style="{ opacity: currIdx === 1 ? '0' : '1' }" type="topArrow" class="arrow top" fontSize="40px" />

        <ul class="pointer_wrap">
            <li v-for="(item, idx) in props.carouselList" :class="['pointer_item', currIdx === idx + 1 ? 'active' : '']" :key="item.id" @click="currIdx = idx + 1"></li>
        </ul>

        <div class="carousel_wrap" :style="{ transform: translateY }">
            <CarouselItem v-for="(item, index) in props.carouselList" :idx="index + 1" :currIdx="currIdx" :key="index" :carouselItem="item"></CarouselItem>
        </div>

        <Icon
            @click="handleClick(currIdx + 1)"
            :style="{
                opacity: currIdx === props.carouselList.length ? '0' : '1',
            }"
            type="bottomArrow"
            class="arrow bottom"
            fontSize="40px" />
    </div>
</template>

<script setup>
import Avatar from '@/components/avatar/index.vue';
import Icon from '@/components/icon/index.vue';
import CarouselItem from './CarouselItem.vue';
import { ref, defineProps, computed, onMounted } from 'vue';

const currIdx = ref(1);

const props = defineProps({
    carouselList: {
        type: Array,
        default: () => [],
    },
});

const translateY = computed(() => {
    return `translateY(-${(currIdx.value - 1) * 100}%)`;
});

const handleClick = (idx) => {
    currIdx.value = Math.max(1, Math.min(idx, props.carouselList.length));
};
</script>

<style scoped lang="scss">
.carousel_container {
    position: relative;
    overflow: hidden;
}

.carousel_wrap {
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
}

.pointer_wrap {
    position: fixed;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.pointer_item {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-bottom: 10px;
    background-color: #393838;
    transition: 0.3s;
    cursor: pointer;
}

.pointer_item.active {
    background-color: #fff;
}

.arrow {
    color: #d9d9d9;
    z-index: 10;
    position: fixed;
    left: calc(50% - 20px);
    cursor: pointer;
}

.top {
    top: 30px;
    animation: jumpUp 2s infinite;
}

.bottom {
    bottom: 30px;
    animation: jumpDown 2s infinite;
}

.avatar {
    position: absolute;
    top: 18%;
    left: calc(50% - 5vw);
    transform: translateX(-50%);
    z-index: 10;
    pointer-events: none;
}

// 移动端头像放大
@media (max-width: 768px) {
    .avatar {
        top: 15%;
        left: calc(50% - 6vw);

        :deep(img) {
            width: 20vw !important;
            height: 20vw !important;
        }
    }
}

@keyframes jumpUp {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
    100% {
        transform: translateY(0);
    }
}

@keyframes jumpDown {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(20px);
    }
    100% {
        transform: translateY(0);
    }
}
</style>
