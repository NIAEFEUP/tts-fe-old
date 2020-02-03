import React, { useEffect, useState } from "react";
import { Dialog, Button, Checkbox } from "element-react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import { chunk, mapValues } from "lodash";

import Spinner from "./Spinner";
import {
    getScheduleData,
    setSchool as setSchoolAction,

    changeCourseEnabled,
    changeYearCoursesEnabled,
    setSelectedYear,
    setSelectedSemester,
    setCoursesDialogVisibility,
    reset,
} from "../actions/actions";
import {
    years as fyears,
    selectedYear as fselectedYear,
    selectedSemester as fselectedSemester,
    programmes as fprogrammes,
    schools as fschools,
    selectedCourses as fselectedCourses,
    programmeInfo as fprogrammeInfo,
    scheduleLoading as fscheduleLoading,
    coursesDialogVisible as fcoursesDialogVisible,
    selectedProgramme as fselectedProgramme,
    selectedSchool as fselectedSchool,

    lang,
} from "../vueStateGetters";

import "./SelectionDialog.scss";

const fchunkedInfo = (programmeInfo) => {
    if (!programmeInfo) return null;
    return Object.entries(programmeInfo)
        .reduce((obj, [year, courses]) => ({
            ...obj,
            [year]: chunk(courses, 8),
        }), {});
};

const fcheckedPerYear = (programmeInfo) => {
    if (!programmeInfo) return null;
    return mapValues(programmeInfo, (courses) => {
        const enabled = courses.filter((c) => c.enabled).length;
        if (enabled > 0 && enabled < courses.length) return null;
        return enabled === courses.length;
    });
};

const fcanClose = (selectedCourses) => selectedCourses && selectedCourses.length;

const programmeChanged = (programme) => (dispatch) => {
    dispatch(getScheduleData(programme));
};

const semesterChanged = (semester, programme) => (dispatch) =>  {
    dispatch(setSelectedSemester(semester));
    dispatch(applyYearSemesterChange(programme));
};

const yearChanged = (year, programme) => (dispatch) => {
    dispatch(setSelectedYear(year));
    dispatch(applyYearSemesterChange(programme));
};

const applyYearSemesterChange = (programme) => (dispatch) => {
    dispatch(reset());
    dispatch(getScheduleData(programme));
};

