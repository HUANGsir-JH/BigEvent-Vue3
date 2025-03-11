import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import Layout from '@/views/Layout.vue'
import ArticleCategory from '@/views/ArticleCategory.vue'
import ArticleManage from '@/views/ArticleManage.vue'
import UserAvatar from '@/views/UserAvatar.vue'
import UserInfo from '@/views/UserInfo.vue'
import UserResetPassword from '@/views/UserResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // base URL for the app
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        { path: 'article/category', name: 'articleCategory', component: ArticleCategory },
        { path: 'article/manage', name: 'articleManage', component: ArticleManage },
        { path: 'user/avatar', name: 'userAvatar', component: UserAvatar },
        { path: 'user/info', name: 'userInfo', component: UserInfo },
        { path: 'user/resetPassword', name: 'userResetPassword', component: UserResetPassword },
      ],
      redirect: '/article/manage', // redirect to article manage by default
    }
  ],
})

export default router
