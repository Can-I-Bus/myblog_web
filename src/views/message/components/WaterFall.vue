<!-- WaterFall.vue -->
<template>
    <div
        class="waterfall-container"
        ref="containerRef"
        :style="{
            width: totalWidth + 'px',
            height: containerHeight + 'px',
        }">
        <div v-for="item in items" :key="item.id" class="waterfall-item" :data-item-id="item.id" :style="getItemStyle(item)">
            <slot name="item" :item="item"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { debounce } from 'lodash-es';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    cols: { type: Number, default: 2 },
    gap: { type: Number, default: 10 },
    itemWidth: Number,
    responsive: { type: Boolean, default: false },
    animationDelay: { type: Number, default: 80 },
});

const containerRef = ref(null);
const positions = ref({});
const columnHeights = ref([]);
const actualCols = ref(props.cols);
const totalWidth = ref(0);
const containerHeight = ref(0);
const columnWidth = ref(0);
const animatedItems = ref({});
const processedItems = ref(new Set());
let resizeObserver = null;

// 初始化布局
const initLayout = () => {
    if (!containerRef.value?.parentElement) return;

    // 计算列数
    actualCols.value = calcColumns();
    const parentWidth = containerRef.value.parentElement.clientWidth;

    // 计算列宽和总宽度
    if (actualCols.value === 1) {
        // 单列时，设置合适的宽度并居中
        const maxSingleWidth = Math.min(400, parentWidth - 40); // 最大400px，留40px边距
        columnWidth.value = maxSingleWidth;
        totalWidth.value = maxSingleWidth;
    } else {
        columnWidth.value = props.itemWidth || Math.floor((parentWidth - (actualCols.value - 1) * props.gap) / actualCols.value);
        totalWidth.value = Math.min(parentWidth, actualCols.value * columnWidth.value + (actualCols.value - 1) * props.gap);
    }

    // 重置列高
    columnHeights.value = new Array(actualCols.value).fill(0);

    // 计算所有元素位置
    props.items.forEach((item) => {
        if (!processedItems.value.has(item.id)) {
            calculatePosition(item);
            processedItems.value.add(item.id);
        }
    });

    // 更新容器高度
    containerHeight.value = Math.max(...columnHeights.value, 0) + props.gap;
};

// 计算单个元素位置
const calculatePosition = (item) => {
    const itemEl = containerRef.value?.querySelector(`[data-item-id="${item.id}"]`);
    const itemHeight = itemEl?.offsetHeight || item.height;
    const minColIndex = columnHeights.value.indexOf(Math.min(...columnHeights.value));

    let leftPosition;
    if (actualCols.value === 1) {
        // 单列时居中
        leftPosition = 0; // 因为容器本身已经居中，项目相对容器位置为0
    } else {
        leftPosition = minColIndex * (columnWidth.value + props.gap);
    }

    // 计算位置
    positions.value[item.id] = {
        left: leftPosition,
        top: columnHeights.value[minColIndex] || 0,
        width: columnWidth.value,
    };

    // 更新列高
    columnHeights.value[minColIndex] += itemHeight + props.gap;
};

// 触发动画
const triggerAnimation = () => {
    props.items.forEach((item, index) => {
        if (!animatedItems.value[item.id]) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    animatedItems.value[item.id] = true;
                    animatedItems.value = { ...animatedItems.value };
                });
            }, index * props.animationDelay);
        }
    });
};

// 响应式列数计算
const calcColumns = () => {
    if (!props.responsive || !containerRef.value?.parentElement) return props.cols;

    const containerWidth = containerRef.value.parentElement.clientWidth;

    // 根据屏幕宽度动态调整列数
    if (containerWidth < 480) {
        return 1; // 移动设备单列
    } else if (containerWidth < 768) {
        return Math.min(2, props.cols); // 平板设备最多2列
    } else {
        return Math.max(1, Math.min(props.cols, Math.floor((containerWidth + props.gap) / (props.itemWidth + props.gap))));
    }
};

// 样式生成
const getItemStyle = (item) => {
    const pos = positions.value[item.id] || { left: 0, top: 0, width: 0 };
    return {
        position: 'absolute',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: `${pos.width}px`,
        opacity: animatedItems.value[item.id] ? 1 : 0,
        transform: `translateY(${animatedItems.value[item.id] ? 0 : '-40px'})`,
        transition: animatedItems.value[item.id] ? `all 0.5s ease-out ${props.animationDelay}ms` : 'none',
        'will-change': 'transform, opacity',
        'margin-bottom': `${props.gap}px`,
    };
};

// 生命周期
onMounted(() => {
    initLayout();
    triggerAnimation();

    // 使用ResizeObserver监听容器大小变化
    resizeObserver = new ResizeObserver(
        debounce(() => {
            processedItems.value.clear();
            initLayout();
            triggerAnimation();
        }, 200)
    );

    if (containerRef.value?.parentElement) {
        resizeObserver.observe(containerRef.value.parentElement);
    }
});

onUnmounted(() => {
    // 清理ResizeObserver
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});

// 监听数据变化
watch(
    () => props.items,
    (newVal, oldVal) => {
        if (newVal.length !== oldVal.length) {
            nextTick(() => {
                processedItems.value.clear();
                initLayout();
                triggerAnimation();
            });
        }
    }
);

watch(
    () => [props.cols, props.gap, props.itemWidth],
    () => {
        processedItems.value.clear();
        initLayout();
        triggerAnimation();
    }
);
</script>

<style scoped lang="scss">
@use '../../../css/media.scss' as *;

.waterfall-container {
    position: relative;
    margin: 0 auto;
    transition: all 0.3s ease;

    @include respond-to('small') {
        // 移动端单列时确保居中
        margin: 0 auto;
        max-width: 400px;
        width: calc(100% - 20px) !important;
    }
}

.waterfall-item {
    position: absolute;
    box-sizing: border-box;
    transform: translateZ(0);
    will-change: transform, opacity;

    @include respond-to('small') {
        transition: all 0.3s ease !important;
    }
}
</style>
