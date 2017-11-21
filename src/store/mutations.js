/* eslint-disable no-param-reassign */
import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.SET_SCHEDULE_LOADING](state, isLoading) {
    state.schedule.loading = isLoading;
  },
  [types.SET_PROGRAMMES_LOADING](state, isLoading) {
    state.programmes.loading = isLoading;
  },
  [types.ADD_SCHEDULE_DATA](state, data) {
    state.schedule.data = { ...state.schedule.data, ...data };
    state.schedule.loading = false;
  },
  [types.SET_PROGRAMMES](state, data) {
    state.programmes.loading = false;
    state.programmes.list = data;
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
      Vue.set(state.enabledCourses[programme], year, { [course]: enabled });
    } else {
      Vue.set(state.enabledCourses[programme][year], course, enabled);
    }
  },
  [types.CHANGE_YEAR_COURSES_ENABLED](state, { programme, year, courses, enabled }) {
    if (!state.enabledCourses[programme]) {
      Vue.set(state.enabledCourses, programme, {});
    }
    if (enabled) {
      const obj = courses.reduce((o, course) => ({ ...o, [course]: true }), {});
      Vue.set(state.enabledCourses[programme], year, obj);
    } else {
      state.enabledCourses[programme][year] = {};
    }
  },
};
