<template lang='html'>
    <div>
        <el-row>
            <el-col :span="12">
                 {{a}} 添加 默认情况
                <CheckBox :data="data" ref="sel" v-model="a" @change="achange"></CheckBox>
            </el-col>
             <el-col :span="12">
                 {{b}} 添加 无数据情况
                <CheckBox :data="datab" ref="sel" v-model="b" @change="bchange"></CheckBox>
            </el-col>
             <el-col :span="12">
                 {{c}} 添加编辑 选中情况
                <CheckBox :data="data" ref="sel" v-model="c" @change="cchange"></CheckBox>
            </el-col>
             <el-col :span="12">
                 {{d}} 添加 单项直接显示值,并触发change  {{datad}}
                <CheckBox :data="datad" ref="sel" v-model="d" @change="dchange"></CheckBox>
            </el-col>
            <el-col :span="12">
                 {{e}} 编辑 没有对应值，(多项)不显示,没有显示则对应数组应该去掉该id
                <CheckBox :data="data" ref="sel" v-model="e" @change="echange"></CheckBox>
            </el-col>
            <el-col :span="12">
                 {{f}} 编辑 没有对应值，(单项)不显示,没有显示则对应数组应该去掉该id  {{datad}}
                <CheckBox :data="datad" ref="sel" v-model="f" @change="fchange"></CheckBox>
            </el-col>
            <el-col :span="12">
                 {{g}} 显示全选按钮
                <CheckBox :data="data" :isShowCheckAll="true" ref="sel" v-model="g" @change="gchange"></CheckBox>
            </el-col>
            <el-col :span="12">
                 {{h}} 编辑有对应值 {{data}}
                <CheckBox :data="data" :isShowCheckAll="true" ref="sel" v-model="h" @change="hchange"></CheckBox>
            </el-col>
        </el-row>
       
    </div>
</template>
<script>
  import CheckBox from "common/CheckBox";
     export default {
        name: 'PageOne',
        components:{
           CheckBox
        },
     
        data () {
            return{
              data:[],
              datab:[],
              datad:[],
              datah:[],
              datai:[],
              a:[],
              b:[],
              c:[1],
              d:[],
              e:[6],
              f:[7],
              g:[],
              i:[],
              j:[],
              k:[],
              h:[]
            }
        },
        created(){

            //编辑
            setTimeout(()=>{
                 this.data=[{
                    value:1,
                    display:"1"
                },{
                    value:2,
                    display:"2"
                }]
                this.datad=[{
                    value:1,
                    display:"1"
                }]
                this.datah=[{
                    value:"",
                    display:"全选",
                },{
                    value:1,
                    display:"城市"
                }]
                this.datai=[{
                    value:0,
                    display:"大类"
                }]
                this.h=[1,2]
            })
        },
        methods:{
           achange(id){
               console.log(id)
           },
           bchange(id){
               console.log(id)
           },
           cchange(id){
               console.log(id)
           },
           dchange(id){
               console.log(id)
           },
           echange(id){
               console.log(id)
           },
           fchange(id){
               console.log(id)
           },
           hchange(id){
               console.log("h"+(id===""))
           },
           ichange(){

           },
           kchange(id){
               console.log(id)
           },
           gchange(id){

           }
        }
    }
</script>
<style scoped>
    
</style>