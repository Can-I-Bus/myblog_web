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
            <Icon class="icon" fontSize="22px" type="github" />
            <Icon class="icon" fontSize="22px" type="weixin" />
        </div>
    </div>
</template>
<script setup>
import Avatar from '../avatar/index.vue';
import Icon from '../icon/index.vue';
</script>
<style scoped lang="scss">
@use '@/css/mixin.scss' as *;
@use '@/css/media.scss' as *;

.myinfo_wrap {
    @include flexColumn();
    @include flexAlianCenter();
    padding: 20px;
    background-color: var(--mainBgColor);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: all 0.3s;

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
    }
}
</style>
