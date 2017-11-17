/* eslint-disable import/prefer-default-export */
import * as types from './mutation-types';

const testdata = require('../../testdata.json');

export function getCourses({ commit }) {
  commit(types.SET_LOADING, true);
  return new Promise((resolve) => {
    const data = [
      'FEUP-MIEIC',
    ];
    setTimeout(() => resolve(data), 20);
  }).then(data => commit(types.ADD_COURSES, data));
}

export function getScheduleData({ commit }, course) {
  commit(types.SET_LOADING, true);
  commit(types.CLEAR_SCHEDULE_DATA);
  return new Promise((resolve) => {
    setTimeout(() => resolve(testdata), 20);
  }).then(data => commit(types.ADD_SCHEDULE_DATA, { [course]: data }));
}
