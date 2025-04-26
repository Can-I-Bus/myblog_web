<template>
    <div class="loadimg_wrap">
        <img v-if="!loadDown" class="small_img" :src="smalImgComputed" alt="!" />
        <img class="big_img" :style="{ opacity: loadDown ? 1 : 0 }" :src="bigImgComputed" alt="!" @load="loadImg" />
    </div>
</template>
<script setup>
import { ref, onMounted, defineProps, computed, defineEmits } from 'vue';
const props = defineProps({
    smallImg: {
        type: String,
    },
    bigImg: {
        type: String,
    },
});
const emits = defineEmits(['loaded']);
const loadDown = ref(false);
const smalImgComputed = computed(() => {
    return props.smallImg;
});
const bigImgComputed = computed(() => {
    return props.bigImg;
});
const loadImg = () => {
    setTimeout(() => {
        loadDown.value = true;
        emits('loaded');
    }, 500);
};
</script>
<style scoped lang="scss">
.loadimg_wrap {
    position: relative;
    width: 100%;
    height: 100%;
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.small_img {
    filter: blur(2rem);
}
.big_img {
    transition: 0.3s;
    z-index: 3;
}
</style>
