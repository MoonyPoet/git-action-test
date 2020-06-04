<template lang='html'>
     <el-form-item ref="formItem" v-bind="$props">
        <slot></slot>
    </el-form-item>
</template>
<script>
import {isEmpty,type} from "assets/js/reused";
import * as R from 'ramda';
import {FormItem} from "element-ui";
export default {
  name: "FormItem",
  props:{
    ...FormItem.props,
    label:{
        type:String,
        default:""
    },
    isShowLabel:{
        type:Boolean,
        default:true
    },
    rules:{
        type:Array,
        default:function(){
            return []
        }
    },
    required:{
        type:Boolean,
        default:false
    },
    prop:{
        type:String,
        default:""
    },
    width:{
        type:Number,
        default:300
    },
 },
  data(){
      return {
         
      }
  },
  mounted(){
    if(this.isShowLabel===false){
        if(this.$refs.formItem.$el.firstChild.style){
            this.$refs.formItem.$el.firstChild.style.display="none";
        }
        if(this.$refs.formItem.$el.lastChild.style){
            this.$refs.formItem.$el.lastChild.style.marginLeft="0";
        }
       
    }
    if(this.width){
        if(this.$refs.formItem.$el.lastChild.style){
            this.$refs.formItem.$el.lastChild.style.width=this.width+'px';
        }
    }
  }
};
</script>
