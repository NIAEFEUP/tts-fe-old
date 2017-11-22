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
    max-width: 1150px;
    margin: auto;
    display: flex;
    flex-direction: row-reverse;
    > * {
      display: flex;
      max-width: 840px;
    }
  }
  .sidebar {
    padding: 0 5px;
    order: 0;
    flex: 1;
    flex-basis: 250px;
    flex-shrink: 0;
    margin: 0 auto 20px;
  }
  .main-content {
    margin: auto;
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }

  @media screen and (max-width: 1000px) {
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
