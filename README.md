# Webpack4
---
- 一个简单的Demo
### 1.一个简单的Demo
- 准备
- 单文件测试
---
#### 1.1 准备
1. 不用多说`node.js`肯定是要有的;
2. 利用npm安装webpack所需的插件：
    ```
    sudo npm install webpack webpack-cli webpack-dev-server -g //这些是安装了webpack的三个插件（全局哦~）
    ```
#### 1.2 单文件在webpack中加载js
1. 创建基本文件夹
    - config
    - dist/index.html
    - src/main.js
2. 创建package.json文件
    在命令行输入`npm init -y`然后就会生成package.json的文件
3. 在命令行中输入：
    - 开发环境
    ```
    webpack --mode=development
    ```
    - 生产环境也就是上线的时候
    ```
    webpack --mode=production
    ```
    这两者的区别生产环境生成出来的文件是经过压缩得
    这是webpack4新的命令
    这样src中的main.js，打包到了dist文件夹中s
4. 利用webpack.dev.js
    - config/webpack.dev.js
    - dist/index.html
    - src/main.js
    写入配置：
    ```js
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
            //让index.html引入路径js
            publicPath: "/"
        }
    }
    ```
    `webpack --config=config/webpack.dev.js`
    怎么让dist中的index.html引入main-bundle.js呢？
    ```js
    output: {
            filename: "[name]-bundle.js",
            path: path.resolve(__dirname, "../dist"),
            //让index.html引入路径js
            publicPath: "/"
    }
    ```
    如果是`publicPath: "/js`的话在HTML中则需要`src="/js/main-bundle.js"`
5. 本地装入webpack
    ```js
    npm install webpack webpack-cli webpack-dev-server
    ```
    `webpack-dev-server`：是webpack热更新的一个启动
    运行`webpack-dev-server --config=config/webpack.dev.js`
    这时候进入http://localhost:8080就会发现都是dist文件的根目录
    需要配置本地服务器
    ```js
    devServer: {
        contentBase: "dist"
    }
    ```
    这样你会发现更改src/main.js，才会启动热更新。是因我我们现在还没有配置html以及css，接下来我们继续搞。
### 1.3 在webpack加载css样式