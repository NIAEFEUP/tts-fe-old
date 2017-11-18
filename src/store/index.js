import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    loading: true,
    data: {},
    programmes: null,
    selectedProgramme: null,
    enabledCourses: {},
    disabledLectures: {},
    disabledPracticals: {},
    selectedPracticals: {},
  },
  mutations,
  actions,
  getters,
  strict: debug,
});
