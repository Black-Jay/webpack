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
1. 新建mian.css
    - src/main.css
    - 在main.js中引入

    `require("./main.css");`
    - 运行webpack

    `webpack-dev-server --config=config/webpack.dev.js`
    - 这时发生了错误:

    原因：在webpack中你想要记载对应的css时，你需要下载相应的loader
2. 配置loader
    css有css的加载器、图片有图片的加载器
    安装loader
    渲染css的
    `npm intsall style-loader`
    能写入webpack的
    `npm intsall css-loader`
    - ./config/webpack.dev.js
    ```js
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    }
    ```
    运行webpack
    `webpack-dev-server --config=config/webpack.dev.js`
    这样在页面中就可以加载css的全部样式了
### 1.4 可视化提示信息
    在编写代码中，必可少的会出现一些错误。webpack在展示错误中有两种方式：
    - 在终端中展示错误
    - 在浏览中页面上展示错误
    webpack自带的在终端上进行提示，但如果你想在浏览器的页面上进行提示你就要进行以下的配置：
    ```js
    devServer: {
        contentBase: "dist",
        overlay: true
    }
    ```
    overlay写为true就可以在浏览器的页面上输出报错的信息了。
### 1.5 package.json
    每次启动webpack的时候输入命令都很长，接下来我们要利用上package.json，减少启动webpack命令的输入量
    - ./package.json
    ```js
    "scripts": {
        "start": "webpack-dev-server --config/webpack.dev.js",
        "build": "webpack --config=config/webapck.dev.js"
    }
    ```
    在终端运行即可
    `npm run start`
    `npm run build`
    以上都是package.json简单的方式
### 1.6 webpack加载html
1. 以上边的demo为例，首先把./dist/下的文件去掉
2. 新建./src/index.html
3. 在js中识别html
./src/index.js
`require("./index.html");`
4. 在webpack加载中需要安装对应的加载器
- html-loader  首先找到html文件
- extract-loader    将html和js分离
- file-loader   加载文件起名
这三个loader是有一定流程的
```js
npm install file-loader extract-loader html-loader --dev-save
```
./config/webpack.dev.js
```js
//html loader
{
    test: /\.html$/,
    use: [
        {
            loader: "file-name",
            options: {
                name: "[name].html"
            }
        },
        {
            loader: "extract-loader"
        },
        {
            loader: "html-loader"
        }
    ]
}
```
运行webpack
`npm run start`
### 1.7 webpack加载image
1. 新建文件 `./src/image
2. 在html中引入图片
3. 配置loader
```js
//image loader
{
    test: /\.(jpg|gif|png)$/,
    use: [
        {
            loader: "file-loader",
            options: {
                name: "image/[name].[ext]"
            }
        }
    ]
}
```
### 1.8 给名字哈希值
```js
"image/[name]-[hash:8].[ext]"
```
### 1.9 终端 - babel转换
目前部分浏览器能够是别ES6，那些不支持ES6的浏览器得需要用babel进行转换
首先安装bable-core
```js
npm install babel-core --save-dev
```
babel-core 是babel编译器的核心
创建文件 ./.babelrc
注：带有末尾lrc后缀的文件，都是自动加载的文件
在main.js中写入一串es6的语法
```js
let a = () => {
    console.log("Hello Future");
}
```
如果想要直接编译上面的代码，就需要安装：
全局安装：
```js
sudo npm install -g babel-cli
```
项目中安装：
```js
npm install babel-plugin-transform-es2015-arrow-functions --save-dev
```
babel-plugin-transform-es2015-arrow-functions是：将ES2015箭头功能编译为ES5（只是箭头函数哦）
并且在./.babelic中配置如下代码：
```js
{
    "plugins": [
        "transform-es2015-arrow-functions"
    ]
}
```
在终端输入代码
```js
babel src/main.js
```
这时候就可以看到利用bable后编译成功的代码
### 1.10 webpack - babel转换
在./config/webpack.dev.js配置
```js
//js loaders
{
    test: /\.js$/,
    use: [
        {
            loader: "babel-loader"
        }
    ],
    exclude: /node_modules/ //不需要转换的东西
}
```
装入babel-loader
```js
npm install babel-loader --save-dev
```
启动webpack
```js
npm run start
```
这时就把es6语法进行了转换
**上面代码会出现的问题**
babel-core 和 babel-loader 版本号出现的问题
解决办法
npm install @babel/core --save-dev
或者：
原因"babel-loader": "^8.0.0" 版本问题。
使用"babel-loader": "^7.1.5"即可解决该错误。
