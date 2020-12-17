/* 将日期时间戳转化成字符串 */
export default function dateToString(date) {
    if(!date) return ''
    /* Date.now() 获取的时间戳不可以直接调用Date的原型方法，需要先转化一次 */
    date = new Date(date)
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}