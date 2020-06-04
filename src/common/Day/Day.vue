<template lang='html'>
    <div>
        <el-date-picker
        class="des"
        v-model="date"
        type="date"
        :editable="false"
        @change="changeDate"
        value-format="timestamp"
        :placeholder="placeholder"
        :picker-options="pickerOptions"
    >
    </el-date-picker>
    </div>
</template>
<script>
    import {isEmpty,type} from "assets/js/reused";
     export default {
        name: 'date',
        props:{
            value:{
                type:[String,Number],
                default:""
            },
            clearable:{
                type:Boolean,
                default:true
            },
            placeholder:{
                type:String,
                default:"选择日期"
            },
            pickerOptions:{
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },
        watch:{
            value: {
                handler(newV, oldV) {
                    console.log(newV)
                    if(isEmpty(newV)){
                        this.date="";
                    }else{
                        //小于11位的，都加3位
                        if(newV.toString().length<11){
                            this.date=parseFloat(newV)*1000;
                        }else{
                            this.date=parseFloat(newV)
                        }
                        if(type(this.date)!==type(newV))
                        {
                            this.$emit("input",this.date/1000)
                        }
                    }
                },
                immediate: true,
                deep:true
            },
        },
        data () {
            return{
                date:null
            }
        },
        methods:{
            changeDate(date){
                if(isEmpty(date)){
                    this.$emit("input","")
                }else{
                     this.$emit("input",date/1000)
                }
            },
        }
    }
</script>
<style scoped>
    .des{
        width: 300px !important;
    }
</style>