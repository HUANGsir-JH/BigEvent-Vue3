import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore("token", () => {
    const token = ref("");
    const setToken = (newToken: string) => {
        token.value = newToken;
    };
    const removeToken = () => {
        token.value = "";
    };

    return {
        token,
        setToken,
        removeToken
    };
}, {
    persist: true // 使用 Pinia 的持久化插件，把 token 存储到 localStorage
    // 你需要在 main.ts 中引入 pinia-plugin-persistedstate 插件
})