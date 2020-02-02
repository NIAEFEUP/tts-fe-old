import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import SelectionDialog from "./SelectionDialog";
import Sidebar from "./Sidebar";
import Schedule from "./Schedule";
import {
    parseUrl,
    setSelectedYear,
    setSelectedSemester,
    setCoursesDialogVisibility,
    fetchYears,
    fetchSchools,
} from "../actions/actions";
import {
    coursesDialogVisible as fcoursesDialogVisible,
    scheduleLoading as fscheduleLoading,
    locationHash as flocationHash,
} from "../vueStateGetters";

import "./SchedulePage.scss";
import { Loading } from "element-react";

const SchedulePage = () => {
    const dispatch = useDispatch();

    const {
        coursesDialogVisible,
        scheduleLoading,
        locationHash,
    } = useSelector((state) => ({
        coursesDialogVisible: fcoursesDialogVisible(state),
        scheduleLoading: fscheduleLoading(state),
        locationHash: flocationHash(state),
    }));

    // mounted
    useEffect(() => {
        if (window.location.hash) {
            dispatch(parseUrl(window.location.hash.slice(1)));
        } else {
            const today = new Date();
            const month = today.getMonth() + 1;
            let year = today.getFullYear();
            let semester = 1;
            if (month < 8) {
                year -= 1;
                semester = 2;
            }
            dispatch(setSelectedYear(String(year)));
            dispatch(setSelectedSemester(semester));
            dispatch(setCoursesDialogVisibility(true));
        }
        dispatch(fetchYears());
        dispatch(fetchSchools());
    }, [dispatch]);

    // watch locationHash
    useEffect(() => {
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, locationHash);
        } else {
            window.location.hash = locationHash;
        }
    }, [locationHash]);

    return (
        <Loading loading={!coursesDialogVisible && scheduleLoading}>
            <div className="schedule-page">
                <div
                    className={cx("wrapper", { "dialog-open": coursesDialogVisible })}
                >
                    <div className="content">
                        <Sidebar />
                        <div className="main-content">
                            <Schedule />
                        </div>
                    </div>
                </div>
                <SelectionDialog />
            </div>
        </Loading>
    );
};

export default SchedulePage;
