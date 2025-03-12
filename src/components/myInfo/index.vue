<template>
    <div class="myinfo_wrap">
        <div class="avatar">
            <Avatar size="80px" />
            <p class="fz26">MAX</p>
        </div>
        <div>
            <div>
                <Icon class="icon" type="position" />
                <p>浙江省台州市椒江区</p>
            </div>
            <div>
                <Icon class="icon" type="email" />
                <p>2337833033@qq.com</p>
            </div>
        </div>
        <div>
            <Icon class="icon" fontSize="22px" type="github" />
            <Icon class="icon" fontSize="22px" type="weixin" />
        </div>
    </div>
</template>
<script setup>
import Avatar from '../avatar/index.vue'
import Icon from '../icon/index.vue'
</script>
<style scoped lang='scss'>
@use '@/css/mixin.scss' as *;
.myinfo_wrap {
    @include flexColumn();
    @include flexAlianCenter();
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
    }
    > div:nth-of-type(2) {
        margin-bottom: 10px;
        padding: 12px 0;
        border-top: 1px solid var(--borderMainColor);
        border-bottom: 1px solid var(--borderMainColor);
        div {
            @include flexCenter();
            .icon {
                font-size: 18px;
                color: var(--textSecColor);
            }
            p {
                font-size: 14px;
                margin-left: 10px;
            }
            &:nth-of-type(1) {
                margin-bottom: 14px;
            }
        }
    }
    > div:nth-of-type(3) {
        @include flexCenter();
        gap: 10px;
        color: var(--textMainColor);
        .icon {
            transition: 0.3s;
            &:hover {
                color: var(--textHoverColor);
            }
        }
    }
}
</style>