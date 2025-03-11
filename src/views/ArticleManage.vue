<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref,onMounted} from 'vue'
import { getArticleCategories, getArticleDetails,addArticle,updateArticle,deleteArticle } from '@/api/article'
import { useTokenStore } from '@/stores/tokenStore'
import { ElMessage,ElMessageBox } from 'element-plus'

//文章分类数据模型
const categorys = ref([])

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles= ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getArticles()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getArticles()
}

// 重置搜索条件
const reset = () => {
    categoryId.value = ''
    state.value = ''
    getArticles()
}

// 获取文章列表
const getCategories = async () => {
    let res = await getArticleCategories()
    if (res.code === 0) {
        categorys.value = res.data
    } else {
        ElMessage.error(res.message ? res.message : '获取分类列表失败，稍后重试')
    }
}

const getArticles = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let res = await getArticleDetails(params)
    if (res.code === 0) {
        articles.value = res.data.items
        total.value = res.data.total
        setCategoryName()
    } else {
        ElMessage.error(res.message ? res.message : '获取文章列表失败，稍后重试')
    }
}

const setCategoryName = () => {
    for (let i = 0; i < articles.value.length; i++){
        let id = articles.value[i].categoryId
        for (let j = 0; j < categorys.value.length; j++){
            if (id === categorys.value[j].id){
                articles.value[i].categoryName = categorys.value[j].categoryName
            }
        }
    }
}

// 文章编辑
import { Plus } from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    id: '',
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

const tokenStore = useTokenStore()

const uploadSuccess = (res) => {
    if (res.code === 0) {
        articleModel.value.coverImg = res.data
    } else {
        ElMessage.error(res.message ? res.message : '上传失败')
    }
}

// 发布文章
const publishArticle = async (state) => {
    let params = {
        title: articleModel.value.title,
        categoryId: articleModel.value.categoryId,
        coverImg: articleModel.value.coverImg,
        content: articleModel.value.content,
        state: state
    }
    let res = await addArticle(params)
    if (res.code === 0) {
        ElMessage.success('发布成功')
        visibleDrawer.value = false
        articleModel.value = {
            title: '',
            categoryId: '',
            coverImg: '',
            content: '',
            state: ''
        }
        getArticles()
    } else {
        ElMessage.error(res.message ? res.message : '发布失败')
    }
}
// 文章编辑
const editDrawerVisible = ref(false)
const editArticleModel = ref({
    id: '',
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})
const editArticle = async (row) => {
    editArticleModel.value.id = row.id
    editArticleModel.value.title = row.title
    editArticleModel.value.categoryId = row.categoryId
    editArticleModel.value.coverImg = row.coverImg
    editArticleModel.value.content = row.content
    editArticleModel.value.state = row.state
    editDrawerVisible.value = true
}
// 更新文章
const upArticle = async (state) => {
    let params = {
        id: editArticleModel.value.id,
        title: editArticleModel.value.title,
        categoryId: editArticleModel.value.categoryId,
        coverImg: editArticleModel.value.coverImg,
        content: editArticleModel.value.content,
        state: state
    }
    let res = await updateArticle(params)
    if (res.code === 0) {
        ElMessage.success('编辑成功')
        editDrawerVisible.value = false
        articleModel.value = {
            title: '',
            categoryId: '',
            coverImg: '',
            content: '',
            state: ''
        }
        getArticles()
    } else {
        ElMessage.error(res.message ? res.message : '编辑失败')
    }
}

// 删除文章
const delArticle = async (row) => {
    ElMessageBox.confirm('是否删除该文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        let res = await deleteArticle(row.id)
        if (res.code === 0) {
            ElMessage.success('删除成功')
            getArticles()
        } else {
            ElMessage.error(res.message ? res.message : '删除失败')
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 组件挂载完成后获取文章列表
onMounted(() => {
    getCategories()
    getArticles()
})
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer=true">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" style="width: 150px">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width: 150px;">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getArticles">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="editArticle(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="delArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <!-- 添加文章抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
        <!-- 添加文章表单 -->
        <el-form :model="articleModel" label-width="100px">
            <el-form-item label="文章标题">
                <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select placeholder="请选择" v-model="articleModel.categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">

                <el-upload class="avatar-uploader" :show-file-list="false" action="/api/upload"
                    :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <div class="editor">
                    <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="publishArticle('已发布')">发布</el-button>
                <el-button type="info" @click="publishArticle('草稿')">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <!-- 编辑文章抽屉 -->
    <el-drawer v-model="editDrawerVisible" title="编辑文章" direction="rtl" size="50%">
        <!-- 编辑文章表单 -->
        <el-form :model="editArticleModel" label-width="100px">
            <el-form-item label="文章标题">
                <el-input v-model="editArticleModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select placeholder="请选择" v-model="editArticleModel.categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">

                <el-upload class="avatar-uploader" :show-file-list="false" action="/api/upload"
                    :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="editArticleModel.coverImg" :src="editArticleModel.coverImg" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <div class="editor">
                    <quill-editor theme="snow" v-model:content="editArticleModel.content" contentType="html">
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="upArticle('已发布')">发布</el-button>
                <el-button type="info" @click="upArticle('草稿')">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>