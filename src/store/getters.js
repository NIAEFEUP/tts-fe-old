/* eslint-disable no-underscore-dangle */
import get from 'lodash/get';
import omit from 'lodash/omit';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import flow from 'lodash/flow';
import translations from '../translations';

export function lang(state) {
  return translations[state.language];
}

function zeroPad(num) {
  const zero = 2 - String(num).length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

function formatTime(time) {
  return `${zeroPad(Math.floor(time))}:${zeroPad(time % 1 * 60)}`;
}

function fixedLesson(c) {
  if (!c) return c;
  return {
    day: c.dia,
    hour: c.hora,
    time: `${formatTime(c.hora)} - ${formatTime(c.hora + c.duracao / 2)}`,
    timeStart: formatTime(c.hora),
    duration: c.duracao,
    class: c.turma,
    cclass: c.turmac,
    type: c.tipo,
    name: c.sigla,
    room: c.sala,
    teacher: c.profsig,
  };
}

export function _selectedCourses(state) {
  if (!state.schedule.data || !state.enabledCourses) return null;
  const courses = [];
  let id = 1;
  Object.entries(state.enabledCourses).forEach(([programme, lYears]) => {
    Object.entries(lYears).forEach(([year, yearCourses]) => {
      Object.keys(yearCourses).filter(c => yearCourses[c]).forEach((courseCode) => {
        const path = [programme, year, courseCode].join('.');
        const course = get(state.schedule.data, path);
        if (course) {
          const practical = flatten(Object.values(omit(course, ['T', 'nome']))).map(fixedLesson).map(l => ({ ...l, id }));
          const lectures = uniqBy((course.T || []).map(fixedLesson), c => `${c.day}-${c.time}-${c.cclass}`); // current API has duplicate lessons
          const selectedPracticals = state.selectedPracticals[path]
            ? practical.filter(p => p.class === state.selectedPracticals[path])
            : null;
          courses.push({
            path,
            name: course.nome,
            code: courseCode,
            id,
            lectures: lectures.map(l => ({ ...l, id })),
            practical,
            classes: uniq(practical.map(c => c.class)),
            lectureEnabled: !state.disabledLectures[path],
            practicalEnabled: !state.disabledPracticals[path],
            selectedClass: state.selectedPracticals[path],
            selectedPracticals,
          });
          id += 1;
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
    if (course.lectures && course.lectureEnabled) {
      lessons.push(...course.lectures);
    }
    if (course.selectedPracticals && course.practicalEnabled) {
      lessons.push(...course.selectedPracticals);
    }
  });
  let lessonsByDayObj = groupBy(lessons, 'day');
  lessonsByDayObj = mapValues(lessonsByDayObj, (dayLessons) => {
    dayLessons.sort((a, b) => (a.hour > b.hour ? 1 : -1)).map(lesson => ({ ...lesson }));
    for (let i = 0; i < dayLessons.length; i++) {
      const curr = dayLessons[i];
      for (let j = i + 1; j < dayLessons.length; j++) {
        const next = dayLessons[j];
        if (next.hour < curr.hour + curr.duration / 2) {
          curr.conflicts = [...(curr.conflicts || []), next.name];
          next.conflicts = [...(next.conflicts || []), curr.name];
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
    _ => groupBy(_, l => `${l.id}-${l.type === 'T'}`),
    _ => mapValues(_, flow(arr => arr.map(l => l.conflicts), flatten, uniq)),
  ])(lessons);

  return getters._selectedCourses.map(course => ({
    ...course,
    lectureConflicts: conflicts[`${course.id}-true`] || null,
    practicalConflicts: conflicts[`${course.id}-false`] || null,
  }));
}

export function programmes(state) {
  return state.programmes;
}

export function years(state) {
  return state.years;
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
  if (!state.selectedProgramme || !state.schedule.data[state.selectedProgramme]) return null;
  return Object.entries(state.schedule.data[state.selectedProgramme])
    .reduce((obj, [year, courses]) =>
      ({
        ...obj,
        [year]: Object.keys(courses).map(course => (
          {
            name: course,
            enabled: !!get(state.enabledCourses, [state.selectedProgramme, year, course]),
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
