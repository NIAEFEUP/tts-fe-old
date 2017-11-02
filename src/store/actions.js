/* eslint-disable import/prefer-default-export */
import * as types from './mutation-types';

const testdata = require('../../testdata.json');

export function getScheduleData({ commit }) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(testdata), 20);
  }).then(data => commit(types.ADD_SCHEDULE_DATA, data));
}
