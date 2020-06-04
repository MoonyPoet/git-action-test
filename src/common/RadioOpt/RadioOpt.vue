<template lang='html'>
    <div>
         <el-radio-group v-model="radio" @change="radioChange">
            <el-radio v-for="(item) in data" :label="parseInt(item[id])" :key="parseInt(item[id])">{{item[val]}}</el-radio>
        </el-radio-group>
    </div>
</template>
<script>
import {isEmpty,type} from "assets/js/reused";
import * as R from 'ramda';
export default {
  name: "RadioOpt",
  props:{
    value:{
        type:[String,Number],
        default:""
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
        "data":{
             handler(newV,oldV){
               if(type(newV)==="array"&&!isEmpty(newV)){
                //    目前只针对一维数组
                   //数组里面统一为数字类型
                   let arr=newV.map((item)=>parseFloat(item[this["id"]]));
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
