<template>
  <el-dialog
      v-bind="$attrs"
      width="auto"
      top="0">
    <div>
      <div>
        Programme:&nbsp;
        <span class="select">
          <select @change="programmeChanged" v-model="programme">
            <option v-for="programme in programmes" v-text="programme" :value="programme"></option>
          </select>
        </span>
      </div>
      <div class="years" v-show="programmeInfo">
        <div class="year" v-for="(coursesChunk, year) in chunkedInfo">
          <div class="year-name" v-text="year"></div>
          <div class="courses">
            <div v-for="courses in coursesChunk">
              <div v-for="course in courses">
                <el-checkbox :value="course.enabled" @input="updateCourseSelection(year, course.name, $event)">{{ course.name }}</el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">Cancel</el-button>
      <el-button type="primary" @click="close">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import chunk from 'lodash/chunk';
  import * as mutationTypes from '@/store/mutation-types';

  export default {
    name: 'SelectionDialog',
    data() {
      return {
        programme: null,
      };
    },
    computed: {
      ...mapGetters({
        programmes: 'programmes',
        programmeInfo: 'programmeInfo',
      }),
      chunkedInfo() {
        if (!this.programmeInfo) return null;
        return Object.entries(this.programmeInfo)
          .reduce((obj, [year, courses]) => ({
            ...obj,
            [year]: chunk(courses, 8),
          }), {});
      },
    },
    methods: {
      ...mapActions({
        getScheduleData: 'getScheduleData',
      }),
      ...mapMutations({
        changeCourseEnabled: mutationTypes.CHANGE_COURSE_ENABLED,
      }),
      close() {
        this.$emit('update:visible', false);
      },
      updateCourseSelection(year, course, enabled) {
        const path = [this.programme, year, course];
        this.changeCourseEnabled({ path, enabled });
      },
      programmeChanged() {
        this.getScheduleData(this.programme);
      },
    },
  };
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px 0;

    > .el-dialog {
      flex-basis: 900px;
      margin: 0 !important;
      max-height: 100%;
      overflow-y: auto;
    }
  }

  .years {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding-top: 20px;
  }

  .year {
    margin: 10px 25px;
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
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

  .select {
    border: 1px solid #ccc;
    width: 120px;
    border-radius: 3px;
    overflow: hidden;
    background: #fafafa url("../../static/img/carret.svg") no-repeat 97% 50%;

    > select {
      color: #333;
      padding: 5px 20px 1px 2px;
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

      &:focus {
        outline: none;
      }
    }
  }
</style>
