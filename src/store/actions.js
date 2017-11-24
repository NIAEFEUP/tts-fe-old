import mapValues from 'lodash/mapValues';
import * as mutationTypes from './mutation-types';

const testdata = require('../../testdata.json');

export function getProgrammes({ commit }) {
  commit(mutationTypes.SET_PROGRAMMES_LOADING, true);
  return new Promise((resolve) => {
    const data = ['FEUP-MIEIC', 'FEUP-MIEEC'];
    setTimeout(() => resolve(data), 1000);
  }).then(data => commit(mutationTypes.SET_PROGRAMMES, data));
}

function fetchProgrammeData(programme) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(testdata[programme] || null), 2000);
  });
}

export function getScheduleData({ commit, state }, programme) {
  commit(mutationTypes.SET_SELECTED_PROGRAMME, programme);
  if (!programme || state.schedule.data[programme]) return Promise.resolve();
  commit(mutationTypes.SET_SCHEDULE_LOADING, true);
  return fetchProgrammeData(programme)
    .then(data => commit(mutationTypes.ADD_SCHEDULE_DATA, { [programme]: data }))
    .finally(() => commit(mutationTypes.SET_SCHEDULE_LOADING, false));
}

export function getMultipleScheduleData({ commit }, programmes) {
  if (programmes.length === 1) {
    commit(mutationTypes.SET_SELECTED_PROGRAMME, programmes[0]);
  }
  commit(mutationTypes.SET_SCHEDULE_LOADING, true);
  const promises = programmes
    .map(p => fetchProgrammeData(p)
      .then(data => commit(mutationTypes.ADD_SCHEDULE_DATA, { [p]: data })));
  return Promise.all(promises)
    .finally(() => commit(mutationTypes.SET_SCHEDULE_LOADING, false));
}

export async function parseUrl({ state, commit, dispatch }, url) {
  // eslint-disable-next-line no-unused-vars
  const [year, semester, ...programmesCourses] = url.split('|');
  const programmes = programmesCourses.map(programmeCourses => programmeCourses.split('~', 1)[0]);
  await dispatch('getMultipleScheduleData', programmes);

  programmesCourses.forEach((programmeCourses) => {
    const [programme, ...coursesClasses] = programmeCourses.split('~');
    const data = state.schedule.data[programme];
    const courseToYear = Object.entries(data)
      .reduce((acc, [y, coursesObj]) => ({ ...acc, ...mapValues(coursesObj, () => y) }), {});

    coursesClasses.forEach((courseClass) => {
      const [course, selectedClass] = courseClass.split('.');
      if (courseToYear[course]) {
        const path = [programme, courseToYear[course], course];
        commit(mutationTypes.CHANGE_COURSE_ENABLED, { path, enabled: true });
        commit(mutationTypes.CHANGE_SELECTED_PRACTICAL, { path, selectedClass });
      }
    });
  });
}
