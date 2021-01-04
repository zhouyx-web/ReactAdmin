/* 
    将用户登录状态直接保存到内存中会受到刷新的影响。
    解决方案：将用户登录状态保存到localstorage中，即使浏览器关闭也不会消失
    实现方法：
        1.直接操作原生localstorage
        2.使用store库间接操作
    缺点：若每次跳转或者刷新都从磁盘中读取数据，速度较慢
    解决办法：因为在登录路由界面 /login 主路由 / 界面都会判断是否有用户已经登录，即localstorage
    中是否存在用户，来决定到底跳转页面还是保持当前页面，所以可以直接在入口index.js文件中将磁盘中
    的localstorage先读到内存中，加快访问速度
*/
import store from 'store'

const USER_KEY = 'user_key'

const storageUtils = {
    setUser(user){
        // localStorage.setItem(USER_KEY, JSON.stringify(user));
        store.set(USER_KEY, user)
    },
    getUser(){
        // return JSON.parse(localStorage.getItem(USER_KEY) || "{}")
        return store.get(USER_KEY) || {}
    },
    remove(){
        // localStorage.removeItem(USER_KEY);
        store.remove(store.remove(USER_KEY))
    }
}

export default storageUtils
