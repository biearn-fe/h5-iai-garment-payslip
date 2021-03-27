<template>
  <div id="app">
    <keep-alive :include="FileList">
      <router-view />
    </keep-alive> 
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import config from 'config';
import env from 'environment';
import cubeModule from 'cubeModule';
import service from './service';
export default {
  data() {
    return {
      exclude: '',
      transitionName: `pop-${this.direction === 'reverse' ? 'out' : 'in'}`,
      FileList:['Home']
    };
  },
  watch: {
    direction(val) {
      if (val === 'forward') {
        this.transitionName = 'pop-in';
      } else {
        this.transitionName = 'pop-out';
      }
    },
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      direction: 'direction',
    }),
  },
  async mounted() {
    console.log('cubeModule', cubeModule);
    // 全局后退方法
    this.$root.goBack = this.goBack;
    // 初始化路由
    this.initRouter();
    // 解决safari、微信浏览器下拉回弹效果
    // this.fixAppScoll()
    this.initApp();
    /**
     * 监听返回键
     */
    document.addEventListener(
      'backbutton',
      () => {
        this.goBack();
      },
      false,
    );
  },
  methods: {
    initRouter() {
      // 路由初始化
      const routes = this.$router.options.routes
      const arr = [];
      for (let i = 0; i < routes.length; i++) {
        if (!routes[i].hasOwnProperty('meta') || !routes[i].meta.hasOwnProperty('keepAlive') || !routes[i].meta.keepAlive) {
          arr.push(routes[i].name)
        }
      }
      if (arr.length > 0) {
        this.exclude = arr.join(',');
      }
    },
    /**
     * 后退方法
     */
    goBack() {
      console.log(this.extra)
      let path = this.$route.path
      // let extra = this.extra
      let extra = null;
      if (path === '/' || (extra!=null && extra.action === this.$route.name)) {
        //清除应用缓存，避免回到发现依旧在推送页
        if(extra != null){
          this.$store.commit('updateExtra', null);
        }
        this.$nativeApi.exit(cubeModule.package)
      } else {
        this.$router.back()
      }
    },
    /**
     * 解决safari、微信浏览器下拉回弹效果
     */
    fixAppScoll() {
      const overscroll = function (el) {
        el.addEventListener('touchstart', () => {
          const top = el.scrollTop;
          const totalScroll = el.scrollHeight;
          const currentScroll = top + el.offsetHeight;
          if (top === 0) {
            el.scrollTop = 1;
          } else if (currentScroll === totalScroll) {
            el.scrollTop = top - 1;
          }
        });
        el.addEventListener('touchmove', (evt) => {
          if (el.offsetHeight < el.scrollHeight) {
            evt._isScroller = true;
          }
        });
      };
      overscroll(document.querySelector('#app'));
      document.body.addEventListener('touchmove', (evt) => {
        if (!evt._isScroller) {
          evt.preventDefault();
        }
      });
    },
    async initApp() {
      // 告诉App，程序已启动.
      this.$nativeApi.open(cubeModule.package);
      /**
       * 获取用户信息
       */
      service.getUser().then(userInfo => {
        console.log('getUser', userInfo);
        console.log('env', env);
      });
      // const user = await this.$nativeApi.getUser();
      // this.$store.commit('updateUser', user);
      if (env !== 'local') {
        // 底座环境下
        /**
         * 隐藏悬浮
         */
        // this.$nativeApi.hideFloat();
        /**
         * 隐藏导航
         */
        // this.$nativeApi.hideNav();
        /**
         * 状态栏变色
         */
        // this.$nativeApi.changeBarColor(config.statusBarColor);
        /**
         * 禁用webview橡皮筋效果
         */
        this.$nativeApi.setBounces('0');
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  // text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>