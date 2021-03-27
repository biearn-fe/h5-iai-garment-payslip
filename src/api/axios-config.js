import axios from 'axios';
import { Toast } from 'vant';

/* eslint-disable */
/** **** 创建axios实例 ***** */
const request = axios.create({
  // baseURL: Global.baseURL,
  timeout: 10000, // 请求超时时间
  withCredentials: true,
  // queueOptions: {
  // 	retry: 2
  // }
});
// 添加请求拦截器
request.interceptors.request.use(
  (config) =>
    // 在发送请求之前做些什么
    config,
  (error) => {
    // 对请求错误做些什么
    console.error('request error \n', error),
    Promise.reject(error)
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // const res = response.data;
    // if (res.code == 200) {
    // 	return response.data;
    // }else{
    // 	Notification.error({
    // 		title: '错误',
    // 		message: res.msg,
    // 		position: 'bottom-right'
    // 	});
    // }
    return response.data;
  },
  (error) =>{
    // 对响应错误做点什么
    console.error('response error \n', error)
    let responseText = JSON.parse(error.request.responseText)
    if (error.request) {
      Toast.fail(responseText.errorMessage || responseText.error);
    }
    Promise.reject(error)
  }
);

export default request;