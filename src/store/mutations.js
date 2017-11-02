/* eslint-disable no-param-reassign */
import * as types from './mutation-types';

export default {
  [types.ADD_SCHEDULE_DATA](state, data) {
    state.loading = false;
    state.data = data;
  },
};
