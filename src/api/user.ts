// 导入请求工具
import request from '@/utils/request'

// const userRegister = (data: any) => { 
//     // 将数据转换为x-www-form-urlencoded格式
//     data = new URLSearchParams(data).toString()
//     return request.post('/users/register', data)
// }
export function userRegister(data: any) {
    data = new URLSearchParams(data).toString()
    return request.post('/user/registry', data)
}

export function userLogin(data: any) { 
    data = new URLSearchParams(data).toString()
    return request.post('/user/login', data)
}

export function getUserInfo() { 
    return request.get('/user/userinfo')
}

export function updateUserInfo(data: any) {
    return request.put('/user/update', data)
}

export function updateUserAvatar(data: any) {
    let params = new URLSearchParams()
    params.append('avatarUrl', data)
    return request.patch('/user/updateAvatar', params)
}

export function updateUserPassword(data: any) {
    return request.patch('/user/updatePassword', data)
}