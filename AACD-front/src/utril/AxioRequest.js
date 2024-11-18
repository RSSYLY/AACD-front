import axios from 'axios';

// 创建axios实例,http是一个新的axios实例
// 使用说明：
// import { get, post } from './AxioRequest.js'
//
const baseURL = 'https://goto8.ddns.666old666.cn:47765';

const http = axios.create({
    baseURL: baseURL, // 后端接口
    timeout: 5000, // 设置超时时间
});

// 请求拦截器

http.interceptors.request.use(config => {
    // 添加token
    config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVOYW1lIjoibWVtYmVyIiwiaWF0IjoxNzMxOTE5NzY2LCJleHAiOjMzMjg5NTE5NzY2fQ.ETmb91ICMdZuBqfElRhm2X50s8LA22u3PJIzad9aVhI';
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

http.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 封装get请求
export function get(url, params) {
    return http.get(url, { params });
}
// 封装post请求
export function post(url, data) {
    return http.post(url, data);
}

export { baseURL }
