import { ref, onMounted } from 'vue';

export default function useTheme() {
    const theme = ref('light');
    const toogleHTML = () => {
        document.querySelector('html').setAttribute('data-theme', theme.value);
        document.documentElement.classList.add(theme.value);
    };
    onMounted(() => {
        const _theme = localStorage.getItem('theme');
        if (_theme) {
            theme.value = _theme;
        }
        toogleHTML();
    });

    return {
        theme,
        toggleTheme: () => {
            theme.value = theme.value === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', theme.value);
            if (theme.value === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.remove('light');
            }
            toogleHTML();
        },
    };
}
