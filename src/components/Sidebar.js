import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox } from "element-react";
import cx from "classnames";

import translations from "../translations";
import {
    setCoursesDialogVisibility,
    changeAllLectureStatus,
    changeAllPracticalStatus,
    changeSelectedPractical,
    changeLectureStatus,
    changePracticalStatus,
} from "../actions/actions";
import {
    selectedCourses as fselectedCourses,
} from "../vueStateGetters";

import "./Sidebar.scss";

const flectureGlobalState = (state) => {
    const lessons = fselectedCourses(state).filter((c) => c.lectures.length);
    const enabled = lessons.filter((c) => c.lectureEnabled).length;
    const total = lessons.length;
    return enabled > 0 && enabled < total ? null : enabled === total;
};

const fpracticalGlobalState = (state) => {
    const lessons = fselectedCourses(state).filter((c) => c.practicals.length);
    const enabled = lessons.filter((c) => c.practicalEnabled).length;
    const total = lessons.length;
    return enabled > 0 && enabled < total ? null : enabled === total;
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const {
        language,
        lectureGlobalState,
        practicalGlobalState,
        selectedCourses,
    } = useSelector((state) => ({
        language: state.language,
        lectureGlobalState: flectureGlobalState(state),
        practicalGlobalState: fpracticalGlobalState(state),
        selectedCourses: fselectedCourses(state),
    }));

    return (
        <React.Fragment>
            <div className="sidebar">
                <div className="buttons">
                    <Button
                        size="mini"
                        icon="el-icon-edit"
                        onClick={() => dispatch(setCoursesDialogVisibility(true))}
                    >
                        {translations[language].EDIT_COURSES}
                    </Button>
                </div>
                <div className="global-checkboxes">
                    <Checkbox
                        checked={lectureGlobalState}
                        indeterminate={lectureGlobalState === null}
                        onChange={() => dispatch(changeAllLectureStatus())}
                    >
                        {translations[language].LECTURES}
                    </Checkbox>
                    <Checkbox
                        checked={practicalGlobalState}
                        indeterminate={practicalGlobalState === null}
                        onChange={() => dispatch(changeAllPracticalStatus())}
                    >
                        {translations[language].PRACTICALS}
                    </Checkbox>
                </div>
                <div className="lessons-container sidebar__scrollbar__wrap sidebar__scrollbar__list">
                    <div>
                        {selectedCourses.map((course, index) => (
                            <div
                                key={course.name + course.acronym}
                                className={cx("lesson", { "lesson-even": index % 2 === 0 })}
                            >
                                <div className="class-name">
                                    {`${course.name} (${course.acronym})`}
                                </div>
                                <div className="select">
                                    <select
                                        value={course.selectedClass}
                                        onChange={(e) => changeSelectedPractical({
                                            path: course.path,
                                            selectedClass: e.target.value || null,
                                        })}
                                    >
                                        {course.classes.map((c) => (
                                            <option key={c.className} value={c.className}>
                                                {c.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {course.lectures.length &&
                                <Checkbox
                                    value={course.lectureEnabled}
                                    onChange={(enabled) => changeLectureStatus({
                                        path: course.path, enabled,
                                    })}
                                >
                                    {translations[language].LECTURES}
                                </Checkbox>}
                                {course.practicals.length &&
                                <Checkbox
                                    value={course.praticalEnabled}
                                    onChange={(enabled) => changePracticalStatus({
                                        path: course.path, enabled,
                                    })}
                                >
                                    {translations[language].PRACTICALS}
                                </Checkbox>}
                                {course.lectureConflicts &&
                                <div className="conflicts-info">
                                    {`${translations[language].LECTURE_CONFLICTS}: ${course.lectureConflicts.join(", ")}`}
                                </div>}
                                {course.practicalConflicts &&
                                <div className="conflicts-info">
                                    {`${translations[language].PRACTICAL_CONFLICTS}: ${course.practicalConflicts.join(", ")}`}
                                </div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
