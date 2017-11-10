<template>
  <div class="sidebar">
    <template v-for="_ in 5">
      <div class="class">
        <div class="class-name">Engenharia de Software</div>
        <el-checkbox :checked="true">Teóricas</el-checkbox>
        <el-checkbox :checked="true">Práticas</el-checkbox>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
  };
</script>

<style lang="scss" scoped>
  .sidebar {
    width: 100%;
    float: right;
    display: inline-block;
    box-sizing: border-box;
    text-align: left;

    /deep/ .el-checkbox__label {
      color: #000000 !important;
      font-size: 15px;
    }

    /deep/ .el-checkbox__input {
      &:hover, &.is-checked, &.is-indeterminate, &.is-focus {
        .el-checkbox__inner {
          border-color: #313030 !important;
        }
      }
      outline-color: #313030 !important;
    }

    /deep/ .el-checkbox__input.is-checked, .el-checkbox__input.is-indeterminate {
      .el-checkbox__inner {
        background-color: #313030 !important;
      }
    }

    /deep/ .el-checkbox__inner::after {
      border-width: 2px;
    }

    /deep/ .el-checkbox__label {
      font-weight: 400;
    }
  }

  .class {
    padding: 10px 10px;
    color: #010101;
    font-size: 15px;

    &:not(:last-child) {
      border-bottom: 1px solid #bdbdbd;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }

    .el-checkbox:not(:last-child) {
      margin-right: 30px;
    }
  }

  .class-name {
    margin: 5px 0 10px;
  }
</style>
