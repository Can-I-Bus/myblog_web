<template>
    <div class="layout_wrap">
        <div class="left_wrap">
            <slot name="left"></slot>
        </div>
        <div class="main_wrap">
            <slot></slot>
        </div>
        <div class="right_wrap">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<style scoped lang='scss'>
.layout_wrap {
    height: 100%;
    width: 100%;
    display: flex;
    .main_wrap {
        flex: 1;
    }
}
</style>