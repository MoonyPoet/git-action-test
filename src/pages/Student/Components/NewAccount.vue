<template lang='html'>
    <el-row class="new_account">
        <el-col :span="4" class="border tab_cell">
            <ImageBar :load="studentData.headImg" :fail='studentImg' width="100" class="student_avatar"></ImageBar>
            <el-row class="group">
                <el-col class="title">{{studentData.stuName}} {{studentData.sexDisplay}} {{studentData.age}}{{$t('student.ageLabel')}}</el-col>
                <el-col class="text_center account_title"><span>{{$t("accountInfo.accountList")}}</span></el-col>
            </el-row>
             <el-row class="group">
                <el-row class="card" v-for="item in studentData.stuActs" :key="item.id">
                    <el-col :span="6">{{item.trainName}}</el-col>
                    <el-col :span="18">{{$t("accountInfo.remain")}}:{{item.remainVal}}{{$t('unit.cardVal')}}</el-col>
                    <!-- {{item.cardType==='1'?}} -->
                </el-row>
            </el-row>
        </el-col>
        <el-col :span="20" class="tab_cell">
            <span class="content_edit">{{$t('student.contentEdit')}}</span>
        <el-form :model="formData2" :rules="rules" size="medium" ref="formData2" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="true">
            <el-form-item :label="$t('student.trainIdLabel')" prop="trainId">
            <SelectOpt  @change="getTrainId" v-model="formData2.trainId" :data="trainData" val='trainName' id='trainId' :placeholder="$t('student.trainId')" ref="trainId"></SelectOpt>
            </el-form-item>
            <el-form-item :label="$t('student.cardIdLabel')" prop="cardId">
            <SelectOpt  @change="getCardId" v-model="formData2.cardId" :data="cardData" val='cardName' id='cardId' :placeholder="$t('student.cardId')" ref="cardId"></SelectOpt>
            </el-form-item>
            <el-form-item>
                <el-row class="card_info">
                <el-row>
                <el-col :span="4">{{$t('student.salesAmountLabel')}}:￥{{curCardData.salesAmount}}</el-col>
                <el-col :span="5">{{$t('student.cardTypeDisplayLabel')}}:{{curCardData.cardTypeDisplay}}</el-col>
                <el-col :span="5">{{$t('student.cardValLabel')}}:{{curCardData.cardType==='1'?curCardData.cardVal:curCardData.useDay}}{{$t('unit.cardVal')}}</el-col>
                <el-col :span="10"><span>{{$t('student.unitAmountLabel')}}:{{curCardData.unitAmount}}{{$t('unit.yuan')+'/'+$t('unit.cardVal')}}</span><span class="edit" @click="edit">{{$t("form.edit")}}></span></el-col>
                </el-row>
                <el-row style="margin-bottom:10px" v-if="this.cardDiscounts.length!==0">
                <el-col :span="4">
                    {{$t('student.cardDiscountItemIdLabel')}}&nbsp;&nbsp;
                </el-col>
                <el-col :span="3">
                    <FormItem :label="$t('student.cardDiscountItemIdLabel')" prop="cardDiscountItemId" :isShowLabel="false" :width="200">
                        <SelectOpt :width="200"  @change="getCardDiscountItemId" v-model="formData2.cardDiscountItemId" :data="cardDiscounts" val='cardDiscountName' id='cardDiscountItemId' :title="$t('student.cardDiscountItemId')" :placeholder="$t('student.cardDiscountItemId')" ref="cardDiscountItemId"></SelectOpt>
                    </FormItem>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="4">
                    {{$t('student.mdiscountAmountLabel')}}&nbsp;&nbsp;
                </el-col>
                <el-col :span="3">
                    <FormItem :label="$t('student.mdiscountAmountLabel')" prop="mdiscountAmount" :rules="[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: 'blur'
                    },{
                        validator:validateHasDecimal
                    }]" :isShowLabel="false" :width="200">
                    <el-input v-model="formData2.mdiscountAmount" :placeholder="$t('student.mdiscountAmount')"></el-input>
                    </FormItem>
                </el-col>
                </el-row>
                <el-row>
                <hr>
                </el-row>
                <el-row>
                <el-row>
                    <el-col :span="4">{{$t('student.salesAmountLabel1')}}:</el-col>
                    <el-col :span="4" class="pull_right">{{curCardData.salesAmount}}</el-col>
                </el-row>
                <el-row v-if="cardDiscounts.length>0&&formData2.cardDiscountItemId">
                    <el-col :span="4">{{$t('student.cardDiscountItemIdLabel')}}:</el-col>
                    <el-col :span="4" class="pull_right">-{{formData2.discountAmount}}</el-col>
                </el-row>
                <el-row v-if="formData2.mdiscountAmount">
                    <el-col :span="4">{{$t('student.mdiscountAmountLabel')}}:</el-col>
                    <el-col :span="4" class="pull_right">-{{formData2.mdiscountAmount}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">{{$t('student.receivableAmountLabel')}}:</el-col>
                    <el-col :span="4" class="pull_right">{{receivableAmount}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">{{$t('student.amountLabel')}}:</el-col>
                    <el-col :span="6" class="pull_right">
                        <FormItem :label="$t('student.amountLabel')" prop="amount" :isShowLabel="false" :rules="[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: 'blur'
                    },{
                        validator:validateHasDecimal
                    }]" :width="140">
                            <el-input :placeholder="$t('student.amount')" v-model="formData2.amount"></el-input>
                        </FormItem>
                    </el-col>
                    <el-col :span="1" class="pull_right">￥</el-col>
                </el-row>
                </el-row>
            </el-row>
            </el-form-item>
            <el-form-item :label="$t('student.trainLevelIdLabel')" prop="trainLevelId">
            <SelectOpt v-model="formData2.trainLevelId" :data="trainLevels" val='trainLevelName' id='trainLevelId' :placeholder="$t('student.trainLevelId')" ref="trainLevelId"></SelectOpt>
            </el-form-item>
            <el-form-item>
                <div class="btn_bottom">
                    <el-button type="primary" @click="resetForm('formData2')" class="submit_button reset">{{$t('form.reset')}}</el-button>
                    <el-button type="primary" @click="submitForm('formData2')" class="submit_button submit">{{$t('form.submit')}}</el-button>
                </div>
            </el-form-item>
        </el-form>
        </el-col>
        <Dialog ref="dialog" :title="$t('student.unitAmountLabel')" @submit="submit">
			<template slot="content">
                <el-form size="medium" ref="formData5" :model="formData2" :rules="rules" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
                    <el-form-item :label="$t('student.unitAmountLabel')" prop="unitAmount">
                    <el-input v-model="formData2.unitAmount" :placeholder="$t('student.unitAmount')" :title="$t('student.unitAmount')"></el-input>
                    </el-form-item>
                </el-form>
			</template>
		</Dialog>
    </el-row>
