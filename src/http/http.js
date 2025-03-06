import axios from './domain';
import apiList from '@/config/api.config';

export default async function http({ type, data }) {
    try {
        if (!type in apiList) {
            throw new Error('API 不存在');
        }
        let { url, method } = apiList[type];
        method = method.toLowerCase();
        data = method === 'get' ? { params: data } : data;
        const res = await axios[method](url, data);
        return res;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}
