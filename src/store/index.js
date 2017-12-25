import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export const getInitialSchedulingState = () => ({
  schedule: {
    data: {},
    loading: false,
  },
  enabledCourses: {},
  disabledLectures: {},
  disabledPracticals: {},
  selectedPracticals: {},
});

export default new Vuex.Store({
  state: {
    language: 'pt',
    coursesDialogVisible: false,
    selectedYear: null,
    selectedSemester: null,
    selectedProgramme: null,
    years: {
      loading: false,
      list: null,
    },
    programmes: {
      loading: false,
      list: null,
    },
    ...getInitialSchedulingState(),
  },
  mutations,
  actions,
  getters,
  strict: debug,
});
