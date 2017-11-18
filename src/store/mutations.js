/* eslint-disable no-param-reassign */
import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.SET_LOADING](state, isLoading) {
    state.loading = isLoading;
  },
  [types.ADD_SCHEDULE_DATA](state, data) {
    state.data = { ...state.data, ...data };
    state.loading = false;
  },
  [types.SET_PROGRAMMES](state, data) {
    state.programmes = data;
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
  [types.SET_SELECTED_PROGRAMME](state, programme) {
    state.selectedProgramme = programme;
  },
  [types.CHANGE_COURSE_ENABLED](state, { path, enabled }) {
    const [programme, year, course] = path;
    if (!state.enabledCourses[programme]) {
      Vue.set(state.enabledCourses, programme, {
        [year]: {
          [course]: enabled,
        },
      });
    } else if (!state.enabledCourses[programme][year]) {
      Vue.set(state.enabledCourses[programme], year, {
        [course]: enabled,
      });
    } else {
      Vue.set(state.enabledCourses[programme][year], course, enabled);
    }
  },
};
