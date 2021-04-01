import config from 'config';
import env from 'environment';
// import cubeModule from '@/../CubeModule.json';

const IAI_USER = 'IAIUser'; // 用户信息相关
const IAI_COMMON = 'IAICommon'; // 通用组件
export default {

  /**
   * 获取设备平台
   * @returns {number}
   */
  getPlatForm() {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    let flatform = 0;
    if (isAndroid) {
      flatform = 2;
    } else if (isiOS) {
      flatform = 1;
    }
    return flatform;
  },
  /**
   * 调用cordova的方法
   * @param name {string} 方法组、类别
   * @param method {string} 方法名称
   * @param params {Array} 参数
   * @return {promise}
   */
  callApi(name, method, params) {
    const promise = new Promise((resolve, reject) => {
      if (window.cordova) {
        try {
          window.cordova.exec((msg) => {
            resolve(msg);
          }, (msg) => {
            reject(msg);
          }, name, method, params || []);
        } catch (e) {
          console.log('_error', 'widget error:', e);
          reject(e);
        }
      } else {
        console.log('_debug', 'Cordova is not exist');
      }
    });
    return promise;
  },
  /**
   * 获取用户信息
   * @return {*|promise}
   */
  getUser() {
    return this.callApi(IAI_USER, 'getUser');
  },
  /**
   * 获取应用接口的请求地址
   * @return {*|promise}
   */
  getBaseUrl() {
    return this.callApi(IAI_USER, 'getBaseUrl');
  },
  /**
   * 打开应用
   * @param {*} mixProgramName
   */
  open(mixProgramName) {
    this.callApi(IAI_COMMON, 'openMixProgram', [10000, mixProgramName]).then();
  },
  /**
   * 退出应用
   * @param {*} mixProgramName
   */
  exit(mixProgramName) {
    if (window.cordova) {
      this.callApi(IAI_COMMON, 'closeMixProgram', [10000, mixProgramName]).then();
    } else {
      window.history.go(-1);
    }
  },
  /**
   * 获取设备信息
   * @return {*|promise}
   */
  getDeviceInfo() {
    return this.callApi(IAI_COMMON, 'getDeviceInfo');
  },
  /**
   * 是否禁用webview橡皮筋效果
   * @param params params '1': 启用 '0': 禁止
   * @returns {*}
   */
  setBounces(params) {
    return this.callApi(IAI_COMMON, 'setBounces', [params]);
  },
  /**
   * 调用扫描功能
   * @returns {*}
   */
  openSacn() {
    return this.callApi(IAI_COMMON, 'openScan', []);
  },
  // 以下待定
  /**
   * 后退
   * @return {*|promise}
   */
  goBack() {
    return this.callApi(IAI_COMMON, 'goBack', null);
  },
  /**
   * 改变状态栏颜色-仅IOS
   * @param p {array} 参数 [r, g, b]
   * @return {*|promise}
   */
  changeBarColor(p) {
    return this.callApi(IAI_COMMON, 'statusBarColor', p);
  },
  /**
   * 获取当前语言
   * 当没有引入cordova的时候，获取浏览器的语言环境，返回值需要处理才能设置语言环境比如 zh-cn 要对应到CN才能设置
   * @return {*|promise}
   */
  language() {
    if (env === 'local') {
      return new Promise((resolve) => {
        resolve({ language: config.language });
      });
    } if (window.cordova) {
      return this.callApi(IAI_COMMON, 'language', []);
    }
    const lan = (navigator.language || navigator.browserLanguage).toLowerCase();
    return {
      language: lan,
    };
  },
  /**
   * 登出，注销用户
   * @return {*|promise}
   */
  logout() {
    return this.callApi(IAI_COMMON, 'logout', null);
  },
  /**
   * 获取webview信息
   * @return {*|promise}
   */
  webview() {
    return this.callApi(IAI_COMMON, 'webview', null);
  },
  /**
   * 获取屏幕信息
   * @return {*|promise}
   */
  screen() {
    return this.callApi(IAI_COMMON, 'screen', null);
  },
  /**
   * 获取额外启动参数
   * @param params {array} 参数
   * @return {*|promise}
   */
  // getExtra(params) {
  //   return this.callApi(IAI_COMMON, 'getExtra', params || [cubeModule.identifier]);
  // },
  /**
   * 用外部浏览器打开链接
   * @param url {string} 链接地址url
   * @return {*|promise}
   */
  openSysBrowser(url) {
    return this.callApi(IAI_COMMON, 'openSysBrowser', [url]);
  },
  /**
   * 是否是debug版本
   * @param {}
   * @return {*|promise}
   */
  isDebugVersion() {
    return this.callApi(IAI_COMMON, 'isDebugVersion');
  }
};