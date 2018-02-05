/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { getInitialSchedulingState } from '@/store/index';
import * as types from './mutation-types';

function getCoursePaths(state) {
  const paths = [];
  Object.entries(state.enabledCourses).forEach(([programme, years]) => {
    Object.entries(years).forEach(([year, courses]) => {
      Object.keys(courses).forEach((course) => {
        paths.push([programme, year, course].join('.'));
      });
    });
  });
  return paths;
}

export default {
  [types.SET_COURSES_DIALOG_VISIBILITY](state, visible) {
    state.coursesDialogVisible = visible;
  },
  [types.SET_SCHEDULE_LOADING](state, isLoading) {
    state.schedule.loading = isLoading;
  },
  [types.SET_PROGRAMMES_LOADING](state, isLoading) {
    state.programmes.loading = isLoading;
  },
  [types.ADD_SCHEDULE_DATA](state, data) {
    state.schedule.data = { ...state.schedule.data, ...data };
  },
  [types.SET_PROGRAMMES](state, data) {
    state.programmes.loading = false;
    Vue.set(state.programmes, 'list', data);
  },
  [types.SET_SCHOOLS_LOADING](state, isLoading) {
    state.schools.loading = isLoading;
  },
  [types.SET_SCHOOLS](state, list) {
    state.schools.loading = false;
    state.schools.list = list;
  },
  [types.SET_YEARS_LOADING](state, isLoading) {
    state.years.loading = isLoading;
  },
  [types.SET_YEARS](state, list) {
    state.years.loading = false;
    state.years.list = list;
  },
  [types.CHANGE_LECTURE_STATUS](state, { path, enabled }) {
    Vue.set(state.disabledLectures, path, !enabled);
  },
  [types.CHANGE_PRACTICAL_STATUS](state, { path, enabled }) {
    Vue.set(state.disabledPracticals, path, !enabled);
  },
  [types.CHANGE_ALL_PRACTICAL_STATUS](state, enabled) {
    if (enabled) {
      Vue.set(state, 'disabledPracticals', {});
    } else {
      const obj = getCoursePaths(state).reduce((acc, path) => ({ ...acc, [path]: true }), {});
      Vue.set(state, 'disabledPracticals', obj);
    }
  },
  [types.CHANGE_ALL_LECTURE_STATUS](state, enabled) {
    if (enabled) {
      Vue.set(state, 'disabledLectures', {});
    } else {
      const obj = getCoursePaths(state).reduce((acc, path) => ({ ...acc, [path]: true }), {});
      Vue.set(state, 'disabledLectures', obj);
    }
  },
  [types.CHANGE_SELECTED_PRACTICAL](state, { path, selectedClass }) {
    const pathArray = path instanceof Array ? path.join('.') : path;
    Vue.set(state.selectedPracticals, pathArray, selectedClass);
  },
  [types.SET_SELECTED_PROGRAMME](state, programme) {
    state.selectedProgramme = programme;
  },
  [types.SET_SELECTED_SCHOOL](state, school) {
    state.selectedSchool = school;
  },
  [types.SET_SELECTED_YEAR](state, programme) {
    state.selectedYear = programme;
  },
  [types.SET_SELECTED_SEMESTER](state, programme) {
    state.selectedSemester = programme;
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
    if (!state.enabledCourses[programme.fullAcronym]) {
      Vue.set(state.enabledCourses, programme.fullAcronym, {});
    }
    if (enabled) {
      const obj = courses.reduce((o, course) => ({ ...o, [course]: true }), {});
      Vue.set(state.enabledCourses[programme.fullAcronym], year, obj);
    } else {
      state.enabledCourses[programme.fullAcronym][year] = {};
    }
  },
  [types.RESET](state) {
    const initialState = getInitialSchedulingState();
    Object.keys(initialState).forEach((key) => {
      Vue.set(state, key, initialState[key]);
    });
  },
};
