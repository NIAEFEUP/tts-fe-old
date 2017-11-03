<template>
  <div class="class" :style="classStyle" :class="{ [`class-${type}`]: true, 'class-horizontal': horizontal }">
    <div class="class-info">
      <div class="line1">
        <div class="time" v-text="time"></div>
      </div>
      <div class="line2">
        <div class="name" v-text="name"></div>
        <div class="class-class" v-text="className"></div>
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
    name: 'Column',
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
    },
    computed: {
      classStyle() {
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
  .class {
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

    &.class-horizontal {
      width: 150px;
      height: 120px;
      position: relative;
      flex-shrink: 0;
      box-sizing: border-box;
      margin-left: 10px;
    }
  }
  .class-TP {
    background-color: #69656a;
  }
  .class-PL {
    background-color: #4f2e2e;
  }
  .class-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-basis: 100px;
    padding: 2px calc(30% - 30px);
  }
  .class-info > div {
    flex: 1;
    display: flex;
    align-items: center;

    > * {
      flex: 1;
      align-items: center;
    }
  }
  .time, .class-class, .room, .teacher {
    font-size: 13px;
  }
  .line2 > * {
    line-height: 20px;
  }
  .name {
    font-size: 20px;
  }
</style>
