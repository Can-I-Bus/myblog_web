import Loading from '@/components/loading/index.vue';
import { createApp } from 'vue';
const elementMap = new WeakMap();

const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || 'light';

const createLoadingInstance = (el, binding) => {
    // 如果已存在则先清理
    if (elementMap.has(el)) {
        destroyLoadingInstance(el);
    }

    const theme = getCurrentTheme();
    const { width, height } = el.getBoundingClientRect();

    const container = document.createElement('div');
    container.className = 'loading-container';
    container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: ${width}px;
    height: ${height * 0.6}px;
    background-color: ${theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2002;
  `;

    const app = createApp(Loading);
    const instance = app.mount(container);
    instance.$el.style.transform = `translateY(-80px)`;
    el.appendChild(container);
    el.style.position = 'relative';

    // 创建主题监听
    const observer = new MutationObserver(() => {
        const newTheme = getCurrentTheme();
        container.style.backgroundColor = newTheme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    elementMap.set(el, {
        instance,
        container,
        observer,
        app,
    });
};

const destroyLoadingInstance = (el) => {
    if (!elementMap.has(el)) return;
    const { instance, observer, app } = elementMap.get(el);
    observer.disconnect();
    instance.$el.remove();
    app.unmount();
    elementMap.delete(el);
};

export default {
    mounted(el, binding) {
        if (binding.value) {
            createLoadingInstance(el, binding);
        }
    },
    updated(el, binding) {
        if (binding.value && !elementMap.has(el)) {
            createLoadingInstance(el, binding);
        } else if (!binding.value && elementMap.has(el)) {
            destroyLoadingInstance(el);
        }
    },
    unmounted(el) {
        destroyLoadingInstance(el);
    },
};
