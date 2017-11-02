import 'core-js/fn/promise';
import 'core-js/fn/array/fill';
import Vue from 'vue';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import App from './App';
import store from './store/index';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueAxios, Axios);
Vue.use(Vuex);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
