<template>
  <div class="schedule-page" v-loading.lock="!coursesDialogVisible && scheduleLoading">
    <div class="wrapper" :class="{'dialog-open': coursesDialogVisible}">
      <div class="content">
        <sidebar></sidebar>
        <div class="main-content">
          <schedule></schedule>
        </div>
      </div>
    </div>
    <SelectionDialog></SelectionDialog>
  </div>
</template>

<script>
  import Schedule from '@/components/Schedule';
  import Sidebar from '@/components/Sidebar';
  import SelectionDialog from '@/components/SelectionDialog';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import * as mutationTypes from '@/store/mutation-types';

  export default {
    name: 'SchedulePage',
    components: {
      Sidebar,
      Schedule,
      SelectionDialog,
    },
    mounted() {
      if (window.location.hash) {
        this.parseUrl(window.location.hash.slice(1));
      } else {
        const today = new Date();
        const month = today.getMonth() + 1;
        let year = today.getFullYear();
        let semester = 1;
        if (month < 8) {
          year -= 1;
          semester = 2;
        }
        this.setSelectedYear(String(year));
        this.setSelectedSemester(semester);
        this.setCoursesDialogVisibility(true);
      }
      this.fetchYears();
      this.fetchSchools();
    },
    watch: {
      locationHash(value) {
        if (window.history && history.replaceState) {
          history.replaceState(null, null, value);
        } else {
          window.location.hash = value;
        }
      },
    },
    computed: {
      ...mapGetters({
        coursesDialogVisible: 'coursesDialogVisible',
        scheduleLoading: 'scheduleLoading',
        locationHash: 'locationHash',
      }),
    },
    methods: {
      ...mapMutations({
        setCoursesDialogVisibility: mutationTypes.SET_COURSES_DIALOG_VISIBILITY,
        setSelectedYear: mutationTypes.SET_SELECTED_YEAR,
        setSelectedSemester: mutationTypes.SET_SELECTED_SEMESTER,
      }),
      ...mapActions({
        fetchYears: 'fetchYears',
        fetchSchools: 'fetchSchools',
        fetchProgrammes: 'fetchProgrammes',
        parseUrl: 'parseUrl',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .schedule-page /deep/ .el-loading-mask {
    position: fixed;
  }
  .wrapper {
    width: 100%;
    &.dialog-open {
      position: fixed;
    }
  }
  .content {
    width: 100%;
    max-width: 1150px;
    margin: auto;
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    > * {
      display: flex;
      max-width: 840px;
    }
  }
  .sidebar {
    padding: 0;
    order: 0;
    flex: 1;
    flex-basis: 300px;
    flex-shrink: 0;
    margin: 0 auto 20px;

    /deep/ .sidebar__scrollbar__wrap {
      box-sizing: border-box;
      overflow: auto;
      max-height: 678px;
    }
  }
  .main-content {
    width: 100%;
    display: inline-block;
  }

  @media screen and (max-width: 1050px) {
    .content {
      display: block;
      position: relative;
    }
    .sidebar {
      padding: 0 10px;
      max-height: 500px;

      /deep/ .sidebar__scrollbar__wrap {
        box-sizing: border-box;
        overflow: initial;
        max-height: initial;
      }
    }

    @media (min-width: 600px) {
      .sidebar /deep/ {
        .lesson {
          width: 50%;
          display: inline-block;
        }
        .lesson:nth-last-child(2).lesson-even {
          border-bottom: none;
        }
      }
      .content /deep/ .schedule-md {
        margin-top: 20px;
      }
    }
  }
</style>
