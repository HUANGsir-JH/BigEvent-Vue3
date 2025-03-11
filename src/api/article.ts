import request from '@/utils/request'

export function getArticleCategories() { 
    return request.get('/category')
}

export function addArticleCategory(data: any) { 
    return request.post('/category/add', data)
}

export function updateArticleCategory(data: any) { 
    return request.put('/category', data)
}

export function deleteArticleCategory(id: number) {
    return request.delete('/category?id='+id)
}

export function getArticleDetails(params:any) {
    return request.get('/article', {params: params})
}

export function addArticle(data: any) { 
    return request.post('/article/add', data)
}

export function deleteArticle(id: number) {
    return request.delete('/article?id=' + id)
}

export function updateArticle(data: any) { 
    return request.put('/article', data)
}