<template>
  <div class="schedule-page">
    <div class="content">
      <sidebar></sidebar>
      <div class="main-content">
        <schedule></schedule>
      </div>
    </div>
    <ClassesDialog :visible.sync="dialogVisible"></ClassesDialog>
  </div>
</template>

<script>
  import Schedule from '@/components/Schedule';
  import Sidebar from '@/components/Sidebar';
  import ClassesDialog from '@/components/ClassesDialog';

  export default {
    components: {
      Sidebar,
      Schedule,
      ClassesDialog,
    },
    name: 'SchedulePage',
    data() {
      return {
        dialogVisible: true,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;

    // Internet Explorer Fix
    @media screen and (max-width: 1220px) and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      display: block;
    }

    > * {
      display: flex;
      max-width: 900px;
    }
  }
  .sidebar {
    padding: 0 10px;
    order: 0;
    flex: 1;
    flex-basis: 280px;
    margin: 0 auto 20px;
  }
  .main-content {
    margin: auto;
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }
</style>
