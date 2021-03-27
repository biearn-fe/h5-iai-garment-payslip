import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import List from '../views/List.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },{
    path: '/list',
    name: 'List',
    component: List,
  }
];

const router = new VueRouter({
  routes,
});

export default router;
