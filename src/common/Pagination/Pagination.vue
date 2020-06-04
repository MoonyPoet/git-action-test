<template>
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10,15,20]"
        layout="total,sizes,prev, pager, next, jumper"
         background
        :total="total">
        </el-pagination>
    </div>
</template>
<script>
export default {
  props:{
    pageNum:Number,
    size:Number
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
      if(this.size>10){
        this.pageSize=this.size;
      }
    },
    handleSizeChange(val) {
      this.$emit("currentPageSize",val)
    },
    handleCurrentChange(val) {
      this.$emit("currentPage",val)
    },
    reset(){
      this.currentPage=1;
    }
  },
  // created(){
  //    this.$emit("currentPage",this.currentPage3)
  // },
  watch:{
    pageNum(newV,oldV){
      this.total=newV;
    },
    size(newV,oldV){
      this.pageSize=newV;
    }
  },
  data() {
    return {
      total:0,
      currentPage:1,
      pageSize:10
    };
  },
};
</script>
<style lang="scss" scoped>
.block{
  margin-top: 15px;
}
</style>

