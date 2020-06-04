<template lang='html'>
   <el-form :model="formData1"size="medium" ref="formData1" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
        <el-form-item :label="$t('student.heightLabel')">
            {{formData1.height}}
        </el-form-item>
        <el-form-item :label="$t('student.weightLabel')">
            {{formData1.weight}}
        </el-form-item>
        <el-form-item :label="$t('student.addressLabel')">
            {{formData1.address}}
        </el-form-item>
        <el-form-item :label="$t('student.iccardNumLabel')">
            {{formData1.iccardNum}}
        </el-form-item>
        <el-form-item :label="$t('student.idcardNumLabel')">
            {{formData1.idcardNum}}
        </el-form-item>
        <el-form-item :label="$t('student.policyNumLabel')">
            {{formData1.policyNum}}
        </el-form-item>
    </el-form>
</template>
<script>
import {bindData} from "assets/js/reused";
     export default {
        name: 'otherInfo',
        data () {
            return{
                formData1:{
                    address:null,
                    iccardNum:null,
                    idcardNum:null,
                    policyNum:null,
                    height:null,
                    weight:null
                }
            }
        },
        created(){
            this.init()
        },
        methods:{
            async find(data){
               return await post("student/find",data)
            },
            async init(){
                bindData({formData:this.formData1,res:(await this.find({stuId:this.$route.query.stuId}))})
            }
        }
    }
</script>
<style scoped>
    
</style>