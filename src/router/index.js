import Vue from 'vue';
import Router from 'vue-router';
import Schedule from '../components/Schedule';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Schedule,
    },
  ],
});
