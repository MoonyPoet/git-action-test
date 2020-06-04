<template>
  <el-table ref="table" :data="data" :stripe="true" border @sort-change="sortChange" @selection-change="handleSelectionChange">
    <template v-for="colConfig in colConfigs">
      <!-- {{filter(colConfig)}} -->
      <slot v-if="colConfig.slot" :name="colConfig.slot" :config="colConfig"></slot>
      <el-table-column v-bind="colConfig"></el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  props: ['colConfigs', 'data'],
  methods:{
    sortChange(v){
      this.$emit("sortChange",v)
    },
    handleSelectionChange(v){
      this.$emit("selectionChange",v)
    },
    clearSelection(){
      this.$refs.table.clearSelection();
    }
  }
}
</script>