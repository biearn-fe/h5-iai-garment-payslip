import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import direction from './modules/direction';
import url from './modules/url';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    direction,
    url,
  },
  getters,
});
