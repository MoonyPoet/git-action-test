<template lang='html'>
    <div>
        <el-date-picker v-model="date" type="daterange" :unlink-panels="true" range-separator="-" :style="{width:'300px'}" :clearable="bindOptions.clearable"  @change="dateChange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
    </div>
</template>
<script>
// 使用方法
//  <DatePicker
//         v-model="date"
//         :startDt.sync="formData.startDt"
//         :endDt.sync="formData.endDt"
//         ></DatePicker>
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
            return{
                date:[this.value[0]*1000,this.value[1]*1000]
            }
        },
        methods:{
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