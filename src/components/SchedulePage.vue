<template>
  <div class="schedule-page">
    <sidebar></sidebar>
    <div class="content">
      <schedule></schedule>
    </div>
  </div>
</template>

<script>
  import Schedule from '@/components/Schedule';
  import Sidebar from '@/components/Sidebar';

  export default {
    components: {
      Sidebar,
      Schedule,
    },
    name: 'schedule-page',
  };
</script>

<style scoped>
  .schedule-page {
    width: 100%;
    max-width: 1400px;
    margin: auto;
  }
  .content {
    max-width: 900px;
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }
</style>
