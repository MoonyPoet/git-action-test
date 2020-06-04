/*
 * @Author: xcsweb 
 * @Date: 2018-07-12 12:26:55 
 * @Last Modified by: xcsweb
 * @Last Modified time: 2018-07-18 12:25:19
 */
<template lang='html'>
    <div class='filterList'>
        <!-- {{filterData}} -->
        <div class="filterList_div">
            <el-row class="filterList_row" v-for="(item,index) in filterData" :key="item.id">
                <div class="typeName">{{item.typeName}}:</div>
                <div class="btn_list" v-if="item.typeArr&&item.typeArr.length>0">
                    <div class="pull_left btn_list_left">
                        <el-button size="mini" :key="a.id" v-for="a in item.typeArr" @click="addFilter(a.id,item.key,a.status);a.status=!a.status" :class="{active:a.status}">{{a.name}}</el-button>
                    </div>
                    <div class="pull_left btn_list_right">
                        <el-button size="mini" :class="{active:checkAllArr[index]}" @click="checkAll(index);">多选</el-button>
                    </div>
                </div>
                <div class="btn_list" v-else-if="item.moreTypeArr&&item.moreTypeArr.length>0">
                    <div class="pull_left btn_list_left">
                        <el-button size="mini" :key="a.typeId" v-for="a in item.moreTypeArr" @click="getMoreFilter(a.typeId);a.status=!a.status" :class="{active:a.status}">{{a.name}}</el-button>
                    </div>
                    <div class="pull_left btn_list_right">   
                        <el-button size="mini" :class="{active:checkAllArr[index]}" @click="checkAll1(index);">多选</el-button>
                    </div>
                </div>
            </el-row>
        </div>
        
    </div>
</template>
<script>
    import {dataProcess} from "assets/js/reused"
     export default {
        name: '',
        props:{
            newFilterData:Array
        },
        data () {
            return {
                filterData:[],
                chooseData:[],
                checkAllArr:[false,false,false,false],
            }
        },
        watch:{
            newFilterData(newV,oldV){
                console.log("====")
                console.log(oldV)
                console.log(newV)
                if(newV.length>0){
                    this.filterData=newV;
                }
            }
        },
        methods:{
            getMoreFilter(id,key){
                this.chooseData.push({
                    key:key,
                    id:id
                })
                this.$emit("data",dataProcess(this.chooseData))
                console.log(id)
            },
            addFilter(id,key,status){
                if(status==false){
                    if(this.chooseData.length!=0){
                        for(let i=0;i<this.chooseData.length;i++){
                            if(this.chooseData[i][id]!=id){
                                this.chooseData.push({
                                    key:key,
                                    id:id
                                })
                                break;
                            }
                        }
                    }else{
                        this.chooseData.push({
                            key:key,
                            id:id
                        })
                    }
                     
                }else{
                    this.chooseData.forEach((element,index)=>{
                        if(element.id==id){
                            this.chooseData.splice(index,1)
                        }
                    })
                }
                this.$emit("data",dataProcess(this.chooseData))
            },
            checkAll(index){
                 //切换多选状态
                this.checkAllArr[index]=!this.checkAllArr[index];
                //全选切换状态
                if(this.checkAllArr[index]==true){
                    this.filterData.forEach((element,newIndex)=>{
                        if(newIndex==index){
                            element.typeArr.forEach((a)=>{
                                a.status=true
                            })
                        }
                    })
                }else{
                    this.filterData.forEach((element,newIndex)=>{
                        if(newIndex==index){
                            element.typeArr.forEach((a)=>{
                                a.status=false
                            })
                        }
                    })
                }
                //多选，取消多选
                if(this.checkAllArr[index]){
                     this.filterData.forEach((element,index1)=>{
                        if(index1==index){
                            element.typeArr.forEach((a)=>{
                                this.chooseData.push({key:element.key,id:a.id})
                            }) 
                        }
                    })
                }else{
                    this.filterData.forEach((element,index1)=>{
                        if(index1==index){
                            element.typeArr.forEach((a)=>{
                                this.chooseData.splice(index,1)
                            }) 
                        }
                    })
                }
                //执行查找
               this.$emit("data",dataProcess(this.chooseData))
            },
            checkAll1(index){
                //切换多选状态
                this.checkAllArr[index]=!this.checkAllArr[index];
                //全选切换状态
                 if(this.checkAllArr[index]==true){
                    this.filterData.forEach((element,newIndex)=>{
                        if(newIndex==index){
                            element.moreTypeArr.forEach((a)=>{
                                a.status=true
                            })
                        }
                    })
                }else{
                    this.filterData.forEach((element,newIndex)=>{
                        if(newIndex==index){
                            element.moreTypeArr.forEach((a)=>{
                                a.status=false
                            })
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.filterList{
    clear: both;
    .filterList_div{
        border: 1px solid #dcdfe6;
        padding: 20px;
        border-radius: 5px;
        margin-top: 15px;
    }
    .filterList_row{
        margin-bottom: 10px;
        .typeName{
            min-width: 90px;
            padding: 0px 10px;
            float: left;
            margin-right: 10px;
            line-height: 28px;
        }
        .btn_list{
            float: left;
            width: 93%;
            button{
                margin-left: 0;
                margin-right: 10px;
                margin-bottom: 10px;
            }
            .btn_list_left{
                width: 90%;
            }
            .btn_list_right{
                width: 10%;
            }
        }
    }
    .active{
        color: #3a8ee6;
        border-color: #3a8ee6;
        outline: 0;
    }
    
}
</style>