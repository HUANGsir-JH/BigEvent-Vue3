<script setup>
import { ref } from 'vue'
import { updateUserInfo } from '@/api/user'
import { ElMessage } from 'element-plus'
import {updateUserPassword} from '@/api/user'
import {useTokenStore} from '@/stores/tokenStore'
import {useRouter} from 'vue-router'

const userInfo = ref({
    oldPassword: '',
    newPassword: '',
    repeatPassword: ''
})

const rules = {
    oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在5到16个字符', trigger: 'blur' }
    ],
    repeatPassword: [
        {required: true, message: '请再次输入密码', trigger: 'blur'},
        {validator: (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== userInfo.value.newPassword) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }, trigger: 'blur'}
    ]
}

// 提交修改
const tokenStore = useTokenStore()
const router = useRouter()
const upUserInfo = async () => {
    if (!userInfo.value.oldPassword || !userInfo.value.newPassword || !userInfo.value.repeatPassword) {
        ElMessage({
            type: 'error',
            message: '原密码和新密码不能为空'
        })
        return
    }
    let res = await updateUserPassword(userInfo.value)
    if (res.code === 1) {// 修改失败
        ElMessage({
            type: 'error',
            message: res.message ? res.message : '修改失败'
        })
    } else {
        ElMessage({
            type: 'success',
            message: res.message
        })
        userInfo.value.oldPassword = ''
        userInfo.value.newPassword = ''
        userInfo.value.repeatPassword = ''
        //重新登录
        tokenStore.removeToken()
        router.push('/login')
        ElMessage({
            type: 'success',
            message: '请重新登录'
        })
    }
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="oldPassword">
                        <el-input v-model="userInfo.oldPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input v-model="userInfo.newPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入" prop="repeatPassword">
                        <el-input v-model="userInfo.repeatPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="upUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>