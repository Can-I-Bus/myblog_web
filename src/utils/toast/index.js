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

const toast = ({ message = '', targetEl = document.body, type = 'info', duration = 2000, cb = null } = options) => {
    const { el: iconEl, unmount: unmountIcon } = getIconCom(type);
    console.log(iconEl);
    const container = document.createElement('div');
    const messageEl = document.createElement('span');
    messageEl.innerText = message;
    container.appendChild(iconEl);
    container.appendChild(messageEl);
    container.classList.add('toast_wrap');
    container.classList.add(`toast_wrap_${type}`);
    const targetElPos = getComputedStyle(targetEl).position;
    if (targetElPos === 'static') {
        targetEl.style.position = 'relative';
    }
    targetEl.appendChild(container);
    container.clientHeight; // 触发重绘
    container.style.opacity = '1';
    container.style.transform = 'translate(-50%, -50%) translateY(0px)';
    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transform = 'translate(-50%, -50%) translateY(-30px)';
        container.addEventListener(
            'transitionend',
            () => {
                cb?.();
                unmountIcon();
                targetEl.removeChild(container);
            },
            { once: true }
        );
    }, duration);
};

export default toast;
