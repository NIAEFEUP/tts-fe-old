import 'core-js/fn/promise';
import 'core-js/fn/array/fill';
import 'core-js/fn/array/find';
import Vue from 'vue';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import vMediaQuery from 'v-media-query';
import { Button, ButtonGroup, Dialog, Checkbox, Notification } from 'element-ui';
import './styles/global.scss';
import App from './App';
import store from './store/index';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueAxios, Axios);
Vue.use(Vuex);
Vue.use(vMediaQuery);

Vue.use(Dialog);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Checkbox);
Vue.prototype.$notify = Notification;
global.$notify = Notification;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
