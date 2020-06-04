<template lang='html'>
    <div class='class_Category'>
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
             <el-form-item label="培训类别" prop="trainCategoryIds">
                   <el-select v-model="formData.trainCategoryIds" placeholder="请输入培训类别" @change="handerChange">
                        <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in checkObj"></el-option>
                    </el-select>
            </el-form-item> 
        </el-form>
    </div>
</template>
<script>
    import {getCookie,clone,type} from "assets/js/reused"
     export default {
        name: 'class_Category',
        props:{
            trainCategoryIdsData:String,
            trainCategoryArr:{
                type:Array,
                default(){
                    return []
                }
            },
            radio:Boolean,
            init: {
                type: Boolean,
                default:true
            },
            value:{
                type:[Number,String],
                default:""
            }
        },
        data () {
            return {
                    checkObj:[],
                    formData: {
                        trainCategoryIds:""
                    },
                    rules:{
                        trainCategoryIds:[
                            { required: true, message: this.$t('form.required'),trigger: 'change' }
                        ]
                    }
                }
        },
        created(){
            if(this.init){
                this.getTraincategory();
            }
        },
        watch:{
            trainCategoryIdsData(newV,oldV){
                this.formData.trainCategoryIds=newV.split(",").map(v=>parseInt(v))
                if(this.radio){
                    this.formData.trainCategoryIds=this.formData.trainCategoryIds
                }   
            },
            trainCategoryArr(newV,oldV){
                if(type(newV)=="array"){
                    this.checkObj=[...newV];
                }
            },
            value(newV,oldV){
                this.formData.trainCategoryIds=newV;
            },
        },
        methods:{
            getTraincategory(v={}){
                let obj={
                        getAll:"1",   
                    }
                obj=Object.assign(v,obj);
                this.$axios.post({
                    url:baseURL+"traincategory/find",
                    data:obj,
                    success:(res)=>{
                        this.checkObj=res.data;
                        if(this.checkObj.length>0){
                            this.formData.trainCategoryIds=this.checkObj[0].id;
                            this.$emit("trainCategoryId",this.checkObj[0].id)
                        }else{
                            this.formData.trainCategoryIds=""
                        }
                    }
                    })
                },
            submit(callback){
                if(this.init){
                    if(this.radio){
                    let formData=clone(this.formData);
                    formData.trainCategoryId=formData.trainCategoryIds;
                    delete formData["trainCategoryIds"];
                     this.$refs["formData"].validate((valid,prop)=>{
                        callback(valid,formData,prop)
                    })
                    }else{
                        this.$refs["formData"].validate((valid,prop)=>{
                            callback(valid,this.formData,prop)
                        })
                    }
                }else{
                    console.error("元素还没渲染,可以判断init参数")
                }
            },
            handerChange(v){
                this.$emit("trainCategoryId",v)
            }
        }
    }
</script>
<style lang="scss">
.class_Category{ 
} 
</style>