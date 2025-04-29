<template>
    <div class="waterfall-container" ref="containerRef">
        <div v-for="(item, index) in items" :key="item.id" class="waterfall-item" :style="{ ...getItemStyle(index), backgroundColor: getRandomColor() }">
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    cols: {
        type: Number,
        default: 2,
    },
    gap: {
        type: Number,
        default: 10,
    },
    itemWidth: Number,
    responsive: {
        type: Boolean,
        default: false,
    },
});
const coolPool = ref(['rgba(238,219,215,.6)', 'rgba(251,227,158,.6)', 'rgba(242,241,246,.6)', 'rgba(238,219,215,.6)', 'rgba(251,227,158,.6)', 'rgba(242,241,246,.6)']);
const containerRef = ref(null);
const positions = ref([]);
const columnHeights = ref([]);
const actualCols = ref(props.cols);

const getRandomColor = () => {
    return coolPool.value[Math.floor(Math.random() * coolPool.value.length)];
};

const calcColumns = () => {
    if (!props.responsive || !containerRef.value) return props.cols;
    const containerWidth = containerRef.value.clientWidth;
    return Math.max(1, Math.floor((containerWidth + props.gap) / (props.itemWidth + props.gap)));
};

const getItemStyle = (index) => {
    const position = positions.value[index] || { left: 0, top: 0, width: 0 };
    return {
        position: 'absolute',
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${position.width}px`,
        transition: 'all 0.3s ease',
    };
};

const initLayout = async () => {
    await nextTick();
    actualCols.value = calcColumns();

    const containerWidth = containerRef.value.clientWidth;
    const gap = props.gap;
    const cols = actualCols.value;

    // 计算列宽
    const columnWidth = props.itemWidth || (containerWidth - (cols - 1) * gap) / cols;

    // 初始化列高度数组
    columnHeights.value = new Array(cols).fill(0);
    positions.value = [];

    // 创建临时数组记录位置
    const tempPositions = [];
    const tempHeights = new Array(cols).fill(0);

    props.items.forEach((item, index) => {
        // 获取元素高度
        const itemElement = containerRef.value.children[index];
        const itemHeight = itemElement?.clientHeight || 0;

        // 找到最短列
        const minHeight = Math.min(...tempHeights);
        const colIndex = tempHeights.indexOf(minHeight);

        // 计算位置
        const position = {
            left: colIndex * (columnWidth + gap),
            top: minHeight,
            width: columnWidth,
        };

        tempPositions[index] = position;
        tempHeights[colIndex] += itemHeight + gap;
    });

    positions.value = tempPositions;
    columnHeights.value = tempHeights;
};

const resizeObserver = new ResizeObserver(() => {
    initLayout();
});

onMounted(() => {
    if (containerRef.value) {
        resizeObserver.observe(containerRef.value);
    }
    initLayout();
});

onUnmounted(() => {
    resizeObserver.disconnect();
});

watch(() => props.items, initLayout, { deep: true });
watch(() => props.cols, initLayout);
</script>

<style scoped>
.waterfall-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
}

.waterfall-item {
    position: absolute;
    box-sizing: border-box;
}
</style>
