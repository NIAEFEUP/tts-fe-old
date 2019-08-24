import mapValues from 'lodash/mapValues';
import keyBy from 'lodash/keyBy';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import Vue from 'vue';
import * as mutationTypes from './mutation-types';

export function fetchYears({ commit }) {
  commit(mutationTypes.SET_YEARS_LOADING, true);
  const years = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  // If we are in the second semester, use the base year instead of the actual current year
  // For example, January of 2020 is 2020 but it is the second semester of 2019/2020
  // Thus, the actual year should be 2019
  const currentSchoolYear = today.getMonth() < 7 ? currentYear - 1 : currentYear;
  for (let year = 2017; year <= currentSchoolYear; ++year) {
    years.push(year);
  }
  return Promise.resolve(years)
    .then(data => commit(mutationTypes.SET_YEARS, data));
}

export function fetchSchools({ commit }) {
  commit(mutationTypes.SET_SCHOOLS_LOADING, true);
  return Vue.axios.get('faculties')
    .then(({ data }) => commit(mutationTypes.SET_SCHOOLS, data));
}

export function fetchProgrammes({ commit }, school) {
  commit(mutationTypes.SET_PROGRAMMES_LOADING, true);
  return Vue.axios.get(`faculties/${school.id}/courses`)
    .then(({ data }) => {
      const programmes = data
        .sort((a, b) => a.name.localeCompare(b.name)) // TODO - sort on the server
        .map(programme => ({
          ...programme,
          schoolAcronym: school.acronym.toUpperCase(),
          fullAcronym: `${school.acronym.toUpperCase()}-${programme.acronym}`,
        }));
      commit(mutationTypes.SET_PROGRAMMES, programmes);
      return programmes;
    });
}

export function setSchool({ commit, dispatch }, school) {
  commit(mutationTypes.SET_SELECTED_SCHOOL, school);
  return dispatch('fetchProgrammes', school);
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

async function fetchProgrammeData(programme, year, semester) {
  const { data: courses } = await Vue.axios.get(`/courses/${programme.id}/${year}/${semester}/schedules`);

  courses.forEach((course) => {
    /* eslint-disable no-param-reassign */
    course.lectures = course.schedules.filter(l => l.lesson_type === 'T').map(fixedLesson.bind(0, course));
    course.practicals = course.schedules.filter(l => l.lesson_type !== 'T').map(fixedLesson.bind(0, course));
    course.classes = uniq(course.practicals.map(c => c.class_name))
      .sort((a, b) => a.localeCompare(b))
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

export function getScheduleData({ commit, state, getters }, programme) {
  commit(mutationTypes.SET_SELECTED_PROGRAMME, programme);
  if (!programme || state.schedule.data[programme.fullAcronym]
      || !state.selectedYear || !state.selectedSemester) {
    return Promise.resolve();
  }
  commit(mutationTypes.SET_SCHEDULE_LOADING, true);
  return fetchProgrammeData(programme, getters.selectedYear, getters.selectedSemester)
    .then(data => commit(mutationTypes.ADD_SCHEDULE_DATA, { [programme.fullAcronym]: data }))
    .finally(() => commit(mutationTypes.SET_SCHEDULE_LOADING, false));
}

// eslint-disable-next-line max-len
export async function getMultipleScheduleData({ commit, dispatch, getters }, { programmes, year, semester }) {
  await dispatch('fetchSchools');
  commit(mutationTypes.SET_SCHEDULE_LOADING, true);
  const promises = programmes
    .map(async (fullAcronym) => {
      const [schoolAcronym, programmeAcronym] = fullAcronym.toUpperCase().split('-');
      const school = getters.schools.list.find(s => s.acronym.toUpperCase() === schoolAcronym);
      const schoolProgrammes = await dispatch('fetchProgrammes', school);
      const programme = schoolProgrammes.find(p => p.acronym.toUpperCase() === programmeAcronym);
      const programmeData = await fetchProgrammeData(programme, year, semester);
      commit(mutationTypes.ADD_SCHEDULE_DATA, { [fullAcronym]: programmeData });

      commit(mutationTypes.SET_SELECTED_SCHOOL, school);
      if (programmes.length === 1) {
        commit(mutationTypes.SET_SELECTED_PROGRAMME, programme);
      }
    });
  return Promise.all(promises)
    .finally(() => commit(mutationTypes.SET_SCHEDULE_LOADING, false));
}

export async function parseUrl({ state, commit, dispatch }, url) {
  const [year, semester, ...programmesCourses] = url.split('!');

  commit(mutationTypes.SET_SELECTED_YEAR, Number(year));
  commit(mutationTypes.SET_SELECTED_SEMESTER, Number(semester));

  const programmes = programmesCourses.map(programmeCourses => programmeCourses.split('~', 1)[0]);
  await dispatch('getMultipleScheduleData', { programmes, year, semester });

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
