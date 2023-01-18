const HtmlWebpackPlugin = require('html-webpack-plugin');


let devMode = true

module.exports = {
    mode: devMode ? "development" : "production",
    watch: devMode,
    // watchOptions: {
    //     poll: 500
    // },

    entry: "./src",

    plugins: [
        new HtmlWebpackPlugin({
            publicPath: "/static/js/bundle",
            scriptLoading: "blocking",
            template: __dirname + "/../../../../templates/pages/index.template.html",
            filename: __dirname + "/../../../../templates/pages/index.html",
            inject: false,
            minify: !devMode
        })
    ],

    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/../../bundle",
        clean: true
    },

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules$/
            }
        ]
    },

    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },

    devtool: devMode ? "source-map" : undefined
}