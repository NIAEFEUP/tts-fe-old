<template>
  <div class="schedule-page">
    <div class="content">
      <sidebar></sidebar>
      <div class="main-content">
        <schedule></schedule>
      </div>
    </div>
    <SelectionDialog :visible.sync="dialogVisible"></SelectionDialog>
  </div>
</template>

<script>
  import Schedule from '@/components/Schedule';
  import Sidebar from '@/components/Sidebar';
  import SelectionDialog from '@/components/SelectionDialog';

  export default {
    name: 'SchedulePage',
    components: {
      Sidebar,
      Schedule,
      SelectionDialog,
    },
    data() {
      return {
        dialogVisible: true,
      };
    },
    mounted() {
      this.$store.dispatch('getProgrammes');
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
