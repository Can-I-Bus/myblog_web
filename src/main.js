import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/css/index.scss';
import '@/assets/font/iconfont.css';
import http from '@/http/http';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.config.globalProperties.$api = http;
app.use(createPinia());
app.use(router);

app.mount('#app');
