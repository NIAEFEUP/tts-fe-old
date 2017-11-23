<template>
  <div class="schedule-page">
    <div class="content">
      <sidebar></sidebar>
      <div class="main-content">
        <schedule></schedule>
      </div>
    </div>
    <SelectionDialog></SelectionDialog>
  </div>
</template>

<script>
  import Schedule from '@/components/Schedule';
  import Sidebar from '@/components/Sidebar';
  import SelectionDialog from '@/components/SelectionDialog';
  import { mapMutations, mapActions } from 'vuex';
  import * as mutationTypes from '@/store/mutation-types';

  export default {
    name: 'SchedulePage',
    components: {
      Sidebar,
      Schedule,
      SelectionDialog,
    },
    mounted() {
      this.setCoursesDialogVisibility(true);
      this.getProgrammes();
    },
    methods: {
      ...mapMutations({
        setCoursesDialogVisibility: mutationTypes.SET_COURSES_DIALOG_VISIBILITY,
      }),
      ...mapActions({
        getProgrammes: 'getProgrammes',
      }),
    },
  };
</script>

<style lang="scss" scoped>
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
  }
  .main-content {
    width: 100%;
    display: inline-block;
  }

  @media screen and (max-width: 1050px) {
    .content {
      display: block;
    }
    .sidebar {
      padding: 0 10px;
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
    }
  }
</style>
