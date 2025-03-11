<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userRegister, userLogin } from "@/api/user"
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/tokenStore'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
const RegisterData = ref({
    username: '',
    password: '',
    repassword: ''
})

const isRegisting = ref(false)
const isLogining = ref(false)

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },// 规则：必填，提示信息：请输入用户名，触发时机：失去焦点
        { min: 5, max: 16, message: '长度在5到16个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在5到16个字符', trigger: 'blur' }
    ],
    repassword: [
        {validator: (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== RegisterData.value.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }, trigger: 'blur'}
    ]
}

const register = async () => {
    isRegisting.value = true
    if(!RegisterData.value.username || !RegisterData.value.password || !RegisterData.value.repassword) {
        ElMessage({
            type: 'error',
            message: '用户名和密码不能为空'
        })
        isRegisting.value = false
        return
    }
    let res = await userRegister(RegisterData.value)
    if (res.code === 1) {// 注册失败
        ElMessage({
            type: 'error',
            message: res.message ? res.message : '注册失败'
        })
    } else {
        ElMessage({
            type: 'success',
            message: res.message
        })
        isRegister.value = false
        RegisterData.value = {
            username: '',
            password: '',
            repassword: ''
        }
    }
    isRegisting.value = false
}

// 登录
const LoginData = ref({
    username: '',
    password: ''
})

const router = useRouter()
const tokenStore = useTokenStore()
const login = async () => {
    isLogining.value = true
    if(!LoginData.value.username || !LoginData.value.password) {
        ElMessage({
            type: 'error',
            message: '用户名和密码不能为空',
        })
        isLogining.value = false
        return
    }
    let res = await userLogin(LoginData.value)
    if (res.code === 1) {// 登录失败
        ElMessage({
            type: 'error',
            message: res.message ? res.message : '登录失败'
        })
    } else {
        ElMessage({
            type: 'success',
            message: res.message
        })
        // 登录成功，保存token
        tokenStore.setToken(res.data)
        // 清空登录数据
        LoginData.value = {
            username: '',
            password: ''
        }
        // 登录成功，跳转到首页
        router.push('/')
    }
    isLogining.value = false
}

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="RegisterData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="RegisterData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="RegisterData.password"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码"
                        v-model="RegisterData.repassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space 
                    @click="register" :loading="isRegisting">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="LoginData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="LoginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="LoginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space
                    @click="login" :loading="isLogining">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>