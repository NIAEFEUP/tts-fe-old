<template>
  <div class="lesson" :style="lessonStyle" :class="{ [`lesson-${type}`]: true, 'lesson-horizontal': horizontal, 'lesson-conflict': conflicts }">
    <div class="lesson-info">
      <div class="line1">
        <div class="time" v-text="time"></div>
      </div>
      <div class="line2">
        <div class="name" v-text="name"></div>
        <div class="lesson-class" v-text="className"></div>
      </div>
      <div class="line3">
        <div class="room" v-text="room"></div>
        <div class="teacher" v-text="teacher"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Lesson',
    props: {
      name: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        required: true,
      },
      room: {
        type: String,
        required: true,
      },
      teacher: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      height: {
        type: String,
      },
      top: {
        type: String,
      },
      time: {
        type: String,
        required: true,
      },
      horizontal: {
        type: Boolean,
        default: false,
      },
      conflicts: {
        type: Boolean,
      },
    },
    computed: {
      lessonStyle() {
        if (!this.horizontal) {
          return {
            height: this.height,
            top: this.top,
          };
        }
        return {};
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables';

  .lesson {
    position: absolute;
    width: 100%;
    background: #a8a199;
    left: 0;
    z-index: 1;
    color: #fafafa;
    box-sizing: border-box;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    &.lesson-horizontal {
      width: 150px;
      height: 120px;
      position: relative;
      flex-shrink: 0;
      box-sizing: border-box;
      margin-left: 10px;
    }

    &:not(lesson-horizontal) {
      transition: opacity 0.1s ease-in-out;
      opacity: 0.8;
      &:hover {
        z-index: 2;
        opacity: 0.9;
      }
    }
  }
  .lesson-TP {
    background-color: #69656a;
  }
  .lesson-PL {
    background-color: #4f2e2e;
  }
  .lesson-conflict {
    border: 2px solid $primary-color;
  }
  .lesson-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100px;
    padding: 2px calc(30% - 30px);
  }
  .lesson-info > div {
    flex: 1;
    display: flex;
    align-items: center;

    > * {
      flex: 1;
      align-items: center;
    }
  }
  .time, .lesson-class, .room, .teacher {
    font-size: 10px;
    line-height: 10px;
  }
  .room {
    margin-right: 4px;
  }
  .name {
    line-height: 15px;
    font-size: 15px;
    font-weight: 500;
  }
</style>
