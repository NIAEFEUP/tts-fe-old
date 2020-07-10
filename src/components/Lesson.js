import React from "react";
import { string, bool } from "prop-types";
import cx from "classnames";

import "./Lesson.scss";

const getLessonStyle = (horizontal, height, top) => {
    if (!horizontal) {
        return {
            height,
            top,
        };
    }
    return {};
};

const Lesson = ({
    horizontal,
    height,
    top,
    conflicts,
    type,
    time,
    className,
    room,
    teacher,
    name,
}) => {
    const lessonStyle = getLessonStyle(horizontal, height, top);

    return (
        <div
            className={cx("lesson", `lesson-${type}`, {
                "lesson-horizontal": horizontal,
                "lesson-conflict": conflicts,
            })}
            style={lessonStyle}
        >
            <div className="lesson-info">
                <div className="line1">
                    <div className="time">{time}</div>
                </div>
                <div className="line2">
                    <div className="lesson-name">{name}</div>
                    <div className="lesson-class">{className}</div>
                </div>
                <div className="line3">
                    <div className="room">{room}</div>
                    <div className="teacher">{teacher}</div>
                </div>
            </div>
        </div>
    );
};

Lesson.propTypes = {
    name: string.isRequired,
    className: string.isRequired,
    room: string.isRequired,
    teacher: string.isRequired,
    type: string.isRequired,
    height: string,
    top: string,
    time: string.isRequired,
    horizontal: bool,
    conflicts: bool,
};

Lesson.defaultProps = {
    horizontal: false,
};

export default Lesson;
