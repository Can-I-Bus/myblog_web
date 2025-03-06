import { watchEffect, ref, onMounted } from 'vue';

export default function useTheme() {
    const theme = ref('light');
    onMounted(() => {
        const _theme = localStorage.getItem('theme');
        if (_theme) {
            theme.value = _theme;
        }
        document.querySelector('html').setAttribute('data-theme', theme.value);
        document.documentElement.classList.add(_theme);
    });
    watchEffect(() => {
        localStorage.setItem('theme', theme.value);
        if (theme.value === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.remove('light');
        }
        document.documentElement.classList.add(theme.value);
    });
    return {
        theme,
        toggleTheme: () => {
            theme.value = theme.value === 'light' ? 'dark' : 'light';
            document.querySelector('html').setAttribute('data-theme', theme.value);
        },
    };
}
