<template lang='html'>
    <span>
        <div class="search_multiple">
             <div class="input_parent">
                <input type="text" v-model="searchContent" :placeholder="bindOptions.placeholder" @input="search">
                <i class="el-icon-search"></i>
            </div>
            <ul>
                <template v-for="(item,index) in opions" >
                    <li v-if="item&&item.isFilter" :key="item.id" @click="searchMultipleClick(item,index)">
                       <div class="pull_left">
                            {{item[bindOptions.val]}}
                        </div>
                        <div class="pull_right check">
                            <i v-if="item.isSelected" class="el-icon-check"></i>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </span>
</template>
<script>
    import {type,isEmpty,clone} from "assets/js/reused";
     export default {
        name: 'SearchMultiple',
        props:{
            value:{
                type:Array,
                default:()=>{}
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
            }
        },
        watch:{
            "bindOptions.data":{
                handler(newV, oldV) {
                    if(type(newV)==="array"){
                       this.opions=this.filterInitData(clone(newV))
                    }
                },
                immediate: true,
                deep:true
            }
        },
        created(){
        },
        data(){
            return {
                searchContent:"",
                opions:[]
            }
        },
        methods:{
            searchMultipleClick(item,index){
                if(isEmpty(item.isSelected)){
                    this.opions.splice(index,1,{
                        isSelected:true,
                        ...item
                    })
                }else if(item.isSelected===false){
                    item.isSelected=true;
                }
                else{
                    item.isSelected=false;
                    //  this.opions.splice(index,1,{
                    //      ...item,
                    //     isSelected:false
                    // })
                }
                this.$emit("change",item[this.bindOptions.val])
            },
            filterInitData(data){
                data.map((item,index)=>{
                    item.isSelected=false;
                    item.isFilter=true;
                })
                return data;
            },
            search(){
                if(!isEmpty(this.searchContent)){
                    let reg= new RegExp(this.searchContent,"gi");
                    console.log(JSON.stringify(this.opions))
                    this.opions=this.opions.map((element)=>{
                        if(element[this.bindOptions.val].search(reg)>-1){
                            element.isFilter=true;
                        }else{
                            element.isFilter=false;
                        }
                        return element;
                    })
                }else{
                     this.opions=this.opions.map((element)=>{
                        element.isFilter=true;
                        return element;
                     })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.search_multiple{
    padding: 10px;
    border:1px solid #ccc;
    display: inline-block;
    border-radius: 5px;
    .input_parent{
        display: inline-block;
        height: 32px;
        border:1px solid #ddd;
        background: #fff;
        border-radius: 5px;
        padding:0 5px;
        box-sizing: border-box;
        input{
            height: 29px;  
        }
        line-height: 32px;
        vertical-align: middle
    }
    ul{
        li{
            height: 25px;
            line-height: 25px;
            cursor: pointer;
        }
        li:nth-last-of-type(1){
            border: none;
        }
        .check{
            i{
                color:blue
            }
        }
    }
}
</style>