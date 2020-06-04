<template lang='html'>
    <span v-if="data&&data.length>1">
        <el-select v-model="selectValue" :style="{width:width+'px'}" multiple @change="change" :placeholder="placeholder?placeholder:'请选择'">
            <el-option
                    v-for="item in data"
                    :key="item[id]"
                    :label="item[val]"
                    :value="item[id]">
            </el-option>
        </el-select>
    </span>
    <span v-else>
        {{data&&data[0]&&data[0][val]}}
    </span>
</template>
<script>
    import {isEmpty,type} from "assets/js/reused";
     export default {
        name: 'SelectMultiple',
        props:{
            value:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            width:{
                type:Number,
                default:300
            },
            data:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            placeholder:{
                type:String,
                default:""
            },
            id:{
                type:String,
                default:"value"
            },
            val:{
                type:String,
                default:"display"
            }
        },
        watch:{
            value: {
                handler(newV, oldV) {
                   if(!isEmpty(newV)&&type(newV[0])==="string"){
                       let arr=newV;
                       arr=arr.map((item)=>parseFloat(item));
                       this.$emit("input",arr)
                   }
                   if(!isEmpty(newV)){
                       this.$emit("change",newV)
                   }
                    this.selectValue=newV;
                },
                immediate: true,
                deep:true
            },
            "data":{
                handler(newV, oldV) {
                    let selectNewData=newV;
                    //处理基本数据
                    if(!isEmpty(selectNewData)){
                        this.handleData(selectNewData);
                        if(selectNewData.length===1){
                            let id=selectNewData[0][this.id];
                            //如果只有一项默认绑定
                            if(isEmpty(this.selectValue)){
                                this.change([id])
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
                options:[],
                selectValue:[]
            }
        },
        methods:{
            handleData(arr){
                 arr.map((item)=>{
                    if(isEmpty(item[this['id']])){
                        item[this['id']]="";
                    }else{
                        item[this['id']]=parseFloat(item[this['id']]);   
                    }
                })
            },
            change(data){
                this.$emit("input",data)
                this.$emit("change",data)
            }
        }
    }
</script>
<style scoped>
    
</style>