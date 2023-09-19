import axios from 'axios';

const api = axios.create({
    baseURL: 'https://blog-back-mu.vercel.app/',
})

api.interceptors.request.use((config) => {
    config.headers = {
        'x-token': localStorage.getItem('token'),
    };
    return config;
})

export default api;