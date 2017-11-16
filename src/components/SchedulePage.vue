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

<style lang="scss" scoped>
  .schedule-page {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;

    // Internet Explorer Hack
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
  .content {
    margin: auto;
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }
</style>
