<template>
  <div class="sidebar">
    <div class="buttons">
      <el-button size="mini" icon="el-icon-edit" @click="setCoursesDialogVisibility(true)">{{ $lang.EDIT_COURSES }}</el-button>
    </div>
    <div class="global-checkboxes">
      <el-checkbox :value="lectureGlobalState"
                   :indeterminate="lectureGlobalState === null"
                   @input="changeAllLectureStatus($event)">{{ $lang.LECTURES }}</el-checkbox>
      <el-checkbox :value="practicalGlobalState"
                     :indeterminate="practicalGlobalState === null"
                     @input="changeAllPracticalStatus($event)">{{ $lang.PRACTICALS }}</el-checkbox>
    </div>
    <ElScrollbar class="lessons-container"
                 wrap-class="sidebar__scrollbar__wrap"
                 view-class="sidebar__scrollbar__list">
      <div>
        <template v-for="(course, index) in selectedCourses">
          <div class="lesson" :class="{'lesson-even': index % 2 === 0}">
            <div class="class-name">{{ course.name }} ({{ course.acronym }})</div>
            <div class="select">
              <select :value="course.selectedClass" @change="updateSelectedPractical(course, $event)">
                <option></option>
                <option v-for="c in course.classes"
                        :value="c.className"
                        v-text="c.description"/>
              </select>
            </div>
            <el-checkbox v-if="course.lectures.length"
                         :value="course.lectureEnabled"
                         @input="updateLecture(course, $event)">{{ $lang.LECTURES }}</el-checkbox><!--
       --><el-checkbox v-if="course.practicals.length"
                       :value="course.practicalEnabled"
                       @input="updatePractical(course, $event)">{{ $lang.PRACTICALS }}</el-checkbox>
            <div class="conflicts-info" v-if="course.lectureConflicts">{{ $lang.LECTURE_CONFLICTS }}: {{ course.lectureConflicts.join(', ') }}</div>
            <div class="conflicts-info" v-if="course.practicalConflicts">{{ $lang.PRACTICAL_CONFLICTS }}: {{ course.practicalConflicts.join(', ') }}</div>
          </div>
        </template>
      </div>
    </ElScrollbar>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import * as mutationTypes from '../store/mutation-types';

  export default {
    name: 'Sidebar',
    computed: {
      ...mapGetters({
        selectedCourses: 'selectedCourses',
      }),
      lectureGlobalState() {
        const lessons = this.selectedCourses.filter(c => c.lectures.length);
        const enabled = lessons.filter(c => c.lectureEnabled).length;
        const total = lessons.length;
        return enabled > 0 && enabled < total ? null : enabled === total;
      },
      practicalGlobalState() {
        const lessons = this.selectedCourses.filter(c => c.practicals.length);
        const enabled = lessons.filter(c => c.practicalEnabled).length;
        const total = lessons.length;
        return enabled > 0 && enabled < total ? null : enabled === total;
      },
    },
    methods: {
      ...mapMutations({
        changeLectureStatus: mutationTypes.CHANGE_LECTURE_STATUS,
        changePracticalStatus: mutationTypes.CHANGE_PRACTICAL_STATUS,
        changeSelectedPractical: mutationTypes.CHANGE_SELECTED_PRACTICAL,
        setCoursesDialogVisibility: mutationTypes.SET_COURSES_DIALOG_VISIBILITY,
        changeAllPracticalStatus: mutationTypes.CHANGE_ALL_PRACTICAL_STATUS,
        changeAllLectureStatus: mutationTypes.CHANGE_ALL_LECTURE_STATUS,
      }),
      updateLecture(course, enabled) {
        this.changeLectureStatus({ path: course.path, enabled });
      },
      updatePractical(course, enabled) {
        this.changePracticalStatus({ path: course.path, enabled });
      },
      updateSelectedPractical(course, event) {
        const selected = event.target.value;
        this.changeSelectedPractical({ path: course.path, selectedClass: selected || null });
      },
    },
  };
</script>
