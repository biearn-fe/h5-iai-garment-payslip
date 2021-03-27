import env from 'environment';
import myAxios from './axios-config';
import service from '../service';

/* eslint-disable */
export default {
  async getConfig() {
    const userInfo = await service.getUser();
    // const baseUrl = env === 'local' ? '/api' : 'http://8.134.14.195:8080';
    // TODO app 暂未有企业识别码，先写死地址
    const baseUrl = env === 'local' ? '/api' : await service.getBaseUrl();
    // console.log('userInfo', userInfo.accessToken);
    const config = {
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${userInfo.accessToken}`
      }
    }
    // console.log('config', config);
    return config;
  },
  async post(url, data) {
    // console.log('config', await this.getConfig());
    return myAxios.post(url, data, await this.getConfig());
  },
  async form(url, data) {
    const defaultConfig = await this.getConfig();
    const headers = Object.assign({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }, defaultConfig.headers);
    const config = {
      baseURL: defaultConfig.baseURL,
      url: url,
      method: 'post',
      params: data,
      headers,
    };
    return myAxios();
  },
  async get(url, params) {
    let config = await this.getConfig();
    config.params = params;
    return myAxios.get(url, config);
  },
  async put(url, data) {
    return myAxios.put(url, data, await this.getConfig());
  },
  async delete(url) {
    return myAxios.delete(url, await this.getConfig());
  },
};
