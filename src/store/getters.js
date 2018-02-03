/* eslint-disable no-underscore-dangle */
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import flow from 'lodash/flow';
import translations from '../translations';

export function lang(state) {
  return translations[state.language];
}

export function _selectedCourses(state) {
  if (!state.schedule.data || !state.enabledCourses) return null;
  const courses = [];
  Object.entries(state.enabledCourses).forEach(([programme, lYears]) => {
    Object.entries(lYears).forEach(([year, yearCourses]) => {
      Object.keys(yearCourses).filter(c => yearCourses[c]).forEach((courseCode) => {
        const path = [programme, year, courseCode].join('.');
        const course = get(state.schedule.data, path);
        if (course) {
          const selectedPracticals = state.selectedPracticals[path]
            ? course.practicals.filter(p => p.class_name === state.selectedPracticals[path])
            : null;
          const selectedLectures = state.selectedPracticals[path]
            ? course.lectures.filter(p => p.class_name === state.selectedPracticals[path])
            : null;
          courses.push({
            path,
            ...course,
            classes: uniq(course.practicals.map(c => c.class_name)),
            lectureEnabled: !state.disabledLectures[path],
            practicalEnabled: !state.disabledPracticals[path],
            selectedClass: state.selectedPracticals[path],
            selectedPracticals,
            selectedLectures,
          });
        }
      });
    });
  });
  return courses;
}

export function lessonsByDay(state, getters) {
  if (getters._selectedCourses === null) return null;
  const lessons = [];
  getters._selectedCourses.forEach((course) => {
    if (course.selectedLectures && course.lectureEnabled) {
      lessons.push(...course.selectedLectures);
    }
    if (course.selectedPracticals && course.practicalEnabled) {
      lessons.push(...course.selectedPracticals);
    }
  });
  let lessonsByDayObj = groupBy(lessons, 'day');
  lessonsByDayObj = mapValues(lessonsByDayObj, (dayLessons) => {
    // eslint-disable-next-line no-param-reassign
    dayLessons = dayLessons
      .map(lesson => ({ ...lesson }))
      .sort((a, b) => (a.start_time > b.start_time ? 1 : -1));
    for (let i = 0; i < dayLessons.length; i++) {
      const curr = dayLessons[i];
      for (let j = i + 1; j < dayLessons.length; j++) {
        const next = dayLessons[j];
        if (next.start_time < curr.start_time + curr.duration) {
          curr.conflicts = [...(curr.conflicts || []), next.course];
          next.conflicts = [...(next.conflicts || []), curr.course];
        } else {
          break;
        }
      }
    }
    return dayLessons;
  });
  return lessonsByDayObj;
}

export function selectedCourses(state, getters) {
  if (getters._selectedCourses === null) return null;
  const lessons = flatten(Object.values(getters.lessonsByDay)).filter(lesson => lesson.conflicts);
  const conflicts = flow([
    _ => groupBy(_, l => `${l.courseId}-${l.type === 'T'}`),
    _ => mapValues(_, flow(arr => arr.map(l => l.conflicts), flatten, uniq)),
  ])(lessons);

  return getters._selectedCourses.map(course => ({
    ...course,
    lectureConflicts: conflicts[`${course.id}-true`] || null,
    practicalConflicts: conflicts[`${course.id}-false`] || null,
  }));
}

export function programmes(state) {
  return {
    ...state.programmes,
    list: state.programmes.list && state.programmes.list
      .filter(course => String(course.faculty_id) === state.selectedSchool),
  };
}

export function years(state) {
  return state.years;
}

export function schools(state) {
  return state.schools;
}

export function selectedYear(state) {
  return state.selectedYear;
}

export function selectedSemester(state) {
  return state.selectedSemester;
}

export function selectedProgramme(state) {
  return state.selectedProgramme;
}

export function programmeInfo(state) {
  const programme = state.selectedProgramme && state.selectedProgramme.acronym;
  if (!programme || !state.schedule.data[programme]) return null;
  return Object.entries(state.schedule.data[programme])
    .reduce((obj, [year, courses]) =>
      ({
        ...obj,
        [year]: Object.values(courses).map(course => (
          {
            name: course.acronym,
            enabled: !!get(state.enabledCourses, [programme, year, course.acronym]),
          })),
      }),
    {});
}

export function scheduleLoading(state) {
  return state.schedule.loading;
}

export function coursesDialogVisible(state) {
  return state.coursesDialogVisible;
}

// eslint-disable-next-line no-unused-vars
export function locationHash(state, getters) {
  let string = `#${state.selectedYear}|${state.selectedSemester}`;
  const programmesCourses = {};
  if (!getters.selectedCourses || getters.selectedCourses.length === 0) return '#';
  getters.selectedCourses.forEach((course) => {
    // eslint-disable-next-line no-unused-vars
    const [programme, _, courseCode] = course.path.split('.');
    if (!programmesCourses[programme]) programmesCourses[programme] = [];
    const selectedClass = course.selectedClass || '';
    programmesCourses[programme].push(`~${courseCode}.${selectedClass}`);
  });
  Object.entries(programmesCourses).forEach(([programme, courses]) => {
    string += `|${programme}${courses.join('')}`;
  });
  return string;
}
