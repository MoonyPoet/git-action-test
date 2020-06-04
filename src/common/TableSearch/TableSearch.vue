<template>
   <div>
      <div v-if="isHasSearch">
        <FilterOptions ref="filterBar" v-if="isOptions" @searchData="setNewSearchData">
          <slot name="add"></slot>
          <UploadExcel ref="uploadExcel" v-if="upLoadAuth" :downloadHref="downloadHref" :uploadExcelUrl="uploadExcelUrl" @openDailog="openDailog" @upload="upload" :uploadFormat="uploadFormat" @callback="uploadCall">
            <slot name="upload"></slot>
          </UploadExcel>
          <el-button round size="small" class="add" v-if="exportAuth" @click="downloadExcel">{{$t('student.export')}}</el-button>
          <slot name="other"></slot>
        </FilterOptions>
        <FilterBar ref="filterBar" v-else  @searchData="setNewSearchData">
            <slot name="add"></slot>
            <UploadExcel ref="uploadExcel" v-if="upLoadAuth" :downloadHref="downloadHref" :uploadExcelUrl="uploadExcelUrl" @openDailog="openDailog" @upload="upload" :uploadFormat="uploadFormat" @callback="uploadCall">
              <slot name="upload"></slot>
            </UploadExcel>
            <el-button round size="small" class="add" v-if="exportAuth" @click="downloadExcel">{{$t('student.export')}}</el-button>
            <slot name="other"></slot>
          </FilterBar>
        <slot name="searchBottom"></slot>
      </div>
      <TablePagination ref="table" :colConfigs="colConfigs" @sortChange="sortChange" @selectionChange="selectionChange">
        <template v-for="colConfig in colConfigs">
          <slot v-if="colConfig.slot" :name="colConfig.slot" :slot="colConfig.slot"></slot>
        </template>
        <!-- <slot name="opt" slot="opt"></slot> -->
    </TablePagination>
   </div>
</template>

<script>
import FilterBar from "common/FilterBar";
import Pagination from "common/Pagination";
import TablePagination from "common/TablePagination";
import UploadExcel from "common/UploadExcel";
import {dateFormat} from "assets/js/reused";
import FilterOptions from "common/FilterOptions";
function download(firstArr=[],arr=[]){
  //因和后端确认,后端处理时间戳，前端这里去掉
  this.$refs.uploadExcel.exportExcel([firstArr,...arr.map((item,index)=>{
    // let keys=Object.keys(item);
    // let result;
    // keys.map((item,index)=>{
    //   if(item.search(/Dt$/g)>0){
    //     result=index;
    //   }
    // })
    // if(result){
    //   item[keys[result]]=dateFormat("yyyy-MM-dd",new Date(parseInt(keys[result]) * 1000))
    // }
    return Object.values(item);
  })])
}
function download1(arr=[]){
  //因和后端确认,后端返回标题，前端拼接
  arr.data.unshift(arr.title);
  let keys=Object.keys(arr.title);
  let exportData=[];
  keys.map((element)=>{
    arr.data.map((item,index)=>{
      if(exportData[index]===undefined){
        exportData[index]=[];
      }
      exportData[index].push(item[element])
    })
  })
  this.$refs.uploadExcel.exportExcel(exportData)
}
function close(){
  this.$refs.uploadExcel.close()
}
export default {
  components:{
    TablePagination,
    Pagination,
    FilterBar,
    FilterOptions,
    UploadExcel
  },
  name:"TableSearch",
  props:{
    colConfigs:{
      type:Array,
      required:true,
      default:()=>{
        return [];
      }
    },
    upLoadAuth:{
      type:Boolean,
      default:false
    },
    exportAuth:{
      type:Boolean,
      default:false
    },
    uploadFormat:{
      type:Object,
      default:()=>{
        return {};
      }
    },
    downloadHref:{
      type:String,
      default:""
    },
    isHasSearch:{
      type:Boolean,
      default:true
    },
    isOptions:{
      type:Boolean,
      default:false
    },
    uploadExcelUrl:{
      type:String,
      default:""
    }
  },
  data(){
    return {
      searchData:[],
      count:0
    }
  },
  methods:{
    setSearchData(data){
      if(this.count===0){
        this.count++;
        if(this.isHasSearch){
          this.$refs.filterBar.setSearchData(data);
        }
      }
      // else if(module.hot){
      //   this.$refs.filterBar.setSearchData(data);
      // }
    },
    setNewSearchData(data){
      this.$refs.table.getTableData(data)
    },
    setTableData(data){
      this.$refs.table.setTableData(data);
    },
    setTotalAll(data){
      this.$refs.table.setTotalAll(data);
    },
    getLimit(){
      return this.$refs.table.getLimit();
    },
    getOffset(){
      return this.$refs.table.getOffset();
    },
    sortChange(v){
      this.$emit("sortChange",v)
    },
    selectionChange(v){
      this.$emit("selectionChange",v)
    },
    clearSelection(){
      //清除选项
      this.$refs.table.clearSelection();
    },
    downloadExcel(){
      this.$emit("downLoadExcel",download1.bind(this))
    },
    openDailog(v){
      this.$emit("openDailog",v)
    },
    upload(excelData){
      function uploadData(data){
        this.$refs.uploadExcel.uploadExcelData(data);
      }
      this.$emit("upload",excelData,uploadData.bind(this))
    },
    uploadCall(res){
      this.$emit("uploadCall",res,download.bind(this),close.bind(this))
    }
  }
}
</script>