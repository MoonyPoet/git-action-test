var path = require("path");
var webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    lintOnSave: false,
    configureWebpack:config => {
        if (process.env.NODE_ENV === 'production') {
          // 为生产环境修改配置...
          return {
            resolve: {
                extensions: ['.js', '.json', '.vue'],
                alias: {
                    'common': path.resolve(__dirname, './src/common'),
                    'public': path.resolve(__dirname, './public'),
                    'assets': path.resolve(__dirname, './src/assets/'),
                }
            }, 
            plugins: [
              new BundleAnalyzerPlugin()
            ]
          }
        } else {
          // 为开发环境修改配置...
          return {
            resolve: {
                extensions: ['.js', '.json', '.vue'],
                alias: {
                    'common': path.resolve(__dirname, './src/common'),
                    'public': path.resolve(__dirname, './public'),
                    'assets': path.resolve(__dirname, './src/assets/')
                }
            }
          }
        }
    },
    publicPath: 'manage',
    // pages: {
    //   index: {
    //     // entry for the page
    //     entry: 'src/main.js',
    //     // the source template
    //     template: './public/index.html',
    //     // output as dist/index.html
    //     filename: './../../backstageupload/index.html'
    //   },
    // },
    assetsDir: "./",
    parallel: true //多线程编译
};
// const compiler = new webpack.Compiler();
// console.log(compiler.hooks.someHook.tap)
