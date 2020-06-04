<template lang='html'>
    <div>
        <el-row>
            <el-col :span="12">
                 {{a}} 编辑
                <SelectOpt :data="data" ref="sel" v-model="a" @change="achange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{b}} 添加
                <SelectOpt :data="data" ref="selb" v-model="b"  @change="bchange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{c}} 默认选中
                <SelectOpt :data="data" ref="selc" v-model="c"  @change="cchange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{d}} 只有一项 
                <SelectOpt :data="datad" ref="seld" v-model="d"  @change="cchange"></SelectOpt>
            </el-col>
             <el-col :span="12">
                 {{e}} 编辑 没有对应值，(多项)不显示,没有显示则对应id也应该为null,禁止用户提交
                <SelectOpt :data="data" ref="sele" v-model="e" @change="achange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{f}} 编辑 没有对应值，(单项)不显示,没有显示则对应id也应该为null,禁止用户提交
                <SelectOpt :data="datad" ref="self" v-model="f" @change="achange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{g}}非必填项 true
                <SelectOpt :data="datad" ref="selg" :required="false" v-model="g" @change="achange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{typeof h}} 有全选 搜索
                <SelectOpt :data="datah" ref="selh" :required="false" v-model="h" @change="hchange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{i}} 大类为0的情况
                <SelectOpt :data="datai" ref="seli"  :required="false" v-model="i" @change="ichange"></SelectOpt>
            </el-col>
            <el-col :span="12">
                 {{j}} 单项默认不选择情况
                <SelectOpt :data="datai" ref="selj" :isChoose="false" :required="false" v-model="j"></SelectOpt>
            </el-col>
             <el-col :span="12">
                 {{k}} 多次短时选中第一项的情况 {{data}}
                <SelectOpt :data="data" ref="selk"  v-model="k" @change="kchange"></SelectOpt>
            </el-col>
        </el-row>
       
    </div>
</template>
<script>
  import SelectOpt from 'common/SelectOpt';
     export default {
        name: 'PageOne',
        components:{
           SelectOpt
        },
     
        data () {
            return{
              data:[],
              datad:[],
              datah:[],
              datai:[],
              a:null,
              b:null,
              c:null,
              d:null,
              e:null,
              f:null,
              g:null,
              i:null,
              j:null,
              k:null,
              h:""
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
                setTimeout(()=>{
                    this.$refs.selc.selectDefaultData()
                    this.$refs.selk.selectDefaultData()
                    this.$refs.selk.selectDefaultData()
                    this.$refs.selk.selectDefaultData()
                    this.$refs.selk.selectDefaultData()
                })
                
            })
           
            this.a=1;
            this.e=3;
            this.f=2;
            // this.c=1;
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
           hchange(id){
               console.log("h"+(id===""))
           },
           ichange(){

           },
           kchange(id){
               console.log(id)
           }
        }
    }
</script>
<style scoped>
    
</style>