<template>
  <div class="column">
    <div class="box name" v-text="name"/>
    <div>
      <div v-for="_ in slots" class="box" :class="{'box-light': _ % 2 === 0}"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import Class from './Class';

  export default {
    name: 'Column',
    components: {
      Class,
    },
    props: {
      slots: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style scoped>
  .name {
    text-align: center;
    font-weight: bold;
    padding: 10px 0;
  }
  .column {
    border-left: 1px solid #eaeaea;
  }
  .column:last-of-type {
    border-right: 1px solid #eaeaea;
  }
  .box {
    width: 100%;
    height: 20px;
    text-align: center;
    border: solid #eaeaea;
    border-width: 1px 0;
  }
  .box-light {
    border-top-color: #f6f6f6;
  }
  .box:not(:last-of-type) {
    border-bottom: none;
  }
</style>
