<template>
  <div class="sidebar">
    <template v-for="course in selectedCourses">
      <div class="class">
        <div class="class-name">{{ course.name }}</div>
        <select :value="course.selectedPractical && course.selectedPractical.class" @change="updateSelectedPractical(course, $event)">
          <option></option>
          <option v-for="practical in course.practical" :value="practical.class" v-text="practical.class"></option>
        </select>
        <el-checkbox :value="course.lectureEnabled" @input="updateLecture(course, $event)">Teóricas</el-checkbox><!--
     --><el-checkbox :value="course.practicalEnabled" @input="updatePractical(course, $event)">Práticas</el-checkbox>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import * as mutationTypes from '../store/mutation-types';

  export default {
    name: 'sidebar',
    computed: {
      ...mapGetters({
        selectedCourses: 'selectedCourses',
      }),
    },
    methods: {
      ...mapMutations({
        changeLectureStatus: mutationTypes.CHANGE_LECTURE_STATUS,
        changePracticalStatus: mutationTypes.CHANGE_PRACTICAL_STATUS,
        changeSelectedPractical: mutationTypes.CHANGE_SELECTED_PRACTICAL,
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
  .sidebar {
    width: 100%;
    float: right;
    display: inline-block;
    box-sizing: border-box;
    text-align: left;

    /deep/ .el-checkbox__label {
      color: #000000 !important;
      font-size: 15px;
    }

    /deep/ .el-checkbox__input {
      &:hover, &.is-checked, &.is-indeterminate, &.is-focus {
        .el-checkbox__inner {
          border-color: #313030 !important;
        }
      }
      outline-color: #313030 !important;
    }

    /deep/ .el-checkbox__input.is-checked, .el-checkbox__input.is-indeterminate {
      .el-checkbox__inner {
        background-color: #313030 !important;
      }
    }

    /deep/ .el-checkbox__inner::after {
      border-width: 2px;
    }

    /deep/ .el-checkbox__label {
      font-weight: 400;
    }
  }

  .class {
    padding: 10px 10px;
    color: #010101;
    font-size: 15px;

    &:not(:last-child) {
      border-bottom: 1px solid #bdbdbd;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }

    .el-checkbox:not(:last-child) {
      margin-right: 30px;
    }

    select {
      display: block;
      margin-bottom: 10px;
      width: 100%;
      max-width: 200px;
    }
  }

  .class-name {
    margin: 5px 0 10px;
  }
</style>
