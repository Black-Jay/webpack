const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
console.log("🚀🚀🚀🚀🚀🚀");
module.exports = {
    entry: `${__dirname}/src/app.js`,
    output: {
        path: `${__dirname}/dist`,
        filename: "[name]-[hash].js"
    },
    module: {
        rules: [
        {
            test: /\.css$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' }
            ]
        }]
    },
    resolve: {
        extensions: ['.js', '.css']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: `${__dirname}/src/index.html`
        })
    ]
}