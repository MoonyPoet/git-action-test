<template lang='html'>
    <div>
         <el-radio-group v-model="radio" @change="radioChange">
            <el-radio v-for="(item,id) in bindOptions.data" :label="parseInt(item[bindOptions['key']])" :key="id">{{item[bindOptions['val']]}}</el-radio>
        </el-radio-group>
    </div>
</template>
<script>
import {isEmpty,type} from "assets/js/reused";
import * as R from 'ramda';
export default {
  name: "Radio",
  props:{
    value:{
        type:[String,Number],
        default:""
    },
    bindOptions:{
        type:Object,
        default:function(){
            return {
                data:[],
                key:"val",
                val:"display"
            }
        }
    }
 },
  data(){
      return {
          radio:null,
      }
  },
  watch:{
        value:{
            handler(newV,oldV){
               if(isEmpty(newV)){
                    //目前只针对一维数组
                    this.radio=""
               }else{
                   //数据类型不一致的时候触发
                   this.radio=parseFloat(newV);
                   if(type(newV)!=="number"){
                       this.$emit("input",this.radio)
                   }
               }
            },
            immediate:true,
            deep:true
        },
        "bindOptions.data":{
             handler(newV,oldV){
                console.warn("请停止使用Radio,改用RadioOpt")
               if(type(newV)==="array"&&!isEmpty(newV)){
                //    目前只针对一维数组
                   //数组里面统一为数字类型
                   let arr=newV.map((item)=>parseFloat(item[this.bindOptions["key"]]));
                   if(R.intersection([parseFloat(this.radio)],arr).length===1){
                       this.radio=parseFloat(this.radio);
                   }else{
                       this.radio="";
                   }
               }
            },
            immediate:true,
            deep:true
        }
    },
  methods:{
    radioChange(value){
        this.$emit("input",value);
        this.$nextTick(()=>{
            this.$emit("change",{
                value:value,
                data:this.$data
            })
        })
        
    }
  }
};
</script>