</template>
<script>
    import ImageBar from "common/ImageBar";
    import studentImg from "assets/img/student.png";
    import SelectOpt from "common/SelectOpt";
    import {clone,isEmpty,validateForm } from "assets/js/reused";
    import { validateHasDecimal} from "assets/js/vuelidate";
    import Dialog from "common/Dialog";
    import FormItem from "common/FormItem";
    import accountMixin from "../mixin";
     export default {
        name: 'newAccount',
        mixins:[accountMixin],
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
                rules:{
                    campusId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    trainId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    classId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    amount:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "blur"
                    },{
                        validator:validateHasDecimal
                    }
                    ]
                }
            }
        },
        created(){
            Object.assign(this,{
                validateHasDecimal:validateHasDecimal
            })
            this.init()
        },
        methods:{
             async init(){
                // this.studentData=await post("student/stu_detail",{
                //     stuId:this.$route.query.stuId
                // })
                let pageData=await this.find();
                this.studentData=pageData.left[0];
                 this.trainData=pageData.right;
                    this.$nextTick(()=>{
                    if(isEmpty(this.formData2.trainId)){
                        this.$refs.trainId.selectDefaultData()
                    }
                })
                // this.getCampusId(this.$route.query.campusId)
            },
            async find(){
               return await post("student/stu_act_new_find",{
                    stuId:this.$route.query.stuId,
                    campusIds:this.$route.query.campusId,
                    unTrainIds:this.$route.query.trainIds
                })
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
                if(formName==="formData2"){
                    this.$nextTick(()=>{
                        this.formData2.amount=null;
                        this.$refs.trainId.selectDefaultData();
                    })
                }
            },
            submitForm(){
                let formData=clone(this.formData2);
                formData.stuId=this.$route.query.stuId;
                formData.receivableAmount=this.receivableAmount;
                formData.isArrears=formData.isArrears?1:0;
                 validateForm({
                    form: this.$refs["formData2"],
                    formData: formData,
                    url: "student/stu_act_new_add",
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
.new_account{
    display: table;
    .tab_cell{
        display: table-cell;
        float: none;
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
    .account_title{
        margin-bottom: 20px;
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
    .card{
        margin: 0 10px;
        height: 75px;
        line-height: 75px;
        color:#fff;
        padding:0 20px;
        margin-bottom:20px;
        border-radius: 5px;
        div:nth-of-type(2){
            text-align: right;
        }
    }
    .card:nth-child(odd) {
        background: #bfbf00;
    }
    .card:nth-child(even) {
        background: #3d78d4;
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
}

</style>