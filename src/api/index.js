/* 
    包装接口，便于外部调用
*/
import ajax from './ajax'

// 登录请求
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
// 添加用户
export const reqAdduser = data => ajax('/manage/user/add', data, 'POST')