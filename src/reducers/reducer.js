import * as actionTypes from "../actions/types";
import { getCoursePaths } from "./reducerHelper";

const initialSchedulingState = Object.freeze({
    schedule: {
        data: {},
        loading: false,
    },
    enabledCourses: {},
    disabledLectures: {},
    disabledPracticals: {},
    selectedPracticals: {},
});

const initialState = Object.freeze({
    language: "pt",
    coursesDialogVisible: false,
    selectedYear: null,
    selectedSchool: null,
    selectedSemester: null,
    selectedProgramme: null,
    schools: {
        loading: false,
        list: [],
    },
    years: {
        loading: false,
        list: [],
    },
    programmes: {
        loading: false,
        list: [],
    },
    ...initialSchedulingState,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_COURSES_DIALOG_VISIBILITY:
            return { ...state, coursesDialogVisible: action.payload };
        case actionTypes.SET_SCHEDULE_LOADING:
            return { ...state, schedule: { ...state.schedule, loading: action.payload } };
        case actionTypes.SET_PROGRAMMES_LOADING:
            return { ...state, programmes: { ...state.programmes, loading: action.payload } };
        case actionTypes.ADD_SCHEDULE_DATA:
            return  {
                ...state,
                schedule: {
                    ...state.schedule,
                    data: {
                        ...state.schedule.data,
                        ...action.payload,
                    },
                },
            };
        case actionTypes.SET_PROGRAMMES:
            return { ...state, programmes: { ...state.programmes, loading: false, list: action.payload } };
        case actionTypes.SET_SCHOOLS_LOADING:
            return { ...state, schools: { ...state.schools, loading: action.payload } };
        case actionTypes.SET_SCHOOLS:
            return { ...state, schools: { ...state.schools, loading: false, list: action.payload } };
        case actionTypes.SET_YEARS_LOADING:
            return { ...state, years: { ...state.years, loading: action.payload } };
        case actionTypes.SET_YEARS:
            return { ...state, years: { ...state.years, loading: false, list: action.payload } };
        case actionTypes.CHANGE_LECTURE_STATUS:
            return { ...state, disabledLectures: { ...state.disabledLectures, [action.payload.path]: !action.payload.enabled } };
        case actionTypes.CHANGE_PRACTICAL_STATUS:
            return { ...state, disabledPracticals: { ...state.disabledPracticals, [action.payload.path]: !action.payload.enabled } };
        case actionTypes.CHANGE_ALL_PRACTICAL_STATUS:
            if (action.payload) {
                return { ...state, disabledPracticals: {} };
            } else {
                const obj = getCoursePaths(state).reduce((acc, path) => ({ ...acc, [path]: true }), {});
                return { ...state, disabledPracticals: obj };
            }
        case actionTypes.CHANGE_ALL_LECTURE_STATUS:
            if (action.payload) {
                return { ...state, disabledLectures: {} };
            } else {
                const obj = getCoursePaths(state).reduce((acc, path) => ({ ...acc, [path]: true }), {});
                return { ...state, disabledLectures: obj };
            }
        case actionTypes.CHANGE_SELECTED_PRACTICAL:
        {
            const { path, selectedClass } = action.payload;
            const pathArray = path instanceof Array ? path.join(".") : path;
            return { ...state, selectedPracticals: { ...state.selectedPracticals, [pathArray]: selectedClass } };
        }
        case actionTypes.SET_SELECTED_PROGRAMME:
            return { ...state, selectedProgramme: action.payload };
        case actionTypes.SET_SELECTED_SCHOOL:
            return { ...state, selectedSchool: action.payload };
        case actionTypes.SET_SELECTED_YEAR:
            return { ...state, selectedYear: action.payload };
        case actionTypes.SET_SELECTED_SEMESTER:
            return { ...state, selectedSemester: action.payload };
        case actionTypes.CHANGE_COURSE_ENABLED:
        {
            const { path, enabled } = action.payload;
            const [programme, year, course] = path;
            if (!state.enabledCourses[programme]) {
                return {
                    ...state, enabledCourses: {
                        ...state.enabledCourses,
                        [programme]: {
                            [year]: {
                                [course]: enabled,
                            },
                        },
                    },
                };
            } else if (!state.enabledCourses[programme][year]) {
                return {
                    ...state,
                    enabledCourses: {
                        ...state.enabledCourses,
                        [programme]: {
                            ...state.enabledCourses[programme],
                            [year]: {
                                [course]: enabled,
                            },
                        },
                    },
                };
            } else {
                return {
                    ...state,
                    enabledCourses: {
                        ...state.enabledCourses,
                        [programme]: {
                            ...state.enabledCourses[programme],
                            [year]: {
                                ...state.enabledCourses[programme][year],
                                [course]: enabled,
                            },
                        },
                    },
                };
            }
        }
        case actionTypes.CHANGE_YEAR_COURSES_ENABLED:
        {
            const { programme, year, courses, enabled } = action.payload;
            const newState = { ...state };
            if (!state.enabledCourses[programme.fullAcronym]) {
                // Might cause issues, check this if problems arise
                newState.enabledCourses[programme.fullAcronym] = {};
            }
            if (enabled) {
                const obj = courses.reduce((o, course) => ({ ...o, [course]: true }), {});
                return {
                    ...newState,
                    enabledCourses: {
                        ...newState.enabledCourses,
                        [programme.fullAcronym]: {
                            ...newState.enabledCourses[programme.fullAcronym],
                            [year]: obj,
                        },
                    },
                };
            } else {
                return {
                    ...newState,
                    enabledCourses: {
                        ...newState.enabledCourses,
                        [programme.fullAcronym]: {
                            ...newState.enabledCourses[programme.fullAcronym],
                            [year]: {},
                        },
                    },
                };
            }
        }
        case actionTypes.RESET:
            // This is different from the Vue one - in the old Vue code only the initialSchedulingState was used
            // However, this did not make much sense, as the language and other settings were lost, for example.
            // Thus, opted instead for a 'hard reset' of everything to the initial state
            return initialState;
        default:
            return state;
    }
};
