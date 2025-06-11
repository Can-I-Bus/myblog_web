import Icon from '@/components/icon/index.vue';
import './index.scss';
import { createApp } from 'vue';

const getIconCom = (type) => {
    const container = document.createElement('div');
    const app = createApp(Icon, { type });
    app.mount(container);
    return {
        el: container.firstChild,
        unmount: () => app.unmount(),
    };
};

// 创建一个专用于toast的容器
const getToastContainer = () => {
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        container.style.position = 'fixed';
        container.style.top = '10%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '9999'; // 确保最高层级
        container.style.pointerEvents = 'none'; // 防止阻挡交互
        document.body.appendChild(container);
    }
    return container;
};

const toast = ({ message = '', type = 'info', duration = 2000, cb = null } = {}) => {
    const { el: iconEl, unmount: unmountIcon } = getIconCom(type);

    // 获取全局toast容器
    const toastContainer = getToastContainer();

    // 创建单个toast元素
    const toastElement = document.createElement('div');
    const messageEl = document.createElement('span');
    messageEl.innerText = message;
    toastElement.appendChild(iconEl);
    toastElement.appendChild(messageEl);
    toastElement.classList.add('toast_wrap');
    toastElement.classList.add(`toast_wrap_${type}`);

    // 将toast添加到固定容器
    toastContainer.appendChild(toastElement);

    // 触发重绘并显示toast
    toastElement.clientHeight;
    toastElement.style.opacity = '1';
    toastElement.style.transform = 'translateY(0)';

    // 设置定时器移除toast
    setTimeout(() => {
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateY(-30px)';
        toastElement.addEventListener(
            'transitionend',
            () => {
                cb?.();
                unmountIcon();
                toastContainer.removeChild(toastElement);

                // 如果容器为空，也可以移除容器
                if (toastContainer.childNodes.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            },
            { once: true }
        );
    }, duration);
};

export default toast;
