/* eslint-disable no-param-reassign */
import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.ADD_SCHEDULE_DATA](state, data) {
    state.loading = false;
    state.data = data;
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
