import Vue from 'vue';
import Vant from 'vant';
import './style/style.css';
import 'vant/lib/index.css';
import VConsole from 'vconsole';
import env from 'environment';
import App from './App.vue';
import native from './native';
import router from './router';
import store from './store';

Vue.use(Vant);

Vue.prototype.$nativeApi = native;
Vue.config.productionTip = false;

import moment from 'moment'; //导入模块
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 
Vue.prototype.$moment = moment;//赋值使用

function init() {
  /* eslint-disable no-new */
  // new VConsole();
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}

if (env === 'local') {
  // console.error('cordova is not exist');
  init()
} else {
  // console.log('window.cordova', window.cordova);
  // console.log('cordova', cordova);
  document.addEventListener('deviceready', init, false)
}
