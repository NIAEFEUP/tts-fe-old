import React from "react";
import { useSelector } from "react-redux";

import Lesson from "./Lesson";
import Column from "./Column";
import { lessonsByDay as flessonsByDay } from "../vueStateGetters";

import "./Schedule.scss";

const Schedule = () => {
    // const boxHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("scheduleBoxHeight"), 10);
    const boxHeight = 22;
    const start = 8;
    const end = 24;
    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    const small = false; // TODO: what is this.$mq ??
    const slotsPerColumn = 2 * (end - start);
    const times = Array(end - start + 1).fill(0)
        .map((_, i) => start + i)
        .map((x) => (x < 10 ? `0${x}:00` : `${x}:00`));

    const {
        lessonsByDay,
    } = useSelector((state) => ({
        lessonsByDay: flessonsByDay(state),
    }));

    return (
        <>
            {!small ?
                <div className="schedule schedule-md">
                    <div className="times">
                        {times.map((time) => (
                            <div key={time}>
                                {time}
                            </div>
                        ))}
                    </div>
                    <div className="schedule-days">
                        {days.map((day, dayIdx) => (
                            <Column
                                key={day}
                                className="schedule-column"
                                slots={slotsPerColumn}
                                name={day}
                            >
                                {(lessonsByDay[dayIdx] || []).map((lesson) => (
                                    <Lesson
                                        key={lesson.id}
                                        name={lesson.course}
                                        className={lesson.composed_class_name || lesson.class_name}
                                        room={lesson.location}
                                        teacher={lesson.teacher_acronym}
                                        type={lesson.lesson_type}
                                        height={`${2 * lesson.duration * boxHeight}px`}
                                        top={`${(lesson.start_time - start) * 2 * boxHeight + 0.5}px`}
                                        time={lesson.time}
                                        conflicts={!!lesson.conflicts}
                                    />
                                ))}
                            </Column>
                        ))}
                    </div>
                </div>
                :
                <div />
            }
        </>
    );
};

export default Schedule;
