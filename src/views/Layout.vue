<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { getUserInfo } from '@/api/user';
import { onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/userinfo';
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/tokenStore';
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()

const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()

const getUser = async () => {
    const res = await getUserInfo()
    if (res.code === 0) {
        userInfoStore.setInfo(res.data)
    }
}

const handleCommand = (command) => {
    if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            //清空pinia
            tokenStore.removeToken()
            userInfoStore.removeInfo()
            ElMessage({
                type: 'success',
                message: '退出登录成功'
            })
            //跳转到登录页
            router.push('/login')
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消退出'
            })
        })
    } else {
        router.push(command)
    }
}

onMounted(() => {
    getUser()
})
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router> 
                <!-- router: 是否使用路由模式 。一定要添加上，否则无法跳转。之后再item添加index属性-->
                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分类</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <!-- index: 路由跳转的路径 -->
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>Learning Vue+Springboot: <strong>{{userInfoStore.info.nickname ? userInfoStore.info.nickname : userInfoStore.info.username}}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand"
                >
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="/user/info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="/user/avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="/user/resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <div style="width: 100%; height: 100%;">
                    <RouterView></RouterView>
                </div>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>BigEvent ©2025 Learn from 黑马程序员</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>