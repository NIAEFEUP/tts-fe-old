/* eslint-disable import/prefer-default-export,dot-notation */

function zeroPad(num) {
  const zero = 2 - String(num).length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

function formatTime(time) {
  return `${zeroPad(Math.floor(time))}:${zeroPad(time % 1 * 60)}`;
}

export function selectedClasses(state) {
  if (!state.data) return null;
  return [
    ...Object.values(state.data['4º Ano'])
      .reduce((arr, obj) => ([...arr, ...Object.values(obj)
        .filter(x => x instanceof Array)
        .reduce((arr2, obj2) => ([...arr2, ...Object.values(obj2)]), [])]), [])
      .filter(c => c.turma === '4MIEIC01')
      .map(c => ({
        day: c.dia,
        hour: c.hora,
        time: `${formatTime(c.hora)} - ${formatTime(c.hora + c.duracao / 2)}`,
        duration: c.duracao,
        class: c.turma,
        type: c.tipo,
        name: c.sigla,
        room: c.sala,
        teacher: c.profsig,
      })),
  ];
}

export function loading(state) {
  return state.loading;
}
