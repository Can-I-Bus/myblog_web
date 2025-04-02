<template>
    <div class="material-input" :class="{ 'is-focused': isFocused, 'has-value': modelValue }">
        <div class="input-container">
            <input v-if="type !== 'textarea'" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @focus="handleFocus" @blur="handleBlur" />
            <textarea v-else :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @focus="handleFocus" @blur="handleBlur" :rows="rows"></textarea>

            <label :class="{ 'float-above': isFocused || modelValue }">
                {{ placeholder }}
            </label>

            <div class="underline">
                <div class="underline-active" :class="{ active: isFocused }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    type: {
        type: String,
        default: 'text',
    },
    placeholder: String,
    rows: {
        type: Number,
        default: 3,
    },
});

const emit = defineEmits(['update:modelValue']);

const isFocused = ref(false);

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
};
</script>

<style scoped>
.material-input {
    position: relative;
    margin: 20px 0;
    width: 100%;
}

.input-container {
    position: relative;
    padding-top: 18px; /* 为浮动标签留出空间 */
}

input,
textarea {
    width: 100%;
    padding: 8px 0;
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    background: transparent;
    transition: all 0.3s;
}

textarea {
    resize: vertical;
    min-height: 60px;
}

/* 浮动标签样式 */
label {
    position: absolute;
    left: 0;
    top: 30px;
    color: #999;
    font-size: 16px;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: left top;
}

/* 标签上浮状态 */
label.float-above {
    transform: translateY(-22px) scale(0.75);
    color: #2196f3;
}

/* 下划线动画容器 */
.underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
}

/* 激活状态的下划线 */
.underline-active {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2196f3;
    transform: scaleX(0);
    transition: transform 0.3s;
}

.underline-active.active {
    transform: scaleX(1);
}
</style>
