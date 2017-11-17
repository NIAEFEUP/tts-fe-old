<template>
  <el-dialog
      v-bind="$attrs"
      width="auto"
      top="0">
    <div>
      <div>
        Course:
        <select @change="courseChanged" v-model="course">
          <option v-for="course in courses" v-text="course" :value="course"></option>
        </select>
      </div>
      <div>

      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">Cancel</el-button>
      <el-button type="primary" @click="close">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'SelectionDialog',
    data() {
      return {
        course: null,
      };
    },
    computed: {
      ...mapGetters({
        courses: 'courses',
      }),
    },
    methods: {
      ...mapActions({
        getScheduleData: 'getScheduleData',
      }),
      close() {
        this.$emit('update:visible', false);
      },
      courseChanged() {
        this.getScheduleData(this.course);
      },
    },
  };
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;

    > .el-dialog {
      flex-basis: 300px;
    }
  }
</style>
