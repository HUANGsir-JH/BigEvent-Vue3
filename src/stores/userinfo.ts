import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore("userinfo", () => {
    const info = ref({})
    const setInfo = (data: any) => {
        info.value = data
    }
    const removeInfo = () => {
        info.value = {}
    }
    return {
        info,
        setInfo,
        removeInfo
    }
}, {
    persist:true
})