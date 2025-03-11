<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue'
import { getArticleCategories, addArticleCategory,updateArticleCategory,deleteArticleCategory } from '@/api/article'
import { ElMessage, ElMessageBox } from 'element-plus'

const categorys = ref([])

// 获取分类列表
const getCategories = async () => {
    let res = await getArticleCategories()
    if (res.code === 0) {
        categorys.value = res.data
    } else {
        ElMessage.error(res.message ? res.message : '获取分类列表失败，稍后重试')
    }
}

//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}

// 添加分类
const addCategory = async () => {
    let res = await addArticleCategory(categoryModel.value)
    if (res.code === 0) {
        ElMessage.success('添加分类成功')
        dialogVisible.value = false
        getCategories()
    } else {
        ElMessage.error(res.message ? res.message : '添加分类失败，稍后重试')
    }
}

// 编辑分类
const editDialogVisible = ref(false)
const editCategoryModel = ref({
    id: '',
    categoryName: '',
    categoryAlias: ''
})

const editCategory = (row) => {
    editDialogVisible.value = true
    editCategoryModel.value.id = row.id
    editCategoryModel.value.categoryName = row.categoryName
    editCategoryModel.value.categoryAlias = row.categoryAlias
}

const updateCategory = async ()=>{
    let res = await updateArticleCategory(editCategoryModel.value)
    if (res.code === 0) {
        ElMessage.success('编辑分类成功')
        editDialogVisible.value = false
        getCategories()
    } else {
        ElMessage.error(res.message ? res.message : '编辑分类失败，稍后重试')
    }
}

// 删除分类
const deleteCategory = async (row) => {
    ElMessageBox.confirm('是否删除该分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        let res = await deleteArticleCategory(row.id)
        if (res.code === 0) {
            ElMessage.success('删除分类成功')
            getCategories()
        } else {
            ElMessage.error(res.message ? res.message : '删除分类失败，稍后重试')
        }
    }).catch(() => {
        // 取消操作
        ElMessage({
            type: 'info',
            message: '已取消删除'
        })
    })
}

onMounted(() => {
    getCategories()
})
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible=true">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }"> <!-- 这里的 row 是当前行的数据 -->
                    <el-button :icon="Edit" circle plain type="primary" @click="editCategory(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加分类" width="30%">
        <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="categoryAlias">
                <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addCategory"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 添加分类编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑分类" width="30%">
        <el-form :model="editCategoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="editCategoryModel.categoryName" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="categoryAlias">
                <el-input v-model="editCategoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateCategory"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>

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
</style>