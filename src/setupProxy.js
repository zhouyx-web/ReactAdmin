const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    /* 请求路径 */
    app.use(createProxyMiddleware('/weather/v1/', {
        target: 'http://api.map.baidu.com',
        secure: false,
        changeOrigin: true
    }))

    app.use(createProxyMiddleware('/login', {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
    }))

    app.use(createProxyMiddleware('/manage/**', {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
    }))
}