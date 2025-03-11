<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import avatar from '@/assets/default.png'
import { useUserInfoStore } from '@/stores/userinfo'
import { useTokenStore } from '@/stores/tokenStore'
import { ElMessage } from 'element-plus'
import { updateUserAvatar } from '@/api/user'

const uploadRef = ref()
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
//用户头像地址
const imgUrl = ref('')
imgUrl.value = userInfoStore.info.userPic

//上传成功
const handleSuccess = (response) => {
    if (response.code === 0) {
        imgUrl.value = response.data
        userInfoStore.info.userPic = response.data
        ElMessage.success('头像选择成功，请点击上传按钮')
    } else {
        ElMessage.error(response.msg)
    }
}
//上传头像
const upAvatar = async () => {
    if (imgUrl.value === '') {
        ElMessage.error('请先选择头像')
        return
    }
    let res = await updateUserAvatar(imgUrl.value)
    if (res.code === 0) {
        ElMessage.success('头像上传成功')
        userInfoStore.info.userPic = imgUrl.value
    } else {
        ElMessage.error(res.message)
    }
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload ref="uploadRef" class="avatar-uploader" :show-file-list="false"
                    auto-upload="true" action='/api/upload' :headers="{'Authorization':tokenStore.token}"
                    :on-success="handleSuccess"
                >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <img v-else :src="avatar" width="278" />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"
                    @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="upAvatar">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>