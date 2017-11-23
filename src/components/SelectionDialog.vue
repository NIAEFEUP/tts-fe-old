<template>
  <el-dialog
      :visible="coursesDialogVisible"
      :lock-scroll="false"
      width="100%"
      :before-close="beforeClose"
      top="0">
    <div>
      <div>
        Programme:&nbsp;
        <span class="select" :class="{ disabled: programmes.loading }">
          <select @change="programmeChanged" v-model="programme" :disabled="programmes.loading">
            <option v-for="programme in programmes.list" v-text="programme" :value="programme"></option>
          </select>
        </span><!--
     --><span class="spinner-wrapper">
          <span v-show="programmes.loading || scheduleLoading">
            <Spinner size="20px"></Spinner>
          </span>
        </span>
      </div>
      <transition name="collapse" @enter="beforeAnimation" @leave="beforeAnimation" @after-enter="afterEnter">
        <div class="years" v-if="chunkedInfo" :key="programme">
          <div class="year" v-for="(coursesChunk, year) in chunkedInfo">
            <div class="year-name">
              <el-checkbox :value="checkedPerYear[year]"
                           :indeterminate="checkedPerYear[year] == null"
                           @change="handleCheckAllChange(year, $event)">{{year}}</el-checkbox>
            </div>
            <div class="courses">
              <div v-for="courses in coursesChunk">
                <div v-for="course in courses">
                  <el-checkbox @input="updateCourseSelection(year, course.name, $event)"
                               :value="course.enabled">{{ course.name }}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close" :disabled="!canClose">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import chunk from 'lodash/chunk';
  import mapValues from 'lodash/mapValues';
  import * as mutationTypes from '@/store/mutation-types';
  import Spinner from './Spinner';

  export default {
    name: 'SelectionDialog',
    components: {
      Spinner,
    },
    data() {
      return {
        programme: null,
      };
    },
    computed: {
      ...mapGetters({
        programmes: 'programmes',
        selectedCourses: 'selectedCourses',
        programmeInfo: 'programmeInfo',
        scheduleLoading: 'scheduleLoading',
        coursesDialogVisible: 'coursesDialogVisible',
      }),
      chunkedInfo() {
        if (!this.programmeInfo) return null;
        return Object.entries(this.programmeInfo)
          .reduce((obj, [year, courses]) => ({
            ...obj,
            [year]: chunk(courses, 8),
          }), {});
      },
      checkedPerYear() {
        if (!this.programmeInfo) return null;
        return mapValues(this.programmeInfo, (courses) => {
          const enabled = courses.filter(c => c.enabled).length;
          if (enabled > 0 && enabled < courses.length) return null;
          return enabled === courses.length;
        });
      },
      canClose() {
        return this.selectedCourses && this.selectedCourses.length;
      },
    },
    methods: {
      ...mapActions({
        getScheduleData: 'getScheduleData',
      }),
      ...mapMutations({
        changeCourseEnabled: mutationTypes.CHANGE_COURSE_ENABLED,
        changeYearCoursesEnabled: mutationTypes.CHANGE_YEAR_COURSES_ENABLED,
        setCoursesDialogVisibility: mutationTypes.SET_COURSES_DIALOG_VISIBILITY,
      }),
      close() {
        this.setCoursesDialogVisibility(false);
      },
      beforeClose(done) {
        if (this.canClose) {
          done();
          this.close();
        }
      },
      updateCourseSelection(year, course, enabled) {
        const path = [this.programme, year, course];
        this.changeCourseEnabled({ path, enabled });
      },
      programmeChanged() {
        this.getScheduleData(this.programme);
      },
      handleCheckAllChange(year, enabled) {
        const programme = this.programme;
        const courses = this.programmeInfo[year].map(c => c.name);
        this.changeYearCoursesEnabled({ programme, year, courses, enabled });
      },
      beforeAnimation(el) {
        // eslint-disable-next-line no-param-reassign
        el.style.height = `${el.scrollHeight}px`;
      },
      afterEnter(el) {
        // eslint-disable-next-line no-param-reassign
        el.style.height = '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;

    /deep/ > .el-dialog {
      max-width: 900px;
      margin: auto !important;
      box-sizing: border-box;
    }

    &:after, &:before {
      content: '';
    }
    &:after {
      flex: 7;
    }
    &:before {
      flex: 3;
    }
  }

  .collapse-enter-active, .collapse-leave-active {
    transition: all 0.5s ease;
  }
  .collapse-enter, .collapse-leave-to {
    height: 0!important;
  }

  .years {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around; // For browsers that don't support space-evenly
    justify-content: space-evenly;
    overflow: hidden;
  }

  .year {
    margin: 0 25px;
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;

    &:before {
      display: block;
      content: '\00a0';
      height: 20px;
    }
  }

  .year-name {
    padding-bottom: 2px;
  }

  .spinner-wrapper {
    position: relative;
    height: 18px;
    width: 20px;
    vertical-align: text-top;
    display: inline-block;

    .spinner {
      position: absolute;
      left: 10px;
      top: -1px;
    }
  }

  .courses {
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 auto;
    vertical-align: top;
    justify-content: center;
    & > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 0 5px;
    }
  }

  /deep/ .el-checkbox {
    transform: translateZ(0);
  }

  .select {
    border: 1px solid #ccc;
    width: 120px;
    border-radius: 3px;
    overflow: hidden;
    background: #fafafa url("../assets/carret.svg") no-repeat 97% 50%;

    &.disabled {
      background-color: #ddd;
    }

    > select {
      color: #333;
      padding: 5px 20px 1px 2px;
      min-width: 120px;
      border: none;
      box-shadow: none;
      background: transparent none;
      appearance: none;
      outline: none;
      &:focus {
        outline: none;
        &::-ms-value {
          background: none;
          color: #333;
        }
      }
      &::-ms-expand {
        display: none;
      }
      &:focus {
        outline: none;
      }
    }
  }
</style>
