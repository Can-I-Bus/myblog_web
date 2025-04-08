<template>
    <nav v-if="total > 0" class="pager" aria-label="分页导航">
        <button class="pager-button prev" :disabled="currentPage <= 1" @click="handlePageChange(currentPage - 1)">
            <svg class="pager-icon" viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
            <span class="pager-text">上一页</span>
        </button>

        <template v-if="!showMobileSelect">
            <template v-for="(page, index) in visiblePages" :key="index">
                <button v-if="page === '...'" class="pager-ellipsis" disabled>...</button>
                <button v-else class="pager-button" :class="{ active: page === currentPage }" @click="handlePageChange(page)">
                    {{ page }}
                </button>
            </template>
        </template>

        <button class="pager-button next" :disabled="currentPage >= totalPages" @click="handlePageChange(currentPage + 1)">
            <span class="pager-text">下一页</span>
            <svg class="pager-icon" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
        </button>

        <select v-if="showMobileSelect" class="pager-select" :value="currentPage" @change="handleSelectChange($event)">
            <option v-for="page in totalPages" :key="page" :value="page">第 {{ page }} 页</option>
        </select>

        <div v-if="showInfo" class="pager-info">共 {{ total }} 条，{{ totalPages }} 页</div>
    </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    // 总数据条数
    total: {
        type: Number,
        required: true,
        validator: (value) => value >= 0,
    },
    // 当前页码
    currentPage: {
        type: Number,
        required: true,
        validator: (value) => value >= 1,
    },
    // 每页条数
    pageSize: {
        type: Number,
        default: 10,
        validator: (value) => value >= 1,
    },
    // 最大显示页码数
    maxVisible: {
        type: Number,
        default: 5,
        validator: (value) => value >= 3,
    },
    // 是否显示分页信息
    showInfo: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:currentPage', 'pageChange']);

const windowWidth = ref(window.innerWidth);
window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
});

const totalPages = computed(() => {
    return props.total === 0 ? 0 : Math.ceil(props.total / props.pageSize);
});

const showMobileSelect = computed(() => windowWidth.value < 768);

const visiblePages = computed(() => {
    if (totalPages.value <= props.maxVisible) {
        return range(1, totalPages.value);
    }

    const start = Math.max(2, props.currentPage - Math.floor(props.maxVisible / 2));
    const end = Math.min(totalPages.value - 1, props.currentPage + Math.floor(props.maxVisible / 2));

    let pages = [1];

    if (start > 2) pages.push('...');
    pages.push(...range(start, end));
    if (end < totalPages.value - 1) pages.push('...');
    pages.push(totalPages.value);

    return pages;
});

const range = (from, to) => {
    return Array.from({ length: to - from + 1 }, (_, i) => i + from);
};

const handlePageChange = (page) => {
    console.log(page, '=====');

    if (page < 1 || page > totalPages.value) return;

    emit('update:currentPage', page);
    emit('pageChange', page);
};

const handleSelectChange = (event) => {
    const page = parseInt(event.target.value);
    handlePageChange(page);
};

watch(totalPages, (newVal) => {
    if (props.currentPage > newVal) {
        handlePageChange(newVal);
    }
});
</script>

<style scoped lang="scss">
.pager {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 1rem;
    user-select: none;
    flex-wrap: wrap;

    &-button {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background: white;
        color: #333;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 36px;

        &:hover:not(:disabled) {
            border-color: var(--textHoverColor);
            color: var(--textHoverColor);
            transform: translateY(-1px);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        &.active {
            background: var(--textHoverColor);
            border-color: var(--textHoverColor);
            color: white;
        }
    }

    &-ellipsis {
        border: none;
        background: transparent;
        padding: 8px 12px;
        color: #666;
    }

    &-icon {
        width: 20px;
        height: 20px;
        fill: currentColor;
    }

    &-text {
        @media (max-width: 480px) {
            display: none;
        }
    }

    &-select {
        display: none;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        background: white;

        @media (max-width: 768px) {
            display: block;
            margin-left: 12px;
        }
    }

    &-info {
        margin-left: auto;
        color: #666;
        font-size: 0.9em;

        @media (max-width: 768px) {
            display: none;
        }
    }
}

@media (max-width: 480px) {
    .pager-button:not(.prev):not(.next) {
        display: none;
    }

    .pager-select {
        margin-left: auto;
    }
}
</style>
