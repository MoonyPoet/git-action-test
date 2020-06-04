<template lang='html'>
    <div>
        <el-date-picker
      v-model="xStartDt"
      type="date"
      :placeholder="placeholder"
      :clearable="clearable"
      @change="clear"
      value-format="timestamp"
      ref="datePicker"
      >
    </el-date-picker>
    </div>
</template>
<script>
import {clone,isEmpty,setDayTime} from "assets/js/reused";
     export default {
        name: 'DatePickerStart',
        props:{
            value:{
                type:Object,
                default:function(){
                    return {
                        
                    }
                }
            },
            placeholder:{
                type:String,
                default:"开始日期"
            },
            width:{
                type:[String,Number],
                default:300
            },
            keyName:{
                type:String,
                default:""
            },
            otherKeyName:{
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
               xStartDt:null
            }
        },
        watch:{
            value:{
               handler(newV, oldV) {
                    if(newV[this.keyName]&&parseInt(newV[this.keyName])!==0){
                        this.xStartDt=this.value[this.keyName]*1000;
                    }else{
                        this.xStartDt=null;
                        let obj=this.value;
                        obj[this.keyName]=null;
                        this.$emit("input",obj)
                    }
                },
                immediate: true,
                deep:true
            }
        },
        mounted(){
            this.$refs.datePicker.$el.style.width = this.width+"px";
        },
        methods:{
            clear(v){
                if(isEmpty(v)){
                    let obj=this.value;
                    obj[this.keyName]=null;
                    obj[this.otherKeyName]=null;
                    this.$emit("input",obj)
                }else{
                    let obj=this.value;
                    obj[this.keyName]=setDayTime(new Date(v),1)/1000;
                    if(obj[this.keyName]>obj[this.otherKeyName]){
                        obj[this.otherKeyName]=null;
                    }
                    this.$emit("input",obj);
                }
                this.$nextTick(()=>{
                    this.$emit("change")
                })
               
            },
        }
    }
</script>