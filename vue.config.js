const WebpackZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
const environment = require('./src/config/env/index.js');
const envConfig = require('./src/config/index.js');
const cubeModule = require('./CubeModule.json');
/* eslint-disable */
const NODE_ENV = process.env.NODE_ENV.trim();

function resolvePath(dir) {
  return path.join(__dirname, dir);
}

function getEnv() {
  let env = resolvePath((NODE_ENV === 'production')
    ? './src/config/product-env/index.js'
    : './src/config/env/index.js');
  if (NODE_ENV === 'development') {
    env = resolvePath('./src/config/env/index.js');
  }
  return env;
}

module.exports = {
  outputDir: 'www',
  productionSourceMap: NODE_ENV === 'production' ? false : true,
  lintOnSave: false,
  publicPath: './',
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'environment': getEnv(),
        'config': resolvePath('./src/config/index.js'),
        'cubeModule': resolvePath('./CubeModule.json'),
      },
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(__dirname, './CubeModule.json'),
            to: path.join(__dirname, './www')
          },
        ]
      }),
      new WebpackZipPlugin({
        path: path.join(__dirname, './www'),
        filename: (cubeModule.package + '-' + cubeModule.version + '.zip')
      }),
    ],
  },
  devServer: {
    port: 9000,
    proxy: {
      '/api': {
        target: envConfig.baseUrl[environment],
        changeOrigin: true, // 跨域
        secure: false, // https
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  chainWebpack: (config) => {
    if (NODE_ENV === 'production') {
      // console.log(`cubeModule: ${cubeModule.identifier + '-' + cubeModule.name + '-' +  cubeModule.version + '-' + environment + '.zip'}`);
      // new CopyWebpackPlugin([
      //   {
      //     from: path.resolve(__dirname, './CubeModule.json'),
      //     to: config.build.assetsRoot
      //   }
      // ])
    } else {
      console.log(`proxy api: ${envConfig.baseUrl[environment]}`);
      // console.log(`NODE_ENV: ${envConfig.env}`);
    }
  },
};