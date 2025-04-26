<template>
    <div class="material-input-box" :class="{ 'is-focused': isFocused, 'has-value': modelValue }">
        <div class="input-container">
            <input v-if="type !== 'textarea'" :type="type" :value="modelValue" @input="handleInput" @change="$emit('change', $event.target.value)" @focus="handleFocus" @blur="handleBlur" />
            <textarea v-else :value="modelValue" @input="handleInput" @change="$emit('change', $event.target.value)" @focus="handleFocus" @blur="handleBlur" :rows="rows"></textarea>

            <label :class="{ 'float-above': isFocused || modelValue }">
                {{ placeholder }}
            </label>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from '@/utils/index';

const props = defineProps({
    modelValue: [String, Number],
    type: {
        type: String,
        default: 'text',
        validator: (val) => ['text', 'password', 'email', 'number', 'textarea', 'tel', 'url'].includes(val),
    },
    placeholder: String,
    rows: {
        type: Number,
        default: 3,
    },
    debounceTime: {
        // 新增防抖时间配置项
        type: Number,
        default: 300,
    },
});

const emit = defineEmits(['update:modelValue', 'change']); // 声明 change 事件

const isFocused = ref(false);

// 创建防抖函数
const emitChange = debounce((value) => {
    emit('change', value); // 防抖后触发 change
}, props.debounceTime);

const handleInput = (event) => {
    const value = event.target.value;
    emit('update:modelValue', value); // 即时更新 modelValue
    emitChange(value); // 触发防抖 change
};

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
};
</script>

<style scoped>
.material-input-box {
    position: relative;
    margin: 10px 0;
    width: 100%;
}

.input-container {
    position: relative;
    border: 1px solid var(--borderFourthColor);
    border-radius: 8px;
    padding: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.material-input-box.is-focused .input-container {
    border-color: var(--textHoverColor);
}

input,
textarea {
    width: 100%;
    font-size: 16px;
    border: none;
    outline: none;
    background: transparent;
    padding: 2px 0;
}

textarea {
    resize: vertical;
    min-height: 100px;
}

/* 浮动标签样式 */
label {
    position: absolute;
    left: 16px;
    top: 12px;
    color: #999;
    font-size: 16px;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--mainBgColor);
    padding: 0 4px;
    transform-origin: left top;
}

/* 标签上浮状态 */
label.float-above {
    transform: translateY(-20px) scale(0.85);
    color: var(--textHoverColor);
    left: 12px;
    padding: 0 4px;
}
</style>
