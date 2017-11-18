/* eslint-disable import/prefer-default-export */
import * as types from './mutation-types';

const testdata = require('../../testdata.json');

export function getProgrammes({ commit }) {
  commit(types.SET_LOADING, true);
  return new Promise((resolve) => {
    const data = [
      'FEUP-MIEIC', 'FEUP-MIEEC',
    ];
    setTimeout(() => resolve(data), 20);
  }).then(data => commit(types.SET_PROGRAMMES, data));
}

export function getScheduleData({ commit }, programme) {
  commit(types.SET_SELECTED_PROGRAMME, programme);
  if (!programme) return Promise.resolve();
  commit(types.SET_LOADING, true);
  return new Promise((resolve) => {
    setTimeout(() => resolve(testdata[programme] || null), 2000);
  }).then(data => commit(types.ADD_SCHEDULE_DATA, { [programme]: data }));
}
