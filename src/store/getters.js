import get from 'lodash/get';
import omit from 'lodash/omit';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';

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
    duration: c.duracao,
    class: c.turma,
    cclass: c.turmac,
    type: c.tipo,
    name: c.sigla,
    room: c.sala,
    teacher: c.profsig,
  };
}

export function selectedCourses(state) {
  if (!state.schedule.data || !state.enabledCourses) return null;
  const courses = [];
  Object.entries(state.enabledCourses).forEach(([programme, years]) => {
    Object.entries(years).forEach(([year, yearCourses]) => {
      Object.keys(yearCourses).filter(c => yearCourses[c]).forEach((courseCode) => {
        const path = [programme, year, courseCode].join('.');
        const course = get(state.schedule.data, path);
        if (course) {
          const practical = flatten(Object.values(omit(course, ['T', 'nome']))).map(fixedLesson);
          const selectedPractical = state.selectedPracticals[path]
            ? practical.find(p => p.class === state.selectedPracticals[path])
            : null;
          courses.push({
            path,
            name: course.nome,
            lectures: uniqBy((course.T || []).map(fixedLesson), c => `${c.day}-${c.time}-${c.cclass}`), // current API has duplicate lessons
            practical,
            lectureEnabled: !state.disabledLectures[path],
            practicalEnabled: !state.disabledPracticals[path],
            selectedPractical,
          });
        }
      });
    });
  });
  return courses;
}

export function programmes(state) {
  return state.programmes;
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
