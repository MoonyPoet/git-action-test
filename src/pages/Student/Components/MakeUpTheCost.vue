<template lang='html'>
    <el-row class="renew">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
            <el-form-item :label="$t('student.trainIdLabel')" prop="stuActId">
            <SelectOpt  @change="getStuActId" v-model="formData.stuActId" :data="trainData" val='trainName' id='stuActId' :placeholder="$t('student.trainId')" ref="stuActId"></SelectOpt>
            </el-form-item>
            <el-form-item>
                 <el-row class="content">
                     <el-row>
                        <el-col :span="6">{{$t('renew.arrearsProduct')}}</el-col>
                        <el-col :span="18">{{stuActData.cardName}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">{{$t('renew.replenishmentAmount')}}</el-col>
                        <el-col :span="18">￥{{stuActData.arrearsAmount}}</el-col>
                    </el-row>
                 </el-row>
            </el-form-item>
            <el-form-item :label="$t('renew.renewAccountLabel')" prop="renewAccount">
                <el-input v-model="formData.renewAccount" @input="renewAccountInput" :placeholder="$t('renew.renewAccount')"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-row class="content">
                     <el-row>
                        <el-col :span="6">{{$t('renew.accountStatusAfterReimbursement')}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">{{$t('renew.arrears')}}</el-col>
                        <el-col :span="18">{{curAmount}}</el-col>
                    </el-row>
                 </el-row>
            </el-form-item>
             <el-form-item class="submit_div">
                <el-button type="primary" class="submit_button reset" @click="resetForm('formData')">{{$t("form.reset")}}</el-button>
                <el-button type="primary" class="submit_button submit" @click="submitForm">{{$t("form.submit")}}</el-button>
            </el-form-item>
        </el-form>
    </el-row>
</template>
<script>
    import ImageBar from "common/ImageBar";
    import studentImg from "assets/img/student.png";
    import SelectOpt from "common/SelectOpt";
    import {clone,isEmpty,validateForm,getTableItem } from "assets/js/reused";
    import {validateHasDecimal} from "assets/js/vuelidate";
    import Dialog from "common/Dialog";
    import FormItem from "common/FormItem";
    import accountMixin from "../mixin";
     export default {
        name: 'renew',
        components:{
            ImageBar,
            SelectOpt,
            FormItem,
            Dialog
        },
        data () {
            return{
                studentData:{},
                studentImg:studentImg,
                formData:{
                    stuActId:null,
                    renewAccount:null
                },
                stuActData:{},
                trainData:[],
                rules:{
                    stuActId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    renewAccount:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "blur"
                    },{
                        validator: validateHasDecimal,
                        trigger: "blur"
                    }],
                    classId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }]
                }
            }
        },
        computed: {
            curAmount(newV,oldV){
                let renewAccount;
                if(isEmpty(this.formData.renewAccount)){
                    renewAccount=0
                }else{
                    renewAccount=parseFloat(this.formData.renewAccount)
                }
                if(!isEmpty(this.stuActData)&&!isEmpty(this.stuActData.arrearsAmount)){
                    return this.stuActData.arrearsAmount-renewAccount;
                }
            }
        },
        created(){
            this.init()
        },
        methods:{
             async init(){
                // this.studentData=await post("student/stu_detail",{
                //     stuId:this.$route.query.stuId
                // })
                // this.getCampusId(this.$route.query.campusId)
                this.trainData=await this.find()
                this.$nextTick(()=>{
                    this.$refs.stuActId.selectDefaultData()
                })
            },
            renewAccountInput(val){
                if(parseFloat(val)>this.stuActData.arrearsAmount){
                    setTimeout(()=>{
                        this.formData.renewAccount=this.stuActData.arrearsAmount;
                    });
                }
            },
            async find(){
                return await post("student/stu_act_arrears_find",{
                    stuId:this.$route.query.stuId
                })
            },
            getStuActId(id){
                this.stuActData=getTableItem(this.trainData,"stuActId",id)
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
                 this.$nextTick(()=>{
                    this.$refs.stuActId.selectDefaultData();
                })
            },
            submitForm(){
                let formData=clone(this.formData);
                formData.price=formData.renewAccount;
                delete formData["renewAccount"];
                 validateForm({
                    form: this.$refs["formData"],
                    formData: formData,
                    url: "student/stu_act_arrears_edit",
                    success:(res)=>{
                        this.$message({
                            message:res.message,
                            type: 'success'
                        })
                        this.$store.commit("deleteTabAndGo")
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
.renew{
    .submit_div{
       /deep/ .el-form-item__content{
            width:400px;
        }
    }
    .submit{
        width: 100px;
    }
    .btn_bottom{
        width: 400px;
    }
    .content_edit{
        font-size: 18px;
        padding-left: 106px;
        padding-bottom: 20px;
        display: block;
    }
    .student_avatar{
        display: block;
        margin: 0 auto;
        width: 100px;
    }
    .title{
        text-align: center;
        padding: 20px 0;
    }
    .col_pad{
        padding: 2px 20px;
        background: #3D78D4;
        color: #fff;
        border-radius: 5px;
        margin-right: 10px;
    }
    .border{
        border-right: 1px solid #ddd;
    }
    .edit{
        color:#409eff;
        cursor: pointer;
        padding-left: 10px;
    }
    .class_hour_div{
        width: 1200px;
    }
    .cur{
        cursor: pointer;
    }
    .btn_bottom{
        width: 350px;
    }
    .bg_gray{
        background: rgb(242,242,242);
        margin: 0 auto;
        margin-bottom: 10px;
        width: 120px;
        display: inline-block;
    }
    .submit_button{
        width: 156px;
    }
    .isChecked{
        background: #3D78D4;
        color: #fff;
    }
    .week{
        margin-bottom:15px;
        text-align: center;
    }
    .card_info{
        width: 600px;
        background: #f8f8f8;
        padding: 10px;
    }
    .content{
        width: 600px;
        background: #F2F2F2;
        color: #7F7F7F;
        padding: 20px;
        .discount_border{
            border-bottom: 1px dashed #ddd;
            height: 18px;
        }
    }
}

</style>