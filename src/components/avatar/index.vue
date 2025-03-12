<template>
    <div class="avatar1111">
        <img
            src="../../../public/avatar.png"
            :style="{ height: size, width: size }"
        />
    </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    size: {
        type: String,
        default: '50px',
    },
})
</script>
<style scoped lang='scss'>
img {
    border-radius: 50%;
    animation: rotate 10s linear infinite;
}
@keyframes rotate {
    0%,
    100% {
        border-radius: 67% 33% 70% 45% / 45% 54% 46% 70%;
    }

    12.5% {
        border-radius: 60% 40% 65% 42% / 42% 60% 40% 65%;
    }
    25% {
        border-radius: 50%;
    }
    37.5% {
        border-radius: 40% 60% 42% 65% / 65% 40% 60% 42%;
    }
    50% {
        border-radius: 40% 70% 40% 80% / 80% 40% 70%;
    }
    62.5% {
        border-radius: 40% 80% 40% 70% / 70% 40% 80%;
    }
    75% {
        border-radius: 36% 90% / 90% 36% 36% 90%;
    }
    87.5% {
        border-radius: 40% 70% 40% 60% / 60% 40% 70%;
    }
}
</style>