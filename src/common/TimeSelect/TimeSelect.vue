<template lang='html'>
    <el-time-select
        :placeholder="placeholder"
        v-model="time"
        @change="getTime"
        :clearable="clearable"
        :picker-options="{
            start: start,
            step: step,
            end: end,
            minTime:minTime
        }"
        >
  </el-time-select>
</template>
<script>
     export default {
        name: 'TimeSelect',
        props:{
            placeholder:{
                type:String,
                default:"起始时间"
            },
            start:{
                type:String,
                default:"00:00"
            },
            step:{
                type:String,
                default:"00:15"
            },
            end:{
                type:String,
                default:"22:30"
            },
            value:{
                type:String,
                default:""
            },
            minTime:{
                type:String,
                default:""
            },
            clearable:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {
                time:null
            }
        },
        watch:{
             value: {
                handler(newV, oldV) {
                    this.time = newV;
                },
                immediate: true,
                deep:true
            },
        },
        methods:{
            getTime(v){
                this.$emit("input",v);
                this.$emit("change",v);
            }
        }
    }
</script>