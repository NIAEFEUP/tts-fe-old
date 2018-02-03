import mapValues from 'lodash/mapValues';
import keyBy from 'lodash/keyBy';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import Vue from 'vue';
import * as mutationTypes from './mutation-types';

export function fetchYears({ commit }) {
  commit(mutationTypes.SET_YEARS_LOADING, true);
  return Promise.resolve(['2017/2018'])
    .then(data => commit(mutationTypes.SET_YEARS, data));
}

export function fetchSchools({ commit }) {
  commit(mutationTypes.SET_SCHOOLS_LOADING, true);
  return Vue.axios.get('faculties')
    .then(({ data }) => commit(mutationTypes.SET_SCHOOLS, data));
}

export function fetchProgrammes({ commit }, schoolId) {
  commit(mutationTypes.SET_PROGRAMMES_LOADING, true);
  return Vue.axios.get(`faculties/${schoolId}/courses`)
    .then(({ data }) => commit(mutationTypes.SET_PROGRAMMES,
      data.sort((a, b) => a.name.localeCompare(b.name)))); // TODO - sort on the server
}

export function setSchool({ commit, dispatch }, schoolId) {
  commit(mutationTypes.SET_SELECTED_SCHOOL, schoolId);
  return dispatch('fetchProgrammes', schoolId);
}

function zeroPad(num) {
  const zero = 2 - String(num).length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

function formatTime(time) {
  return `${zeroPad(Math.floor(time))}:${zeroPad(time % 1 * 60)}`;
}

function fixedLesson(course, lesson) {
  if (!lesson) return lesson;
  return {
    ...lesson,
    course: course.acronym,
    courseId: course.id,
    day: lesson.day,
    duration: Number(lesson.duration),
    start_time: Number(lesson.start_time),
    time: `${formatTime(lesson.start_time)} - ${formatTime(Number(lesson.start_time) + Number(lesson.duration))}`,
    timeStart: formatTime(lesson.start_time),
  };
}

async function fetchProgrammeData(programme) {
  const { data: courses } = await Vue.axios.get(`/courses/${programme.id}/schedules`);

  courses.forEach((course) => {
    /* eslint-disable no-param-reassign */
    course.lectures = course.schedules.filter(l => l.lesson_type === 'T').map(fixedLesson.bind(0, course));
    course.practicals = course.schedules.filter(l => l.lesson_type !== 'T').map(fixedLesson.bind(0, course));
    course.classes = uniq(course.practicals.map(c => c.class_name))
      .map((className) => {
        const practicalClass = course.practicals
          .find(l => l.courseId === course.id && l.class_name === className);

        if (!practicalClass) return { className };

        return {
          className,
          day: practicalClass.day,
          timeStart: practicalClass.timeStart,
          teacherAcronym: practicalClass.teacher_acronym,
        };
      });
    delete course.schedules;
    /* eslint-enable no-param-reassign */
  });

  const coursesPerYear = groupBy(courses, 'course_year');
  return mapValues(coursesPerYear, coursesYear => keyBy(coursesYear, 'acronym'));
}

export function getScheduleData({ commit, state }, programme) {
  commit(mutationTypes.SET_SELECTED_PROGRAMME, programme);
  if (!programme || state.schedule.data[programme.acronym]
      || !state.selectedYear || !state.selectedSemester) {
    return Promise.resolve();
  }
  commit(mutationTypes.SET_SCHEDULE_LOADING, true);
  return fetchProgrammeData(programme)
    .then(data => commit(mutationTypes.ADD_SCHEDULE_DATA, { [programme.acronym]: data }))
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
  const [year, semester, ...programmesCourses] = url.split('|');

  commit(mutationTypes.SET_SELECTED_YEAR, year);
  commit(mutationTypes.SET_SELECTED_SEMESTER, Number(semester));

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
