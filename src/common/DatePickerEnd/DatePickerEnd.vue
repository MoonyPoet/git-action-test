<template lang='html'>
    <div> 
    <el-date-picker
      v-model="xEndDt"
      type="date"
      :placeholder="placeholder"
      :clearable="clearable"
      value-format="timestamp"
       :disabled="value[this.otherKeyName]?false:true"
      :picker-options="pickerOptions1"
      ref="datePicker"
      @change="clear"
      >
     
    </el-date-picker>
    </div>
   
</template>
<script>
import {clone,isEmpty,setDayTime} from "assets/js/reused";
     export default {
        name: 'DatePickerEnd',
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
                default:"结束日期"
            },
            width:{
                type:[String,Number],
                default:300
            },
            keyName:{
                type:String,
                default:""
            },
            disabledDateFn:{
                type:[null,undefined,Function],
                validator: function (t) {
                    // 这个值必须匹配下列字符串中的一个
                   console.log(t)
                },
                default:null
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
            let that=this;
            return {
               xEndDt:null,
               pickerOptions1:{
                   disabledDate(time){
                       if(that.disabledDateFn){
                           return that.disabledDateFn(time.getTime());
                       }else{
                           return time.getTime() <that.value[that.otherKeyName]*1000;
                       }
                    },
                },
            }
        },
        watch:{
            value:{
               handler(newV, oldV) {
                    if(newV[this.keyName]&&parseInt(newV[this.keyName])!==0){
                        this.xEndDt=this.value[this.keyName]*1000;
                    }else{
                        this.xEndDt=null;
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
                    this.$emit("input",obj);
                }else{
                    let obj=this.value;
                    obj[this.keyName]=setDayTime(new Date(v),2)/1000;
                    this.$emit("input",obj);
                }
                this.$nextTick(()=>{
                    this.$emit("change")
                })
            }
        }
    }
</script>