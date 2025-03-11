//定制请求的实例

import { useTokenStore } from '@/stores/tokenStore';
//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api'; // 拼接后的url为 http://localhost:5173/api。
// 然后配置代理，解决跨域 > vue.config.js
const instance = axios.create({ baseURL })

// import { useRouter } from 'vue-router';
// const router = useRouter();
// useRouter 只能在 Vue 组件的 setup 函数中调用。

import router from '@/router/index.ts';
// 直接导入 router 实例

//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        if (err.response.status === 401) {
            ElMessage.error("请先登录")
            // 清除token
            const tokenStore = useTokenStore();
            tokenStore.removeToken();
            // 跳转到登录页
            router.push('/login');
        } else {
            // 其他错误处理
            ElMessage.error('服务异常');
        }
        return Promise.reject(err); // 返回错误
    }
)

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => { 
        // 在发送请求之前添加token
        const tokenStore = useTokenStore();
        if (tokenStore.token) { 
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error);
    }
)

export default instance;