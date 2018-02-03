<template>
  <div class="sidebar">
    <div class="buttons">
      <el-button size="mini" icon="el-icon-edit" @click="setCoursesDialogVisibility(true)">{{ $lang.EDIT_COURSES }}</el-button>
    </div>
    <div class="global-checkboxes">
      <el-checkbox :value="lectureGlobalState"
                   :indeterminate="lectureGlobalState === null"
                   @input="changeAllLectureStatus($event)">{{ $lang.LECTURES }}</el-checkbox><!--
     --><el-checkbox :value="practicalGlobalState"
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
                <option v-for="c in course.practicals"
                        :value="c.class_name"
                        v-text="[c.class_name, c.teacher_acronym, `${$lang[`DAY_SHORT${c.day + 1}`]} ${c.timeStart}`].join(' - ')"/>
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

<style lang="scss" scoped>
  @import '../styles/variables';

  .sidebar {
    width: 100%;
    display: inline-block;
    box-sizing: border-box;
    text-align: left;
    transform: translateZ(0);
    border: 1px solid $border-color;
    padding-top: 8px;
  }

  .lessons-container {
    border-top: 1px solid $border-color;
  }

  .lesson {
    padding: 10px;
    color: #010101;
    font-size: 15px;
    box-sizing: border-box;

    &:not(:last-child) {
      border-bottom: 1px solid #bdbdbd;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }

    .el-checkbox:not(:last-child) {
      margin-right: 30px;
    }
  }

  .buttons, .global-checkboxes {
    padding: 0 10px;
  }
  .global-checkboxes {
    padding-top: 6px;
    padding-bottom: 8px;
  }

  .select {
    display: block;
    margin-bottom: 10px;
    width: 100%;
    max-width: 260px;
    border: 1px solid #ccc;
    height: 20px;
    border-radius: 3.5px;
    overflow: hidden;
    background: #8c2d19 url("../assets/select-arrows.svg") no-repeat 98% 4px;

    > select {
      color: #fff;
      padding: 0 6px;
      width: 100%;
      border: none;
      box-shadow: none;
      background: transparent none;
      appearance: none;
      outline: none;
      &:focus {
        outline: none;
        &::-ms-value {
          background: none;
        }
      }
      &::-ms-expand {
        display: none;
      }
      option {
        color: #000;
      }
    }
  }

  .class-name {
    margin: 5px 0 10px;
  }

  .conflicts-info {
    font-size: 12px;
    margin-top: 4px;
    color: $primary-color;
  }
</style>
