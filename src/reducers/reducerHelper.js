export const getCoursePaths = (state) => {
    const paths = [];
    Object.entries(state.enabledCourses).forEach(([programme, years]) => {
        Object.entries(years).forEach(([year, courses]) => {
            Object.keys(courses).forEach((course) => {
                paths.push([programme, year, course].join("."));
            });
        });
    });
    return paths;
};
