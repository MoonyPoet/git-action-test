<template lang='html'>
    <div>
        <el-checkbox v-if="isShowCheckAll" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" v-if="isShowCheckAll"></div>
         <el-checkbox-group v-model="checkedArr" @change="handleCheckedItemChange">
            <el-checkbox v-for="item in data" :label="parseInt(item[id])" :key="parseInt(item[id])">{{item[val]}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>
import {type,isEmpty} from "assets/js/reused";
import * as R from 'ramda';
export default {
  name: "CheckBox",
  props:{
    value:{
        type:Array,
        default:()=>{
            return []
        }
    },
    data:{
        type:Array,
         default:()=>{
            return []
        }
    },
    id:{
        type:String,
        default:"value"
    },
    val:{
        type:String,
        default:"display"
    },
    isShowCheckAll:{
        type:Boolean,
        default:false
    },
    isCheckAll:{
        type:Boolean,
        default:false
    }
 },
  data(){
      return {
          checkAll:false,
          checkedArr: [],
          isIndeterminate: false
      }
  },
  watch:{
        value:{
            handler(newV,oldV){
               if(!isEmpty(newV)&&type(newV)==="array"){
                   this.checkedArr=newV.map((item)=>parseFloat(item));
                   if(type(newV[0])!==type(this.checkedArr[0])){
                       this.$emit("input",this.checkedArr)
                   }
               }else{
                   this.checkedArr=[]
               }
            },
            immediate:true,
            deep:true
        },
        data:{
             handler(newV,oldV){
               if(type(newV)==="array"&&!isEmpty(newV)){
                   let arr=newV.map((item)=>parseFloat(item[this["id"]]));
                //    目前只针对一维数组
                   //数组里面统一为int类型
                   if(this.checkedArr.length>=arr.length){
                       if(this.checkedArr.length===arr.length){
                           if(R.difference(arr,this.checkedArr).length===0){
                            //全选样式设置sourceData[1,2,3,4] arr=[1,2,3,4] 取[1,2,3,4] 
                                this.isIndeterminate = false;
                                this.checkAll=true;
                           }
                       }else if(this.checkedArr.length>arr.length){
                           //交集处理
                          if(R.intersection(this.checkedArr,arr).length===arr.length){
                              //全选判断sourceData[1,2,3,4,5] arr=[1,2,3,4] 取[1,2,3,4] 
                             //全选样式设置,并且赋值为最新的数据
                                this.isIndeterminate = false;
                                this.checkAll=true;
                                this.checkedArr=arr;
                          }else if(R.intersection(this.checkedArr,arr)<arr.length){
                              //非全选判断sourceData[1,2,3,4,5] arr=[1,2,6,8] 取[1,2] 
                              //取交集
                              this.isIndeterminate=true;
                              this.checkAll=false;
                              this.checkedArr=R.intersection(this.checkedArr,arr);
                          }
                       }
                   }else if(this.checkedArr.length!==0&&this.checkedArr.length<arr.length){
                       //非全选判断
                       //如果有交集
                       if(R.intersection(this.checkedArr,arr).length>0){
                            this.isIndeterminate=true;
                            this.checkAll=false;
                           this.checkedArr=R.intersection(this.checkedArr,arr);
                       }else{
                           this.isIndeterminate=false;
                           this.checkAll=false;
                           this.checkedArr=[]
                       }
                   }else{
                       //全取消状态
                       this.isIndeterminate=false;
                       this.checkAll=false;
                       this.checkedArr=[];
                   }
               }
            },
            immediate:true,
            deep:true
        }
    },
  methods:{
    handleCheckAllChange(val) {
        let data=this.data.map((item)=>parseInt(item[this["id"]]));
        this.checkedArr = val ? data : [];
        this.isIndeterminate = false;
        this.$emit("input",this.checkedArr);
        this.$emit("checkAllChange",{
            checkAll:val,
            data:this.$data
        });
        this.$emit("change",this.checkedArr)
    },
    handleCheckedItemChange(value) {
        let checkedCount = value.length;
        this.checkAll = (checkedCount === this.data.length);
        this.isIndeterminate = (checkedCount > 0)&& (checkedCount <this.data.length);
        //更新checkbox
        this.$emit("input",value);
        this.$emit("checkItemChange",{
            value:value,
            data:this.$data
        })
        this.$emit("change",this.checkedArr)
    },
    itemCheckAll(){
        this.checkAll=true;
        this.handleCheckAllChange(this.checkAll);
    }
  }
};
</script>
<style lang="scss" scoped>
 .el-checkbox+.el-checkbox{
    margin: 0;
    margin-right: 50px;
}
.el-checkbox{
    margin-right: 50px;
}
</style>
