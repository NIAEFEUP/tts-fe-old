import 'core-js/fn/promise';
import 'core-js/fn/array/fill';
import 'core-js/fn/array/find';
import Vue from 'vue';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import vMediaQuery from 'v-media-query';
import { Button, ButtonGroup, Dialog, Checkbox, Notification, Loading } from 'element-ui';
import Scrollbar from 'element-ui/lib/scrollbar';
import './styles/global.scss';
import '../theme/scrollbar.css';
import App from './App';
import store from './store/index';

Vue.config.productionTip = false;

const axiosInstance = Axios.create({
  baseURL: '/api/',
});

Vue.use(VueAxios, axiosInstance);
Vue.use(Vuex);
Vue.use(vMediaQuery);

Vue.use(Dialog);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Checkbox);
Vue.use(Scrollbar);
Vue.use(Loading.directive);
Vue.prototype.$notify = Notification;
global.$notify = Notification;

Vue.prototype.$lang = store.getters.lang;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});

window.onhashchange = () => {
  if (window.location.hash) {
    store.dispatch('parseUrl', window.location.hash.slice(1));
  }
};
