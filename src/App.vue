<template>
  <v-app>
    <router-view />
  </v-app>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.layout.wrap {
  padding-bottom: 20px !important;
}
.container {
  padding: 0 !important;
}
.v-autocomplete__content.v-menu__content {
  border-radius: 20px !important;
}
.el-select-dropdown {
  font-family: 'Open Sans', sans-serif !important;
  .el-select-dropdown__item {
    font-size: 12px !important;
  }
}
</style>
