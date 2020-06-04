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
   <span v-if="data&&data.length===1&&required===true">
       {{data&&data[0]&&data[0][val]}}
   </span>
   <!-- 选项数据一项都没有提示文字信息-->
   <span v-else-if="data&&data.length===0">
       {{$t('components.msg1')}}
   </span>
   <span v-else>
       <el-select v-model="selectValue" :size="size" @change="change" :style="{width:width+'px'}" class="des" :placeholder="placeholder">
            <el-option 
                v-for="item in data"
                :key="item[id]"
                :label="item[val]"
                :value="item[id]">
            </el-option>
        </el-select>
   </span>
   
    
</template>
<script>
//对输入值处理，如果数据非number,则全部处理成number
//添加时选项只有一个时默认选中第一个，并且触发change,如果手动改变下拉选项，则触发change,编辑页面直接触发change,不需要根据是否只有一项进行判断,如果手动改变下拉选项，则触发change
//如果没有选项数据则不进行处理，提示文字
    import {selectEditDefaultData,isEmpty,selectDefaultData,type,debounce,setCookie,getCookie} from "assets/js/reused";
    import { from,Observable,zip,combineLatest } from 'rxjs';
    import { debounceTime,tap,concat } from 'rxjs/operators';
    import { watch } from "rxjs-watcher";
    import * as R from 'ramda';
    let curValue=null;
     export default {
        name: 'SelectOpt',
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
            placeholder:{
                type:String,
                default:"请选择"
            },
            id:{
                type:String,
                default:"value"
            },
            val:{
                type:String,
                default:"display"
            },
            data:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            //因为有的选项不是必填项，当有的选项只有一项时会被默认选中，required为false可以去掉默认选中
            required:{
                type:Boolean,
                default:true
            },
            isEdit:{ //是否是编辑,默认一项并且显示错误的时候使用,主要是禁用状况导致的异常情况
                type:Boolean,
                default:false
            }
        },
        data () {
            return{
                selectValue:null,
                count:0,
                setNumberCount:0,
                isAdd:false,//只有添加页并且下拉选框选中第一个才会调用selectDefaultData;
                isAllowEdit:this.isEdit,
                changeVal:null
            }
        },
       async created(){
            let ob1=this.ObservableValue();
            let ob2=this.ObservableData();
            let ob3=this.ObservableChangeVal();
            // ob1.subscribe(res=>{
            //    this.setNumber(res);
            // })
            // ob2.subscribe(res=>{
            //     this.setData(res.newV,res.oldV)
            // })
            // combineLatest(combineLatest(ob1,ob2)).subscribe((res)=>{
            //     console.log(res)
            // })
            zip(ob1,combineLatest(ob2)).pipe(watch("121",100)).subscribe((res)=>{
                console.log(res)
            })
            // ob1.pipe(combineLatest(ob2)).subscribe((res)=>{
            //     console.log(res)
            // })
            ob3.pipe(debounceTime(500)).subscribe((res)=>{
               this.$emit("input",res);
               this.$emit("change",res)
            })
            if(this.$route.fullPath.search(/edit/)>-1){
                this.isAllowEdit=true;
            }
            //当this.data只有一个值时,默认选中第一个(只有必填选项才需要选)并且调用this.change,编辑不需要调用,
            if(!isEmpty(this.data)&&this.data.length===1&&this.required&&this.isAllowEdit===false){
                if(this.count===0){
                     this.handleData(this.data);
                }
                if(curValue!==this.selectValue){
                    this.isAdd=true;//让编辑的watch失效,说明是添加页的select
                    this.selectDefault(this.data)
                }
            }
        },
        methods:{
            setNumber(newV){
                if(type(newV)!=="number"&&!isEmpty(newV)){
                    this.selectValue=parseFloat(newV);
                    // this.$emit("input",parseFloat(newV));
                }else{
                    this.selectValue=newV;
                }
                //按逻辑this.selectValue为空是不需要去关联其他下拉框的,放过"",可能为全部
                if(!isEmpty(this.data)&&type(this.selectValue)!==null){
                    if(this.setNumberCount===0){
                        this.change(this.selectValue);
                        this.setNumberCount++;
                    }
                }
               
            },
            setData(newV,oldV){
                //过滤掉为this.selectValue为空的
                if(type(newV)==="array"&&type(oldV)==="array"&&(R.difference(newV,oldV)).length>0&&!isEmpty(this.selectValue)){
                    //编辑时判断
                     if(!isEmpty(newV)){
                        this.handleData(newV)
                        //编辑时默认成已入库选项
                        this.selectValue=selectEditDefaultData(newV,this['id'],this.selectValue);
                        this.change(this.selectValue)
                    }else if(isEmpty(newV)){
                        if(!isEmpty(this.selectValue)){
                            this.selectValue="";
                            this.$emit("input","");
                        }
                    }
                }
            },
            ObservableData(){
                return Observable.create((observer)=> {
                    this.$watch("data",(newV,oldV)=>{
                        observer.next({
                                newV:newV,
                                oldV:oldV
                        });
                        },{deep: true,immediate: true})
                    });
            },
            ObservableChangeVal(){
                return Observable.create((observer)=> {
                    this.$watch("changeVal",(newV,oldV)=>{
                        observer.next(newV);
                        })
                    });
            },
            ObservableValue(){
                return Observable.create((observer)=> {
                    this.$watch("value",(newV,oldV)=>{
                        observer.next(newV);
                        },{deep: true,immediate: true})
                    });
            },
            watchData(){
                 return new Promise((resolve,reject)=>{
                    this.$watch("data",(newV,oldV)=>{
                        if(!this.isAdd&&!isEmpty(newV)){
                             resolve({
                                newV:newV,
                                oldV:oldV
                            })
                        } 
                    },{deep: true,immediate: true})
                })
            },
            watchValue(){
                return new Promise((resolve,reject)=>{
                    this.$watch("value",(newV,oldV)=>{
                         if(!this.isAdd&&!isEmpty(newV)){
                            resolve(newV)
                        }
                    },{deep: true,immediate: true})
                })
            },
            handleData(arr){
                 arr.map((item)=>{
                    if(isEmpty(item[this['id']])){
                        item[this['id']]="";
                    }else{
                        item[this['id']]=parseFloat(item[this['id']]);   
                    }
                })
            },
            selectDefaultData(){
                this.isAdd=true;
                if(this.count===0){
                    this.handleData(this.data);
                    this.count++;
                    //数据只需要处理一次，不需要频繁chul
                }
                this.selectDefault(this.data)
            },
            selectDefault(data){
                //正常情况下只会调用一次
                //如果多级联动触发外面用v-if判断
                 if(!isEmpty(data)){
                        //如果只有一项,默认选中一项或者外部调用,会重复触发,
                        // 由于经过this.handleData的处理,this.selectValue只能是float类型
                        if(curValue!==this.selectValue||curValue===null){
                            this.selectValue=selectDefaultData(data,this['id']);
                            this.change(this.selectValue);
                            curValue=this.selectValue;
                        }
                        
                }else{
                    this.selectValue="";
                    this.change(this.selectValue)
                }
            },
            change(value){
                this.changeVal=value;
            }
        }
    }
</script>
<style scoped>
    
</style>