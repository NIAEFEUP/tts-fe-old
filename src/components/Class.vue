<template>
  <div class="class" :style="{height: this.height, top: this.top}">
    <div class="time" v-text="time"/>
    <div class="name">ESOF</div>
    <div class="class-class">3MIEIC01</div>
    <div class="room">B001</div>
    <div class="teacher">RPR</div>
  </div>
</template>

<script>
  export default {
    name: 'Column',
    props: {
      height: {
        type: String,
        required: true,
      },
      top: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style scoped>
  .class {
    position: absolute;
    width: calc(100% + 2px);
    background: #a8a199;
    left: -1px;
    z-index: 1;
    color: #fafafa;
    padding: 5px;
    box-sizing: border-box;
  }
  .name, .class-class, .room, .teacher {
    font-size: 0.8em;
    box-sizing: border-box;
    display: inline-block;
    width: 45%;
    height: 33%;
    vertical-align: center;
  }
  .time {
    font-size: 0.9em;
    height: 33%;
  }
  .name {
    font-size: 1.1em;
  }
</style>
