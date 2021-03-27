// import Vue from 'vue';
import config from 'config';
import native from './native';
import store from './store';
import request from './api';
import env from 'environment';

/* eslint-disable */
const service = {
  getUser() {
    return new Promise((resolve, reject) => {
      const { userInfo } = store.getters;
      if (userInfo) {
        // 如果存在缓存，直接resolve缓存
        resolve(userInfo);
      } else if (window.cordova) {
        // 不存在缓存的情况下，调用底座接口获取
        native.getUser().then((response) => {
          const resp = typeof response === 'string' ? JSON.parse(response) : response;
          console.log('getUser type response', typeof response);
          console.log('getUser resp', resp);
          if (resp) {
            // 缓存用户信息
            store.commit('updateUser', resp);
          }
          resolve(resp);
        }, () => {
          reject('获取用户失败');
        });
      } else if (env === 'local') {
        store.commit('updateUser', config.userTest);
        resolve(config.userTest);
      }
    });
  },
  getBaseUrl() {
    return new Promise((resolve, reject) => {
      const { url } = store.getters;
      if (url) {
        // 如果存在缓存，直接resolve缓存
        resolve(url);
      } else if (window.cordova) {
        // 不存在缓存的情况下，调用底座接口获取
        native.getBaseUrl().then((response) => {
          const resp = typeof response === 'string' ? JSON.parse(response) : response;
          console.log('getBaseUrl type response', typeof response);
          console.log('getBaseUrl resp', resp);
          if (resp) {
            // 缓存接口信息
            store.commit('updateUrl', resp.baseUrl);
          }
          resolve(resp.baseUrl);
        }, () => {
          reject('获取请求地址失败');
        });
      }
    });
  },
  /* 获取设备信息 */
  getDeviceInfo() {
    return native.getDeviceInfo().then(resp => {
      return typeof resp === 'string' ? JSON.parse(resp) : resp;
    });
  },
  /**
   * 调用扫码
   */
  openScan() {
    if (window.cordova) {
      return native.openSacn().then(resp => {
        return typeof resp === 'string' ? JSON.parse(resp) : resp;
      });
    } else if (env === 'local') {
      return new Promise((resolve, reject) => {
        resolve({
          resCode: 200,
          scanResult: 'BQ2A-2020',
          isLocal: true,
        });
      });
    }
  },
  /* 修改状态栏颜色，仅支持IOS,默认白色 */
  // changeStateColor(colorRGBA) {
  //   return new Promise((resolve, reject) => {
  //     if (window.cordova) {
  //       // 不存在缓存的情况下，调用底座接口获取
  //       if (!colorRGBA) {
  //         colorRGBA = [72, 71, 89, 1];
  //       }
  //       native.changeColor(colorRGBA).then((response) => {
  //         if (response) {
  //         }
  //         resolve(response);
  //       }, () => {
  //         reject('error');
  //       });
  //     } else {
  //       reject('error');
  //     }
  //   });
  // },
  /* 自定义方法 start */
  getUserList() {
    return request.get('/auth/admin/realms/main/users?status=enabled');
  },
  getPayslip(params) {
    return request.get('/iai/payslip/garment', params);
  },
  submitPayslip(params) {
    return request.post('/iai/payslip/garment', params);
  },
};

export default service;
