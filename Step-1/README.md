webpack4编译基础示例
---
* [1. ready](#1)
* [2. 配置webpack](#2)
* [3. 加载css](#3)
* [4. 加载html](#4)
* [5. 加载image](#5)
* [6. babel编译](#6)
* [7. webpack中babel转换](#7)


ready<a id="1"></a>
---
首先node.js肯定是要有的。然后利用npm安装webpack所需的插件（全局哦 这样直接可以在终端输入webpack命令）：
```shell
sudo npm install webpack webpack-cli webpack-dev-server -g
```
- `webpack`: webpack的总包
- `webpack-cli`: webpack的构建工具
- `webpack-dev-server`: 这仅用于开发，在开发中重载本地或开发服务器而使用

配置webpack及基础编译js<a id="2"></a>
---
**新建文件夹**
- config
- dist/index.html
- src/main.js

**创建package.json文件**
在命令行输入`npm init -y`然后就会生成package.json的文件，接着在命令行中输入
```shell
webpack --mode=development //开发环境
```
```shell
webpack --mode=production   //生产环境也就是上线的时候
```
这两者的区别生产环境生成出来的文件是经过压缩得，这是webpack4新的命令。这样src中的main.js，打包到了dist文件夹中

**利用webpack.dev.js**
- config/webpack.dev.js
- dist/index.html
- src/main.js

./config/webpack.dev.js写入配置：
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
终端输入`webpack --config=config/webpack.dev.js`。
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

**本地装入webpack**
```shell
npm install webpack webpack-cli webpack-dev-server
```
运行`webpack-dev-server --config=config/webpack.dev.js`
这时候进入http://localhost:8080就会发现都是dist文件的根目录。这时候就需要配置devServer
```js
devServer: {
    contentBase: "dist"
}
```
这样你会发现更改src/main.js，才会启动热更新。是因我我们现在还没有配置html以及css，接下来我们继续搞。

**可视化提示信息**
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
overlay写为true就可以在浏览器的页面上输出报错的信息。

**package.json**
每次启动webpack的时候输入命令都很长，接下来我们要利用上package.json，减少启动webpack命令的输入量
- ./package.json
```js
"scripts": {
    "start": "webpack-dev-server --config=config/webpack.dev.js",
    "build": "webpack --config=config/webapck.dev.js"
}
```
在终端运行即可
`npm run start`
`npm run build`
以上都是package.json简单的方式

加载css<a id="3"></a>
---
在`webpack`中如果你想渲染和编译css，首先要配置`loader`。
在没有loader的情况下，新建./src/main.css。并且在./src/main.js中引入css，`require("./main.css");`。
运行webpack：
```shell
npm run start
```
❌这时发生了错误:
原因：在webpack中你想渲染和编译css，你需要下载相应的loader


**安装loader**
```shell
npm intsall style-loader    //渲染css的
```
```shell
npm intsall css-loader  //能写入webpack的
```

**配置loader**
./config/webpack.dev.js
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
运行webpack，`npm run start`这样在页面中就可以加载css的全部样式了

加载html<a id="4"></a>
---
当然css有自己的loader，html也是有自己的loader的。./dist文件夹中是线上编译后的文件。因为没有配置html的loader，以上都是在dist文件夹中写入一个呈现页面的依赖。这节我们可以把dist清空。新建./src/index.html：
依赖./src/index.js`require("./index.html");`。
在html的loader有三个：
- html-loader  首先找到html文件
- extract-loader    将html和js分离
- file-loader   加载文件起名
  
在webpack加载中需要安装对应的加载器，而且这三个loader是有一定流程的
安装：
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
运行webpack`npm run start`

加载image<a id="5"></a>
---
写下来介绍image的loader：

**配置image loader**
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
**给名字哈希值**
```js
"image/[name]-[hash:8].[ext]"
```

babel编译<a id="6"></a>
--
目前部分浏览器能够是别ES6，那些不支持ES6的浏览器得需要用babel进行转换，首先安装bable-core。
```js
npm install babel-core --save-dev   //babel-core 是babel编译器的核心
```

**测试**
在main.js中写入一串es6的语法
```js
let a = () => {
    console.log("Hello Future");
}
```
如果想要直接编译上面的代码，就需要安装：
```js
sudo npm install -g babel-cli
```

**创建文件.babelrc**
注：带有末尾lrc后缀的文件，都是自动加载的文件

**安装编译箭头函数**
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

webpack中babel转换<a id="7"></a>
---
**在./config/webpack.dev.js配置**
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
**装入babel-loader**
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


