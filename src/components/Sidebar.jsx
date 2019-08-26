import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox } from "element-react/next";

import translations from "../translations";

import "./Sidebar.scss";

const Sidebar = ({}) => {
    const [courseDialogVisible, setCourseDialogVisible] = useState();
    const [lectureGlobalState, setLectureGlobalState] = useState();

    return (
        <div className="sidebar">
            <div className="buttons">
                <Button
                    size="mini"
                    icon="el-icon-edit"
                    onClick={() => setCourseDialogVisible(true)}
                >
                    {translations.en.EDIT_COURSES}
                </Button>
            </div>
            <div className="global-checkboxes">
                <Checkbox checked={lectureGlobalState} onChange={}
            </div>
        </div>
    );
};

Sidebar.propTypes = {

};

export default Sidebar;
