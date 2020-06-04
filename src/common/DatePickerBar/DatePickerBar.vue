<template lang='html'>
    <div>
       <el-date-picker
      v-model="xStartDt"
      type="date"
      placeholder="开始日期"
      @change="clear"
      value-format="timestamp"
      >
    </el-date-picker>
    &nbsp;&nbsp;
    <el-date-picker
      v-model="xEndDt"
      type="date"
      placeholder="结束日期"
      :disabled="xStartDt?false:true"
      :picker-options="pickerOptions1"
      value-format="timestamp"
      >
    </el-date-picker>
    </div>
</template>
<script>
import {clone,isEmpty} from "assets/js/reused";
     export default {
        name: 'DatePicker',
        props:{
            value:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            startDt:{
                type:[String,Number],
                default:""
            },
            endDt:{
                type:[String,Number],
                default:""
            },
            bindOptions:{
                type:Object,
                default:function(){
                    return {
                       clearable:true
                    }
                }
            }
        },
        data () {
            let that=this;
            return{
                pickerOptions1:{
                   disabledDate(time){
                        return time.getTime() < that.xStartDt;
                    }
                },
                xStartDt:this.startDt,
                xEndDt:this.endDt
            }
        },
        methods:{
            clear(v){
                this.xEndDt="";
            },
            dateChange(){
                let date=clone(this.date);
                if(!isEmpty(date)&&date.length>0){
                    this.$emit("input",[date[0]/1000,date[1]/1000]);
                    this.$emit("update:startDt",date[0]/1000);
                    this.$emit("update:endDt",date[0]/1000)
                }else{
                    this.$emit("input",["",""]);
                    this.$emit("update:startDt","");
                    this.$emit("update:endDt","");
                }
            },
        }
    }
</script>