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

function fixedClass(c) {
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
  if (!state.data || !state.enabledClasses) return null;
  const classes = [];
  Object.entries(state.enabledClasses).forEach(([programme, years]) => {
    Object.entries(years).forEach(([year, courses]) => {
      Object.keys(courses).filter(c => courses[c]).forEach((courseCode) => {
        const path = [programme, year, courseCode].join('.');
        const course = get(state.data, path);
        if (course) {
          const practical = flatten(Object.values(omit(course, ['T', 'nome']))).map(fixedClass);
          const selectedPractical = state.selectedPracticals[path]
            ? practical.find(p => p.class === state.selectedPracticals[path])
            : null;
          classes.push({
            path,
            name: course.nome,
            lectures: uniqBy(course.T.map(fixedClass), c => `${c.day}-${c.time}-${c.cclass}`), // current API has duplicate classes
            practical,
            lectureEnabled: !state.disabledLectures[path],
            practicalEnabled: !state.disabledPracticals[path],
            selectedPractical,
          });
        }
      });
    });
  });
  return classes;
}

export function loading(state) {
  return state.loading;
}
