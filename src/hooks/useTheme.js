import { ref, onMounted } from 'vue';

export default function useTheme() {
    const cssLinkMap = ref({
        light: {
            highlight: '/css/highlight.css/atom-one-light.min.css',
            markdown: '/css/markdown.css/github-markdown-light.css',
        },
        dark: {
            highlight: '/css/highlight.css/atom-one-dark.min.css',
            markdown: '/css/markdown.css/github-markdown-dark.css',
        },
    });

    const theme = ref('light');

    const toogleHTML = () => {
        document.documentElement.className = ''; // 清除旧主题类
        document.documentElement.classList.add(theme.value);
        document.documentElement.setAttribute('data-theme', theme.value);
    };

    const createLink = (url) => {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${url}?v=${Date.now()}`;
            link.setAttribute('data-theme', theme.value);
            link.onload = () => resolve();
            document.head.appendChild(link);
        });
    };

    const toogleLink = async () => {
        const cssLinkItem = cssLinkMap.value[theme.value];

        // 预加载新主题
        const preloadLinks = [
            { url: cssLinkItem.highlight, id: 'highlight-style' },
            { url: cssLinkItem.markdown, id: 'markdown-style' },
        ];

        // 并行预加载
        await Promise.all(
            preloadLinks.map(({ url }) => {
                return new Promise((resolve) => {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'style';
                    link.href = `${url}?v=${Date.now()}`;
                    link.onload = resolve;
                    document.head.appendChild(link);
                });
            })
        );

        // 切换时快速应用
        preloadLinks.forEach(({ url, id }) => {
            const existLink = document.getElementById(id);
            if (existLink) existLink.remove();

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.id = id;
            link.href = `${url}?v=${Date.now()}`;
            document.head.appendChild(link);
        });

        // 延迟清理旧样式
        setTimeout(() => {
            document.querySelectorAll('link[data-theme]').forEach((link) => {
                if (!link.id) link.remove();
            });
        }, 1000);
    };

    onMounted(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        theme.value = savedTheme;
        toogleHTML();
        toogleLink();
    });

    return {
        theme,
        toogleLink,
        toggleTheme: async () => {
            theme.value = theme.value === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', theme.value);
            await toogleLink();
            toogleHTML();
        },
    };
}
