<template>
  <div class="column" v-if="!horizontal">
    <div class="name" v-text="name"></div>
    <div class="lessons">
      <div>
        <div v-for="_ in slots" class="box" :class="{'box-light': _ % 2 === 0}"></div>
      </div>
      <slot></slot>
    </div>
  </div>
  <div class="row" v-else>
    <div v-text="name" class="name"></div>
    <div class="lessons">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Class from './Lesson';

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
      horizontal: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables';

  .lessons {
    position: relative;
  }

  .column {
    border-left: 0.95px solid #eaeaea;
    &:last-of-type {
      border-right: 1px solid #eaeaea;
    }

    .name {
      text-align: center;
      font-weight: bold;
      padding: 10px 0;
      height: 20px;
    }
    .box, .name {
      border: solid #eaeaea;
      border-width: 1px 0;
    }
    .box {
      width: 100%;
      height: $schedule-box-height;
      box-sizing: border-box;
      &:not(:last-of-type) {
        border-bottom: none;
      }
    }
    .box-light {
      border-top-color: #f6f6f6;
    }
  }

  .row {
    width: 100%;
    .name {
      font-weight: bold;
      padding: 15px 10px 5px;
      line-height: 20px;
    }
    .lessons {
      display: flex;
      flex-direction: row;
      overflow-y: hidden;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;

      &:after {
        display: block;
        flex-shrink: 0;
        content: '&nbsp;';
        width: 10px;
        overflow: hidden;
        opacity: 0;
        color: transparent;
      }
    }
  }
</style>
