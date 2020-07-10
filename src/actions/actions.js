import { createAction } from "redux-actions";

import * as types from "./types";
import { fixedLesson } from "../lib/utils";
import { uniq, groupBy, mapValues, keyBy } from "lodash";


// Action creators (functions that return(/dispatch?) actions)

const setYearsLoading = createAction(types.SET_YEARS_LOADING);
const setYears = createAction(types.SET_YEARS);

export const fetchYears = () => async (dispatch) => {
    dispatch(setYearsLoading(true));

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

    const data = await Promise.resolve(years);
    dispatch(setYears(data));
    dispatch(setYearsLoading(false));
};

const setSchoolsLoading = createAction(types.SET_SCHOOLS_LOADING);
const setSchools = createAction(types.SET_SCHOOLS);

export const fetchSchools = () => async (dispatch) => {
    dispatch(setSchoolsLoading(true));

    const res = await fetch("/api/faculties");
    const data = await res.json();
    dispatch(setSchools(data));
    dispatch(setSchoolsLoading(false));
};

const setProgrammesLoading = createAction(types.SET_PROGRAMMES_LOADING);
const setProgrammes = createAction(types.SET_PROGRAMMES);

const fetchProgrammes = (school) => async (dispatch) => {
    dispatch(setProgrammesLoading(true));

    const res = await fetch(`/api/faculties/${school.id}/courses`);
    const data = await res.json();
    const programmes = data
        .sort((a, b) => a.name.localeCompare(b.name)) // TODO - sort on the server
        .map((programme) => ({
            ...programme,
            schoolAcronym: school.acronym.toUpperCase(),
            fullAcronym: `${school.acronym.toUpperCase()}-${programme.acronym}`,
        }));

    dispatch(setProgrammes(programmes));
    dispatch(setProgrammesLoading(false));
};

const setSelectedSchool = createAction(types.SET_SELECTED_SCHOOL);

export const setSchool = (school) => (dispatch) => {
    dispatch(setSelectedSchool(school));
    dispatch(fetchProgrammes(school));
};

const fetchProgrammeData = async (programme, year, semester) => {
    const res = await fetch(`/api/courses/${programme.id}/${year}/${semester}/schedules`);
    const data = await res.json();

    // TODO: What even is this?..
    const courses = data.map((course) => {
        const lectures = course.schedules.filter((l) => l.lesson_type === "T").map(fixedLesson.bind(0, course));
        const practicals = course.schedules.filter((l) => l.lesson_type !== "T").map(fixedLesson.bind(0, course));
        const classes = uniq(practicals.map((c) => c.class_name))
            .sort((a, b) => a.localeCompare(b))
            .map((className) => {
                const practicalClass = practicals.find((l) => l.courseId === course.id && l.class_name === className);

                if (!practicalClass) return { className };

                return {
                    className,
                    day: practicalClass.day,
                    timeStart: practicalClass.timeStart,
                    teacherAcronym: practicalClass.teacher_acronym,
                };
            });

        return {
            ...course,
            lectures,
            practicals,
            classes,
            schedules: undefined,
        };
    });

    const coursesPerYear = groupBy(courses, "course_year");
    return mapValues(coursesPerYear, (coursesYear) => keyBy(coursesYear, "acronym"));
};

const setSelectedProgramme = createAction(types.SET_SELECTED_PROGRAMME);
const setScheduleLoading = createAction(types.SET_SCHEDULE_LOADING);
const addScheduleData = createAction(types.ADD_SCHEDULE_DATA);

export const getScheduleData = (programme) => async (dispatch, getState) => {
    dispatch(setSelectedProgramme(programme));

    const state = getState();
    if (!programme || state.schedule.data[programme.fullAcronym] || !state.selectedYear || !state.selectedSemester) {
        return;
    }

    dispatch(setScheduleLoading(true));
    const data = await fetchProgrammeData(programme, state.selectedYear, state.selectedSemester);
    dispatch(addScheduleData({ [programme.fullAcronym]: data }));
    dispatch(setScheduleLoading(false));
};

export const getMultipleScheduleData = (programmes, year, semester) => async (dispatch, getState) => {
    await dispatch(fetchSchools());
    dispatch(setScheduleLoading(true));

    const promises = programmes.map(async (fullAcronym) => {
        const [schoolAcronym, programmeAcronym] = fullAcronym.toUpperCase().split("-");
        const school = getState().schools.list.find((s) => s.acronym.toUpperCase() === schoolAcronym);
        await dispatch(fetchProgrammes(school));
        const programme = getState().programmes.find((p) => p.acronym.toUpperCase() === programmeAcronym);

        const programmeData = await fetchProgrammeData(programme, year, semester);
        dispatch(addScheduleData({ [fullAcronym]: programmeData }));

        dispatch(setSelectedSchool(school));
        if (programmes.length === 1) {
            dispatch(setSelectedProgramme(programme));
        }
    });

    // To ensure everything finishes before coming out of loading
    await Promise.all(promises);
    dispatch(setScheduleLoading(false));
};

export const setSelectedYear = createAction(types.SET_SELECTED_YEAR);
export const setSelectedSemester = createAction(types.SET_SELECTED_SEMESTER);
export const changeCourseEnabled = createAction(types.CHANGE_COURSE_ENABLED);
export const changeSelectedPractical = createAction(types.CHANGE_SELECTED_PRACTICAL);

export const parseUrl = (url) => async (dispatch, getState) => {
    const [year, semester, ...programmesCourses] = url.split("!");

    dispatch(setSelectedYear(year));
    dispatch(setSelectedSemester(semester));

    const programmes = programmesCourses.map((programmeCourses) => programmeCourses.split("~", 1)[0]);
    await dispatch(getMultipleScheduleData(programmes, year, semester));

    programmesCourses.forEach((programmeCourses) => {
        const [programme, ...coursesClasses] = programmeCourses.split("~");
        const data = getState().schedule.data[programme];
        const courseToYear = Object.entries(data)
            .reduce((acc, [y, coursesObj]) => ({ ...acc, ...mapValues(coursesObj, () => y) }), {});

        coursesClasses.forEach((courseClass) => {
            const [course, selectedClass] = courseClass.split(".");
            if (courseToYear[course]) {
                const path = [programme, courseToYear[course], course];

                // commit(mutationTypes.CHANGE_COURSE_ENABLED, { path, enabled: true });
                dispatch(changeCourseEnabled({ path, enabled: true }));
                // commit(mutationTypes.CHANGE_SELECTED_PRACTICAL, { path, selectedClass });
                dispatch(changeSelectedPractical({ path, selectedClass }));
            }
        });
    });
};

export const setCoursesDialogVisibility = createAction(types.SET_COURSES_DIALOG_VISIBILITY);
export const changeLectureStatus = createAction(types.CHANGE_LECTURE_STATUS);
export const changePracticalStatus = createAction(types.CHANGE_PRACTICAL_STATUS);
export const changeAllPracticalStatus = createAction(types.CHANGE_ALL_PRACTICAL_STATUS);
export const changeYearCoursesEnabled = createAction(types.CHANGE_YEAR_COURSES_ENABLED);
export const changeAllLectureStatus = createAction(types.CHANGE_ALL_LECTURE_STATUS);
export const reset = createAction(types.RESET);