const SelectionDialog = () => {
    const dispatch = useDispatch();

    const {
        $lang,
        years,
        year,
        semester,
        programmes,
        schools,
        selectedCourses,
        programmeInfo,
        scheduleLoading,
        coursesDialogVisible,
        selectedProgramme,
        selectedSchool,
    } = useSelector((state) => ({
        $lang: lang(state),
        years: fyears(state),
        year: fselectedYear(state),
        semester: fselectedSemester(state),
        programmes: fprogrammes(state),
        schools: fschools(state),
        selectedCourses: fselectedCourses(state),
        programmeInfo: fprogrammeInfo(state),
        scheduleLoading: fscheduleLoading(state),
        coursesDialogVisible: fcoursesDialogVisible(state),
        selectedProgramme: fselectedProgramme(state),
        selectedSchool: fselectedSchool(state),
    }));

    const chunkedInfo = fchunkedInfo(programmeInfo);
    const checkedPerYear = fcheckedPerYear(programmeInfo);
    const canClose = fcanClose(selectedCourses);

    const [programme, setProgramme] = useState(selectedProgramme);

    // watch coursesDialogVisible
    // useEffect(() => {
    //     if (coursesDialogVisible) {
    //         setProgramme(selectedProgramme);
    //         setSchool(selectedSchool);
    //     }
    // }, [coursesDialogVisible, selectedProgramme, selectedSchool]);

    return (
        <Dialog
            // ref="dialog"
            title={$lang.PICK_YOUR_COURSES}
            visible={coursesDialogVisible}
            lockScroll={false}
            width="100%"
            top="0"
        >
            <div className="selections-container">
                <div className="year-semester">
                    {$lang.YEAR}:&nbsp;
                    <span
                        className={cx("select", "select-year",
                            { disabled: years.loading }
                        )}
                    >
                        <select
                            value={year}
                            onChange={(e) => {
                                dispatch(yearChanged(e.target.value, programme));
                            }}
                            disabled={years.loading}
                        >
                            {years.list.map((year) => (
                                <option key={year} value={year}>{`${year}/${+year + 1}`}</option>
                            ))}
                        </select>
                    </span>
                    <span className="spinner-wrapper">
                        {years.loading &&
                        <span>
                            <Spinner size="20px"/>
                        </span>}
                    </span>
                    <span className="semester-container">
                        {$lang.SEMESTER}:&nbsp;
                        <span className={cx("select", { disabled: years.loading })}>
                            <select
                                value={semester}
                                onChange={(e) => dispatch(semesterChanged(e.target.value, programme))}
                                disabled={years.loading}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div>
                    Faculdade:&nbsp;
                    <span style={{ whiteSpace: "nowrap" }}>
                        <span className={cx("select", "select-large", { disabled: schools.loading })}>
                            <select
                                value={(selectedSchool && selectedSchool.name)}
                                onChange={(e) => {
                                    dispatch(setSchoolAction(schools.list.find((school) => school.name === e.target.value)));
                                    setProgramme(null);
                                    dispatch(programmeChanged(programme));
                                }}
                                disabled={schools.loading}
                            >
                                {schools.list.map((school) => (
                                    <option key={school.name} value={school.name}>{school.name}</option>
                                ))}
                            </select>
                        </span>
                    </span>
                    <span className="spinner-wrapper">
                        {schools.loading &&
                        <span>
                            <Spinner size="20px"/>
                        </span>}
                    </span>
                </div>
                <div>
                    {$lang.PROGRAMME}:&nbsp;
                    <span style={{ whiteSpace: "nowrap" }}>
                        <span className={cx("select", "select-large", { disabled: programmes.loading || !selectedSchool })}>
                            <select
                                value={(programme && programme.name)}
                                onChange={(e) => {
                                    const pickedProgramme = programmes.list.find((programme) => programme.name === e.target.value);
                                    dispatch(programmeChanged(pickedProgramme));
                                    setProgramme(pickedProgramme);
                                }}
                                disabled={programmes.loading || !selectedSchool}
                            >
                                {programmes.list.map((programme) => (
                                    <option key={programme.name} value={programme.name}>
                                        {programme.name}
                                    </option>
                                ))}
                            </select>
                        </span>
                    </span>
                    <span className="spinner-wrapper">
                        {(programmes.loading || scheduleLoading) &&
                        <span>
                            <Spinner size="20px"/>
                        </span>}
                    </span>
                </div>
                <div className="transition-collapse-placeholder">
                    {chunkedInfo &&
                    <div className="years">
                        {Object.keys(chunkedInfo).map((year) => (
                            <div key={year} className="year">
                                <div className="year-name">
                                    <Checkbox
                                        checked={checkedPerYear[year]}
                                        indeterminate={checkedPerYear[year] === null}
                                        onChange={(enabled) => dispatch(changeYearCoursesEnabled({ programme, year, courses: programmeInfo[year].map((c) => c.name), enabled }))}
                                    >
                                        {year}º ano
                                    </Checkbox>
                                </div>
                                <div className="courses">
                                    {chunkedInfo[year].map((courses) => (
                                        <div key={courses}>
                                            {courses.map((course) => (
                                                <Checkbox
                                                    key={course.name}
                                                    checked={course.enabled}
                                                    onChange={(enabled) => dispatch(changeCourseEnabled({
                                                        path: [programme.fullAcronym, year, course.name], enabled,
                                                    }))}
                                                >
                                                    {course.name}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    ))}
                                    <div />
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
            <span slot="footer" className="dialog-footer">
                <Button
                    type="primary"
                    onClick={() => dispatch(setCoursesDialogVisibility(false))}
                    disabled={!canClose}
                >
                    {$lang.CONFIRM}
                </Button>
            </span>
        </Dialog>
    );
};

export default SelectionDialog;
