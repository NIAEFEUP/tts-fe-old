/* eslint-disable no-param-reassign */
import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.SET_LOADING](state, isLoading) {
    state.loading = isLoading;
  },
  [types.ADD_SCHEDULE_DATA](state, data) {
    state.data = data;
    state.loading = false;
  },
  [types.CLEAR_SCHEDULE_DATA](state) {
    state.data = null;
  },
  [types.ADD_COURSES](state, data) {
    state.courses = data;
    state.loading = false;
  },
  [types.CHANGE_LECTURE_STATUS](state, { path, enabled }) {
    Vue.set(state.disabledLectures, path, !enabled);
  },
  [types.CHANGE_PRACTICAL_STATUS](state, { path, enabled }) {
    Vue.set(state.disabledPracticals, path, !enabled);
  },
  [types.CHANGE_SELECTED_PRACTICAL](state, { path, selectedClass }) {
    Vue.set(state.selectedPracticals, path, selectedClass);
  },
};
