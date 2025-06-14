<template>
    <div class="myinfo_wrap">
        <div class="avatar">
            <Avatar size="80px" />
            <p class="fz26">MAX</p>
        </div>
        <div class="contact-info">
            <div>
                <Icon class="icon" type="position" />
                <p>浙江省台州市椒江区</p>
            </div>
            <div>
                <Icon class="icon" type="email" />
                <p>2337833033@qq.com</p>
            </div>
        </div>
        <div class="social-links">
            <Icon class="icon" fontSize="22px" type="github" @click="handleToGithub" />
            <div class="weixin-container" @mouseenter="handleMouseEnter" @mouseleave="startMouseLeaveTimer">
                <Icon class="icon weixin-icon" fontSize="22px" type="weixin" @click="toggleQrCode" ref="weixinIcon" />
            </div>
        </div>
    </div>

    <!-- 使用teleport将二维码和遮罩层移到body下 -->
    <teleport to="body">
        <!-- 二维码 -->
        <div v-if="showQrCode" class="qrcode-teleport" :style="qrcodePosition" @mouseenter="cancelMouseLeaveTimer" @mouseleave="startMouseLeaveTimer">
            <img src="/wc.png" alt="微信二维码" />
        </div>

        <!-- 遮罩层，仅在移动端显示 -->
        <div v-if="showQrCode && isMobile" class="qrcode-mask" @click="closeQrCode"></div>
    </teleport>
</template>
<script setup>
import Avatar from '../avatar/index.vue';
import Icon from '../icon/index.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const showQrCode = ref(false);
const weixinIcon = ref(null);
const mouseLeaveTimer = ref(null);
const isMobile = ref(window.innerWidth <= 768);

const qrcodePosition = computed(() => {
    if (!weixinIcon.value) return {};

    const rect = weixinIcon.value.$el.getBoundingClientRect();
    return {
        left: `${rect.left + rect.width / 2 - 90}px`, // 180/2 = 90
        top: `${rect.bottom + 10}px`,
    };
});

const toggleQrCode = () => {
    // 仅在移动端点击时切换显示状态
    if (isMobile.value) {
        showQrCode.value = !showQrCode.value;
    }
};

const closeQrCode = () => {
    showQrCode.value = false;
};

// 监听点击事件，点击外部关闭二维码
const handleClickOutside = (event) => {
    if (!isMobile.value) return; // 仅在移动端处理点击关闭

    const weixinContainer = document.querySelector('.weixin-container');
    const qrcodeElement = document.querySelector('.qrcode-teleport');

    if (weixinContainer && !weixinContainer.contains(event.target) && qrcodeElement && !qrcodeElement.contains(event.target)) {
        showQrCode.value = false;
    }
};

// 监听窗口大小变化
const handleResize = () => {
    isMobile.value = window.innerWidth <= 768;
    if (!isMobile.value) {
        // PC端不需要通过点击控制显示
        if (!isHovering.value) {
            showQrCode.value = false;
        }
    }
};

// 跟踪鼠标是否在相关元素上
const isHovering = ref(false);

// PC端鼠标悬停处理
const handleMouseEnter = () => {
    if (!isMobile.value) {
        isHovering.value = true;
        // 取消任何现有的离开计时器
        cancelMouseLeaveTimer();
        showQrCode.value = true;
    }
};

// 开始鼠标离开计时器
const startMouseLeaveTimer = () => {
    if (!isMobile.value) {
        isHovering.value = false;
        // 使用延迟来防止闪烁
        mouseLeaveTimer.value = setTimeout(() => {
            if (!isHovering.value) {
                showQrCode.value = false;
            }
        }, 200); // 200ms延迟
    }
};

// 取消鼠标离开计时器
const cancelMouseLeaveTimer = () => {
    if (mouseLeaveTimer.value) {
        clearTimeout(mouseLeaveTimer.value);
        mouseLeaveTimer.value = null;
    }
    isHovering.value = true;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleClickOutside);
    // 清除任何剩余的计时器
    if (mouseLeaveTimer.value) {
        clearTimeout(mouseLeaveTimer.value);
    }
});

const handleToGithub = () => {
    window.open('https://github.com/Can-I-Bus', '_blank');
};
</script>
<style scoped lang="scss">
@use '@/css/mixin.scss' as *;
@use '@/css/media.scss' as *;

// 使用teleport传送到body的二维码样式
.qrcode-teleport {
    position: fixed;
    width: 180px;
    height: 180px;
    padding: 5px;
    background-color: #807575;
    border-radius: 4px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    pointer-events: auto; // 确保鼠标事件能被捕获

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

// 遮罩层样式
.qrcode-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 500;
}

.myinfo_wrap {
    @include flexColumn();
    @include flexAlianCenter();
    padding: 20px;
    background-color: var(--mainBgColor);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: all 0.3s;
    position: relative;
    z-index: 10;

    @include respond-to('small') {
        padding: 30px 20px;
        border-radius: 16px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        width: 90%;
        max-width: 320px;
        margin: 0 auto;
    }

    p {
        color: var(--textMainColor);
        text-align: center;
    }
    > p {
        font-size: 26px;
    }
    .avatar {
        font-size: 26px;
        margin-bottom: 16px;

        @include respond-to('small') {
            margin-bottom: 20px;

            // 在移动端增大头像尺寸
            :deep(.avatar_wrap) {
                width: 100px !important;
                height: 100px !important;
            }
        }
    }
    .contact-info {
        margin-bottom: 10px;
        padding: 12px 0;
        border-top: 1px solid var(--borderMainColor);
        border-bottom: 1px solid var(--borderMainColor);
        width: 100%;

        @include respond-to('small') {
            padding: 15px 0;
        }

        div {
            @include flexCenter();
            .icon {
                font-size: 18px;
                color: var(--textSecColor);
            }
            p {
                font-size: 14px;
                margin-left: 10px;

                @include respond-to('small') {
                    font-size: 15px;
                }
            }
            &:nth-of-type(1) {
                margin-bottom: 14px;

                @include respond-to('small') {
                    margin-bottom: 16px;
                }
            }
        }
    }
    .social-links {
        @include flexCenter();
        gap: 10px;
        color: var(--textMainColor);
        margin-top: 5px;
        position: relative;
        z-index: 10;

        @include respond-to('small') {
            gap: 15px;
            margin-top: 10px;
        }

        .icon {
            transition: 0.3s;

            @include respond-to('small') {
                font-size: 26px !important;
            }

            &:hover {
                color: var(--textHoverColor);
                transform: translateY(-2px);
            }
        }

        .weixin-container {
            position: relative;
            z-index: 20;

            .weixin-icon {
                cursor: pointer;
            }
        }
    }
}
</style>
