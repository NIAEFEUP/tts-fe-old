<template>
  <el-dialog
      v-bind="$attrs"
      width="auto"
      top="0"
      title="Tips">
    <span>This is a message</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="close">Cancel</el-button>
    <el-button type="primary" @click="close">Confirm</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ClassesDialog',
    methods: {
      close() {
        this.$emit('update:visible', false);
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
