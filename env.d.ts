/// <reference types="vite/client" />

// 声明所有 .vue 文件为 Vue 组件类型，避免 TypeScript 报错
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}