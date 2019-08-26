export const zeroPad = (num) => {
    const zero = 2 - String(num).length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

export const formatTime = (time) => `${zeroPad(Math.floor(time))}:${zeroPad(time % 1 * 60)}`;

export const fixedLesson = (course, lesson) => {
    if (!lesson) return lesson;
    return {
        ...lesson,
        course: course.acronym,
        courseId: course.id,
        day: lesson.day,
        duration: Number(lesson.duration),
        // eslint-disable-next-line camelcase
        start_time: Number(lesson.start_time),
        time: `${formatTime(lesson.start_time)} - ${formatTime(Number(lesson.start_time) + Number(lesson.duration))}`,
        timeStart: formatTime(lesson.start_time),
    };
};

export const unique = (data) => data.filter((val, idx, arr) => arr.indexOf(val) === idx);

export const groupBy = (xs, key) => xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
}, {});

export const mapValues = (data) => Object.entries(data)
    .reduce((a, [key, { number }]) => {
        a[key] = number;
        return a;
    }, {});

// keyBy for array only
// Source: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_keyBy
export const keyBy = (array, key) => (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
