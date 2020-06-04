<template>
 <div>
  <TableBar ref="table" :data="tableData" :colConfigs="colConfigs" @sortChange="sortChange" @selectionChange="selectionChange">
    <!-- slot="opt" -->
    <!-- v-slot:opt="colConfig" -->
      <!-- <slot name="opt" slot="opt" ></slot> -->
      <template v-for="colConfig in colConfigs">
          <slot v-if="colConfig.slot" :name="colConfig.slot" :slot="colConfig.slot"></slot>
      </template>
  </TableBar>
  <Pagination
      ref="pagination"
      :pageNum="totalAll"
      :size="limit"
      v-on:currentPage="getCurrentPage"
      v-on:currentPageSize="getCurrentPageSize"
    ></Pagination>
 </div>
  
</template>

<script>
import Pagination from "common/Pagination";
import TableBar from "common/TableBar";
import {isEmpty} from "assets/js/reused";
export default {
  name:"TablePagination",
  components:{
    TableBar,
    Pagination
  },
  props:{
    colConfigs:{
      type:Array,
      required:true,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return {
      tableData: [],
      offset: 0,
      limit: 10,
      totalAll: 0,
    }
  },
  created(){
    this.$nextTick(()=>{
       this.getTableData()
    })
  },
  methods:{
    setTableData(data){
      this.tableData=data;
    },
    selectionChange(v){
      this.$emit("selectionChange",v)
    },
    clearSelection(){
      this.$refs.table.clearSelection();
    },
    getLimit(){
      return this.limit;
    },
    getOffset(){
      return this.offset;
    },
    setTotalAll(data){
      this.totalAll=data;
    },
    sortChange(v){
      this.$emit("sortChange",v)
    },
    getCurrentPage(v) {
      //切换页码时会触发
      this.offset = v == 1 ? 0 : (v - 1) * this.limit;
      this.getTableData()
    },
    getCurrentPageSize(v) {
      this.limit = v;
      this.getTableData()
    },
    getTableData(keyObj={}){
      let that=this;
      //一直往上找getTableData这个方法
      function getData(vm,obj){
        if(vm&&obj){
          if(vm.getTableData){
            vm.getTableData(keyObj)
          }else{
            getData(vm.$parent,obj.$parent)
          }
        }
      }
      getData(this.$parent,this)
      
    }
  }
}
</script>