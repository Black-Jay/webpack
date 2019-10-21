const path = require("path");
module.exports = {
    //入口文件 有并且可以有多个
    entry: {
        main: ["./src/main.js"]
    },
    //打包环境：开发or生产
    mode: "development",
    //出口文件： 有且只能有一个
    output: {
        filename: "[name]-bundle.js",
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/"
    },
    //本地服务器
    devServer: {
        contentBase: "dist"
    }
}