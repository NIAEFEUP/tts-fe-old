<template>
  <div class="sidebar">
    <template v-for="course in selectedCourses">
      <div class="lesson">
        <div class="class-name">{{ course.name }}</div>
        <div class="select">
          <select :value="course.selectedPractical && course.selectedPractical.class" @change="updateSelectedPractical(course, $event)">
            <option></option>
            <option v-for="practical in course.practical" :value="practical.class" v-text="practical.class"></option>
          </select>
        </div>
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
    name: 'Sidebar',
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
    display: inline-block;
    box-sizing: border-box;
    text-align: left;
    transform: translateZ(0);
  }

  .lesson {
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
  }

  .select {
    display: block;
    margin-bottom: 10px;
    width: 100%;
    max-width: 200px;
    border: 1px solid #ccc;
    height: 20px;
    border-radius: 3.5px;
    overflow: hidden;
    background: #8c2d19 url("../../static/img/select-arrows.svg") no-repeat 98% 4px;

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
</style>
