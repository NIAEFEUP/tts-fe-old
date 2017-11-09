import Vue from 'vue';
import Router from 'vue-router';
import SchedulePage from '../components/SchedulePage';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'SchedulePage',
      component: SchedulePage,
    },
  ],
});
