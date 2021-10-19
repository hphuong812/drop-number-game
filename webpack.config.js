const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports={
    entry : './src/app.js',
    mode : 'development',
    devtool: "inline-source-map",
    output: {
        filename : 'index.js',
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        port: 3000,
        static: path.join(__dirname, "dist"),
        compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "assets", to: "assets"}],
        }),
    ]
}