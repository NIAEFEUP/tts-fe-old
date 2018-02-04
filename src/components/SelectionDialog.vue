<template>
  <el-dialog
      ref="dialog"
      :title="$lang.PICK_YOUR_COURSES"
      :visible="coursesDialogVisible"
      :lock-scroll="false"
      width="100%"
      :before-close="beforeClose"
      top="0">
    <div>
      <div class="year-semester">
        {{ $lang.YEAR }}:&nbsp;
        <span class="select select-year" :class="{ disabled: years.loading }">
          <select v-model="year" @input="yearChanged($event.target.value)" :disabled="years.loading">
            <option v-for="year in years.list" v-text="`${year}/${+year + 1}`" :value="year"></option>
          </select>
        </span><!--
     --><span class="spinner-wrapper">
          <span v-show="years.loading">
            <Spinner size="20px"></Spinner>
          </span>
        </span><!--
     -->{{ $lang.SEMESTER }}:&nbsp;
        <span class="select" :class="{ disabled: years.loading }">
          <select :value="semester" @input="semesterChanged($event.target.value)" :disabled="years.loading">
            <option v-text="1" :value="1"></option>
            <option v-text="2" :value="2"></option>
          </select>
        </span>
      </div>
      <div>
        Faculdade:&nbsp;
        <span class="select select-large" :class="{ disabled: schools.loading }">
          <select @change="schoolChanged" v-model="school" :disabled="schools.loading">
            <option v-for="school in schools.list" v-text="school.name" :value="school"></option>
          </select>
        </span><!--
     --><span class="spinner-wrapper">
          <span v-show="schools.loading">
            <Spinner size="20px"></Spinner>
          </span>
        </span>
      </div>
      <div>
        {{ $lang.PROGRAMME }}:&nbsp;
        <span class="select select-large" :class="{ disabled: programmes.loading || !school }">
          <select @change="programmeChanged" v-model="programme" :disabled="programmes.loading || !school">
            <option v-for="programme in programmes.list" :value="programme">{{ programme.name }}</option>
          </select>
        </span><!--
     --><span class="spinner-wrapper">
          <span v-show="programmes.loading || scheduleLoading">
            <Spinner size="20px"></Spinner>
          </span>
        </span>
      </div>
      <transition name="collapse" @enter="beforeAnimation" @leave="beforeAnimation" @after-enter="afterEnter">
        <div class="years" v-if="chunkedInfo" :key="programme && programme.id">
          <div class="year" v-for="(coursesChunk, year) in chunkedInfo">
            <div class="year-name">
              <el-checkbox :value="checkedPerYear[year]"
                           :indeterminate="checkedPerYear[year] == null"
                           @change="handleCheckAllChange(year, $event)">{{year}}º ano</el-checkbox>
            </div>
            <div class="courses">
              <div v-for="courses in coursesChunk">
                <div v-for="course in courses">
                  <el-checkbox @input="updateCourseSelection(year, course, $event)"
                               :value="course.enabled">{{ course.name }}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close" :disabled="!canClose">{{ $lang.CONFIRM }}</el-button>
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
        school: null,
      };
    },
    computed: {
      ...mapGetters({
        years: 'years',
        year: 'selectedYear',
        semester: 'selectedSemester',
        programmes: 'programmes',
        schools: 'schools',
        selectedCourses: 'selectedCourses',
        programmeInfo: 'programmeInfo',
        scheduleLoading: 'scheduleLoading',
        coursesDialogVisible: 'coursesDialogVisible',
        selectedProgramme: 'selectedProgramme',
        selectedSchool: 'selectedSchool',
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
        setSchool: 'setSchool',
      }),
      ...mapMutations({
        changeCourseEnabled: mutationTypes.CHANGE_COURSE_ENABLED,
        changeYearCoursesEnabled: mutationTypes.CHANGE_YEAR_COURSES_ENABLED,
        setSelectedYear: mutationTypes.SET_SELECTED_YEAR,
        setSelectedSemester: mutationTypes.SET_SELECTED_SEMESTER,
        setCoursesDialogVisibility: mutationTypes.SET_COURSES_DIALOG_VISIBILITY,
        resetScheduleState: mutationTypes.RESET,
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
        const path = [this.programme.acronym, year, course.name];
        this.changeCourseEnabled({ path, enabled });
      },
      schoolChanged() {
        this.setSchool(this.school);
        this.programme = null;
        this.programmeChanged();
      },
      programmeChanged() {
        this.getScheduleData(this.programme);
      },
      applyYearSemesterChange() {
        this.resetScheduleState();
        this.getScheduleData(this.programme);
      },
      yearChanged(year) {
        this.setSelectedYear(year);
        this.applyYearSemesterChange();
      },
      semesterChanged(semester) {
        this.setSelectedSemester(semester);
        this.applyYearSemesterChange();
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
    watch: {
      coursesDialogVisible(visible) {
        this.$refs.dialog.$el.scrollTop = 0;
        if (visible) {
          this.programme = this.selectedProgramme;
          this.school = this.selectedSchool;
        }
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

  .year-semester  {
    .select, .select select {
      width: 65px;
      min-width: 65px;
    }

    .select-year, .select-year select {
      width: 100px;
      min-width: 100px;
    }

    .spinner-wrapper {
      margin-right: 8px;
      .spinner {
        left: 6px;
      }
    }
  }

  .select-large {
    &, select {
      width: 500px;
      max-width: 100%;
    }
  }
</style>
