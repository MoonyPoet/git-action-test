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
      {{itemDisplay}}
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
    import { Observable} from 'rxjs';
    import { debounceTime,withLatestFrom,combineLatest,last} from 'rxjs/operators';
    import {watch} from "rxjs-watcher";
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
            isChoose:{ //数据只有一项时,默认是选中状态,isChoose为false是移除选中
                type:Boolean,
                default:true
            }
        },
        data () {
            return{
                selectValue:null,
                count:0,
                isSpecialCase:false,//是否为特殊情况,编辑时没有对应值触发
                changeVal:null,
                showDisplay:false,
                itemDisplay:"",
            }
        },
        // computed:{
        //     itemDisplay(){
        //          console.log(this.showDisplay)
        //         if(this.showDisplay){
        //             console.log(this.data)
        //             return this.data&&this.data[0]&&this.data[0][this.val]
        //         }else {
        //             return ""
        //         }
        //     }
        // },
       async created(){
            let ob1=this.ObservableValue();
            let ob2=this.ObservableData();
            let ob3=this.ObservableChangeVal();
            ob1.pipe(combineLatest(ob2)).subscribe((res)=>{
                this.setNumber(res[0]);
                this.setData(res[1].newV,res[1].oldV);
                this.itemDisplay=this.getItemDisplay(res[1].newV)
            })
            //通过防抖解决null问题，添加学员
            ob3.pipe(watch('obj3'),debounceTime(100)).subscribe((res)=>{
               this.$emit("input",res);
               this.$emit("change",res)
            })
            
        },
        methods:{
            getItemDisplay(data){
                 if(this.showDisplay){
                    if(!isEmpty(data)){
                        return data[0][this.val];
                    }else{
                        return ""
                    }
                   
                }else {
                    return ""
                }
            },
            setNumber(newV){
                if(type(newV)!=="number"&&!isEmpty(newV)){
                    this.selectValue=parseFloat(newV);
                    // this.$emit("input",parseFloat(newV));
                }else{
                    this.selectValue=newV;
                }
               
            },
            setData(newV,oldV){
                //如果有数据处理数据,没有数据不需要处理
                if(!isEmpty(newV)&&this.count===0){
                    this.handleData(newV)
                }
                if(newV.length===1){
                    //只有一个选项时
                    // 默认触发
                    //为空说明是添加,否则说明是编辑
                     if(isEmpty(this.selectValue)&&this.isChoose){
                        this.selectDefault(newV)
                        this.showDisplay=true;
                     }else{
                        this.selectValue=selectEditDefaultData(newV,this['id'],this.selectValue);
                        //有值才触发关联,如有大类小类这种情况0 是可以触发关联的
                        if(this.selectValue||this.selectValue===0){
                            this.showDisplay=true;
                            this.change(this.selectValue)
                        }else{
                            this.isSpecialCase=true
                            this.change(null)
                        }
                     }
                   
                    // this.selectDefault(newV)
                }else if(newV.length>1){
                    //为空说明是添加,否则说明是编辑
                     if(isEmpty(this.selectValue)){
                     }else{
                        this.selectValue=selectEditDefaultData(newV,this['id'],this.selectValue);
                        //有值才触发关联,如有大类小类这种情况0 是可以触发关联的
                        if(this.selectValue||this.selectValue===0){
                            this.change(this.selectValue)
                        }else{
                            this.isSpecialCase=true;
                            this.change(null)
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
                        console.log(newV)
                        if(type(newV)!=="null"){
                            observer.next(newV);
                        }else if(type(newV)==="null"&&this.isSpecialCase){
                            observer.next(newV);
                        }
                        // if(type(this.selectValue)!=="null"){
                        //     observer.next(newV);
                        // }
                         
                        },{immediate: true})
                    });
            },
            ObservableValue(){
                return Observable.create((observer)=> {
                    this.$watch("value",(newV,oldV)=>{
                        console.log(newV)
                        observer.next(newV);
                        },{deep: true,immediate: true})
                    });
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
                if(this.count===0){
                    this.handleData(this.data);
                    this.count++;
                    //数据只需要处理一次，不需要频繁处理
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
                            //由于重置会出现相同的值，changeval不改变导致watch并不触发
                            this.$emit("input",this.selectValue);
                            this.$emit("change",this.selectValue)
                            curValue=this.selectValue;
                        }
                        
                }else{
                    this.selectValue=null;
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