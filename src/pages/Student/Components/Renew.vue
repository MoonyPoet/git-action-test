<template lang='html'>
    <el-row class="new_account">
        <el-col :span="20">
        <el-form :model="formData2" :rules="rules" size="medium" ref="formData2" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
         <el-form-item :label="pageData.stuName">
                 <el-row class="content">
                     <el-row>
                        <el-col :span="6">当前剩余</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                           <el-col style="width:80px;">卡种类型:</el-col>
                           <el-col :span="12">{{pageData.cardTypeDisplay}} </el-col>
                        </el-col>
                        <el-col :span="12">
                            <el-col :span="7">原卡单价:</el-col>
                            <el-col :span="12">
                                {{pageData.cardUnitAmount}}
                            </el-col>
                        </el-col>
                       <el-col :span="12" v-if="pageData.cardType==='1'">
                           <el-col :span="7">课次:</el-col>
                           <el-col :span="12">{{pageData.cardVal-pageData.cardUseVal}} 课次</el-col>
                        </el-col>
                        <el-col :span="24" v-else>
                           <el-col style="width:80px;">有效期:</el-col>
                           <el-col :span="12">{{pageData.cardStartDt}}/{{pageData.cardEndDt}}</el-col>
                        </el-col>
                    </el-row>
                 </el-row>
            </el-form-item>
        <el-form-item :label="$t('student.cardIdLabel')" prop="cardId">
          <SelectOpt v-model="formData2.cardId" @change="getCardId" :data="cardData" :placeholder="$t('student.cardId')" ref="cardId"></SelectOpt>
        </el-form-item>
         <el-form-item>
            <el-row class="card_info">
            <el-row>
              <el-col :span="4">{{$t('student.salesAmountLabel')}}:￥
                {{curCardData.salesAmount}}</el-col>
              <el-col :span="5">{{$t('student.cardTypeDisplayLabel')}}:
                {{curCardData.cardTypeDisplay}}
              </el-col>
              <el-col :span="6">{{$t('student.cardValLabel')}}:
                <FormItem :label="$t('student.receivedValLabel')" prop="receivedVal" :showMessage="false"  :rules="[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: 'blur'
                    },{
                        validator:validateNumber
                    }]" style="display:inline-block" :isShowLabel="false" :width="60">
                  <el-input v-model="formData2.receivedVal" ></el-input>
                </FormItem>
                <!-- {{curCardData.cardType==='1'?curCardData.cardVal:curCardData.useDay}} -->
                {{$t('unit.cardVal')}}</el-col>
              <el-col :span="9"><span>{{$t('student.unitAmountLabel')}}:{{curCardData.unitAmount}}{{$t('unit.yuan')+'/'+$t('unit.cardVal')}}</span>
              <!-- <span class="edit" @click="edit">{{$t("form.edit")}}></span> -->
              </el-col>
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
              <hr>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="4">{{$t('student.salesAmountLabel1')}}:</el-col>
                <el-col :span="4" class="pull_right">￥{{curCardData.salesAmount}}</el-col>
              </el-row>
               <el-row v-if="cardDiscounts.length>0&&formData2.cardDiscountItemId">
                <el-col :span="4">{{$t('student.cardDiscountItemIdLabel')}}:</el-col>
                <el-col :span="4" class="pull_right">-{{formData2.discountAmount}}</el-col>
              </el-row>
              <el-row v-if="formData2.mdiscountAmount">
                <el-col :span="4">{{$t('student.mdiscountAmountLabel')}}:</el-col>
                <el-col :span="4" class="pull_right">-{{formData2.mdiscountAmount}}</el-col>
              </el-row>
               <el-row style="margin-bottom:10px;">
                <el-col :span="4">{{$t('student.receivableAmountLabel')}}:</el-col>
                <el-col :span="6" class="pull_right">
                  <!-- {{receivableAmount}} -->
                    <FormItem :label="$t('student.receivableAmountLabel')" prop="receivableAmount" :showMessage="false" :isShowLabel="false" :rules="[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: 'blur'
                    },{
                        validator:validateHasDecimal
                    }]" :width="140">
                            <el-input :placeholder="$t('student.receivableAmount')" v-model="formData2.receivableAmount" @change="receivableAmountChange"></el-input>
                        </FormItem>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">{{$t('student.receivedAmountLabel')}}:</el-col>
                <el-col :span="6" class="pull_right">
                  <FormItem :label="$t('student.receivedAmount')" prop="receivedAmount" :showMessage="false" :isShowLabel="false" :rules="[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: 'blur'
                    },{
                        validator:validateHasDecimal
                    }]" :width="140">
                            <el-input :placeholder="$t('student.receivedAmount')" v-model="formData2.receivedAmount"></el-input>
                        </FormItem></el-col>
                <el-col :span="1" class="pull_right">￥</el-col>
              </el-row>
            </el-row>
          </el-row>
         </el-form-item>
         <el-form-item :label="$t('student.remarkLabel')" prop="remark">
          <el-input type="textarea" v-model="formData2.remark" :placeholder="$t('student.remark')"></el-input>
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
    import {clone,isEmpty,validateForm,getCode} from "assets/js/reused";
    import Dialog from "common/Dialog";
    import FormItem from "common/FormItem";
    import accountMixin from "../mixin";
    import { validateHasDecimal,validateNumber} from "assets/js/vuelidate";
     export default {
        name: 'Renew',
        mixins:[accountMixin],
        components:{
            ImageBar,
            SelectOpt,
            FormItem,
            Dialog
        },
        data () {
            return{
                pageData:{},
                studentData:{},
                studentImg:studentImg,
                classHour:[
                    {
                        week:"周一",
                        time:[{
                            isChecked:false,
                            classHourId:1,
                            startDt:"9:00",
                            endDt:"10:00"
                        },
                        {
                            isChecked:false,
                            classHourId:2,
                            startDt:"9:00",
                            endDt:"10:00"
                        }]
                    },
                    {
                        week:"周二",
                        time:[{
                            isChecked:false,
                            classHourId:3,
                            startDt:"9:00",
                            endDt:"10:00"
                        },
                        {
                            isChecked:false,
                            classHourId:4,
                            startDt:"9:00",
                            endDt:"10:00"
                        }]
                    }
                ],
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
                    }]
                }
            }
        },
        created(){
             Object.assign(this,{
                validateHasDecimal:validateHasDecimal,
                validateNumber:validateNumber
            })
            this.init()
        },
        methods:{
             async init(){
                // this.studentData=await post("student/stu_detail",{
                //     stuId:this.$route.query.stuId
                // })
                // this.getCampusId(this.$route.query.campusId)
                this.pageData=await this.find()
                this.codeData=await getCode("campus,_sex,card,_card_type,_stu_type");
                this.cardData=this.codeData.cardId;
                this.$nextTick(()=>{
                    this.$refs.cardId.selectDefaultData();
                });
            },
            async find(){
                return await post("stu/renew",{
                    stuId:this.$route.query.stuId
                })
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
                if(formName==="formData2"){
                    this.$nextTick(()=>{
                        this.formData2.amount=null;
                        this.$refs.trainId.selectDefaultData();
                        this.$refs.cardId.selectDefaultData();
                    })
                }
            },
            submitForm(){
                let formData=clone(this.formData2);
                formData.stuId=this.$route.query.stuId;
                delete formData["amount"];
                delete formData["isArrears"];
                delete formData["trainId"];
                 validateForm({
                    form: this.$refs["formData2"],
                    formData: formData,
                    url: "stu/renew_add",
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