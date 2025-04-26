export default {
    mounted(el, binding) {
        const scrollHandler = () => {
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight;
            const clientHeight = el.clientHeight;
            const isBottom = scrollTop + clientHeight >= scrollHeight;
            if (isBottom) {
                binding?.value?.();
            }
        };
        el._scrollHandler = scrollHandler;
        el.addEventListener('scroll', scrollHandler);
    },
    unmounted(el) {
        el.removeEventListener('scroll', el._scrollHandler);
    },
};
