<template lang='html'>
<!-- <el-select v-model="selectValue" @change="change" class="des" :placeholder="bindOptions.placeholder">
            <el-option 
                v-for="item in bindOptions.data"
                :key="item[bindOptions.key]"
                :label="item[bindOptions.val]"
                :value="item[bindOptions.key]">
            </el-option>
        </el-select> -->
   <!-- 选项数据只剩一项并且为必填时才默认,否则不默认 -->
   <span v-if="bindOptions.data&&bindOptions.data.length===1&&required===true">
       {{bindOptions.data&&bindOptions.data[0]&&bindOptions.data[0][bindOptions.val]}}
   </span>
   <!-- 选项数据一项都没有提示文字信息-->
   <span v-else-if="bindOptions.data&&bindOptions.data.length===0">
       {{$t('components.msg1')}}
   </span>
   <span v-else>
       <el-select v-model="selectValue" :size="size" @change="change" :style="{width:width+'px'}" class="des" :placeholder="bindOptions.placeholder">
            <el-option 
                v-for="item in bindOptions.data"
                :key="item[bindOptions.key]"
                :label="item[bindOptions.val]"
                :value="item[bindOptions.key]">
            </el-option>
        </el-select>
   </span>
   
    
</template>
<script>
    import {selectEditDefaultData,isEmpty,selectDefaultData,type,debounce,setCookie,getCookie} from "assets/js/reused";
    import * as R from 'ramda';
    let curValue=null;
     export default {
        name: 'SelectBar',
        props:{
            value:{
                type:[Number,String],
                default:null
            },
            width:{
                type:Number,
                default:300
            },
            size:{
                type:String,
                default:"medium"
            },
            bindOptions:{
                type:Object,//{key:"id",val:""} key 为id val为对应的名称
                required:true,
                default:()=>{
                    return {
                        data:[],
                        placeholder:"请选择",
                        key:"val",
                        val:"display"
                    }
                }
            },
            //因为有的选项不是必填项，当有的选项只有一项时会被默认选中，required为false可以去掉默认选中
            required:{
                type:Boolean,
                default:true
            }
        },
        watch:{
            value: {
                handler(newV, oldV) {
                    if(isEmpty(newV)){
                        this.selectValue="";
                    }else{
                        if(type(newV)!=="number"){
                            this.selectValue=parseFloat(newV);
                            this.$emit("input",parseFloat(newV));
                        }else{
                            this.selectValue=newV;
                        }
                        if(!isEmpty(newV)&&!isEmpty(this.bindOptions.data)){
                            let selectNewData=this.bindOptions.data;
                            this.handleData(selectNewData)
                            let result=selectEditDefaultData(selectNewData,this.bindOptions['key'],parseFloat(newV));
                            if(isEmpty(result)){
                                this.selectValue="";
                            }else{
                                this.selectValue=result;   
                                //编辑时默认触发
                               if(curValue!==this.selectValue){
                                this.change(this.selectValue)
                               }
                            }
                        }
                    }
                },
                immediate: true,
                deep:true
            },
            "bindOptions.data":{
                handler(newV, oldV) {
                    console.warn("请停止使用selectBar,改用selectOpt")
                    let selectNewData=newV;
                    //如果diff大于0，数据处理走diff
                    if(type(newV)==="array"&&type(oldV)==="array"&&(R.difference(newV,oldV)).length>0){
                        if(!isEmpty(selectNewData)){
                            this.handleData(selectNewData)
                            //编辑时默认成已入库选项
                            this.selectValue=selectEditDefaultData(selectNewData,this.bindOptions['key'],this.selectValue);
                        }else{
                            if(!isEmpty(this.selectValue)){
                                this.selectValue="";
                                this.$emit("input","");
                            }
                        }
                    }else if(type(newV)==="array"){
                        if(!isEmpty(selectNewData)){
                            this.handleData(selectNewData)
                            //如果只有一项默认选中第一项
                            if(selectNewData.length===1&&this.required){
                               if(curValue!==this.selectValue){
                                  
                                   this.selectDefaultData()
                               }
                               
                                
                            }
                        }
                        
                    }
                },
                immediate: true,
                deep:true
            }
        },
        data () {
            return{
                selectValue:null
            }
        },
        methods:{
            handleData(arr){
                 arr.map((item)=>{
                    if(isEmpty(item[this.bindOptions['key']])){
                        item[this.bindOptions['key']]="";
                    }else{
                        item[this.bindOptions['key']]=parseFloat(item[this.bindOptions['key']]);   
                    }
                })
            },
            selectDefaultData(){
                //正常情况下只会调用一次
                 if(!isEmpty(this.bindOptions.data)){
                        //如果只有一项,默认选中一项或者外部调用,会重复触发,
                        if(curValue!==this.selectValue){
                            this.selectValue=selectDefaultData(this.bindOptions.data,this.bindOptions['key']);
                            this.change(this.selectValue);
                            curValue=this.selectValue;
                            
                        }
                        
                }else{
                    this.selectValue="";
                    this.change(this.selectValue)
                }
               
            },
            change(value){
                this.$emit("input",this.selectValue);
                this.$emit("change",value)
            }
        }
    }
</script>
<style scoped>
    
</style>