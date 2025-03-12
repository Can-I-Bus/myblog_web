import axios from 'axios';
import config from '@/config/http.config';
const { baseURL, timeout } = config;

const _axios = axios.create({
    timeout,
    baseURL,
});

//请求拦截器
_axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//响应拦截器
_axios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default _axios;
