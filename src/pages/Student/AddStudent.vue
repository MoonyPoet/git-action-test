<template lang='html'>
  <div class="add_student">
    <el-steps :active="this.active" finish-status="success">
      <el-step :title="$t('student.fillBasicInfo')"></el-step>
      <el-step :title="$t('student.fillCardInfo')"></el-step>
      <el-step :title="$t('student.carryOut')"></el-step>
    </el-steps>
    <div v-show="active===0">
       <el-form :model="formData1" :key="key1" :rules="rules" size="medium" ref="formData1" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
        <el-form-item :label="$t('student.campusIdLabel')" prop="campusId">
           <SelectOpt v-model="formData1.campusId" :data="codeData.campusId" val='display' id='value' :placeholder="$t('student.campusId')" ref="campusId"></SelectOpt>
        </el-form-item>
        <el-form-item :label="$t('student.stuNameLabel')" ref="stuName" prop="stuName">
            <el-input v-model="formData1.stuName" :placeholder="$t('student.stuName')"></el-input>
          </el-form-item>
        <el-form-item :label="$t('student.sexLabel')" ref="sex" prop="sex">
          <RadioOpt v-model="formData1.sex" :data="codeData.sex"></RadioOpt>
        </el-form-item>
        <el-form-item :label="$t('student.telLabel')" ref="tel" prop="tel">
            <el-input v-model="formData1.tel" :placeholder="$t('student.tel')" :title="$t('student.tel')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.birthDtLabel')" ref="birthDt" prop="birthDt">
          <Day v-model="formData1.birthDt" :placeholder="$t('student.birthDt')" :title="$t('student.birthDt')" :pickerOptions="pickerOptions"></Day>
        </el-form-item>
        <!-- <el-form-item :label="$t('student.headImgLabel')" prop="headImg">
          <UploadImg ref="headImg" v-model="formData1.headImg"></UploadImg>   
        </el-form-item> -->
        <el-form-item :label="$t('student.schoolLabel')" prop="school">
          <el-input :placeholder="$t('student.school')" v-model="formData1.school"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.addressLabel')" prop="address">
          <el-input :placeholder="$t('student.address')" v-model="formData1.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.weightLabel')" prop="weight">
          <el-input :placeholder="$t('student.weight')" v-model="formData1.weight"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.heightLabel')" prop="height">
          <el-input :placeholder="$t('student.height')" v-model="formData1.height"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.stuTypeLabel')" prop="stuType">
          <RadioOpt :data="codeData.stuType" v-model="formData1.stuType"></RadioOpt>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm('formData1')" class="submit_button reset">{{$t('form.reset')}}</el-button>
          <el-button type="primary" @click="nextStep('formData1')" class="submit_button submit">{{$t('form.nextStep')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="active===1">
       <el-form :model="formData2" :rules="rules" size="medium" ref="formData2" label-width="100px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
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
        <el-row class="text_center">
          <el-button type="primary" @click="LastStep('formData2')" class="submit_button submit">{{$t('form.lastStep')}}</el-button>
          <el-button type="primary" @click="resetForm('formData2')" class="submit_button reset">{{$t('form.reset')}}</el-button>
          <el-button type="primary" @click="nextStep('formData2')" class="submit_button submit">{{$t('form.nextStep')}}</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- <div v-show="active===2">
       <el-form :model="formData3" :rules="rules" size="medium" ref="formData3" label-width="200px" label-position="left" class="base_form form2" :validate-on-rule-change="false">
         <el-form-item :label="$t('student.heightLabel')" ref="height" prop="height">
            <el-input v-model="formData3.height" :placeholder="$t('student.height')" :title="$t('student.height')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.weightLabel')" ref="weight" prop="weight">
            <el-input v-model="formData3.weight" :placeholder="$t('student.weight')" :title="$t('student.weight')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.addressLabel')" ref="address" prop="address">
            <el-input v-model="formData3.address" :placeholder="$t('student.address')" :title="$t('student.address')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.iccardNumLabel')" ref="idcaiccardNumrdNum" prop="iccardNum">
            <el-input v-model="formData3.iccardNum" :placeholder="$t('student.iccardNum')" :title="$t('student.iccardNum')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.idcardNumLabel')" ref="idcardNum" prop="idcardNum">
            <el-input v-model="formData3.idcardNum" :placeholder="$t('student.idcardNum')" :title="$t('student.idcardNum')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('student.policyNumLabel')" ref="policyNum" prop="policyNum">
            <el-input v-model="formData3.policyNum" :placeholder="$t('student.policyNum')" :title="$t('student.policyNum')"></el-input>
        </el-form-item>
        <el-row class="text_center">
          <el-button type="primary" @click="LastStep('formData3')" class="submit_button submit">{{$t('form.lastStep')}}</el-button>
          <el-button type="primary" @click="resetForm('formData3')" class="submit_button reset">{{$t('form.reset')}}</el-button>
          <el-button type="primary" @click="nextStep('formData3')" class="submit_button submit">{{$t('form.nextStep')}}</el-button>
        </el-row>
      </el-form>
    </div> -->
    <div v-show="active===2">
      <el-form size="medium" ref="formData4" label-position="left" class="base_form form1" :validate-on-rule-change="false">
        <span class="title">{{$t('student.baseInfoLabel')}}</span>
        <el-row class="headImg">
          <el-col :span="7"><ImageBar :load="formData1.headImg" :fail='studentImg' width="100" class="campus_avatar"></ImageBar></el-col>
          <el-col :span="17">
            <el-row class="mb_10">
              <el-col :span="4">{{formData1.stuName}}</el-col>
              <el-col :span="4">{{filterSex(formData1.sex)}}</el-col>
              <!-- <el-col :span="4">{{formData4.ageDisplay}}{{$t('student.ageLabel')}}</el-col> -->
            </el-row>
             <el-row class="mb_10">{{formData1.tel}}</el-row>
            <el-row>{{formData4.campusDisplay}}</el-row>
          </el-col>
          
        </el-row>
        <span class="title">{{$t('student.accountOpenInfoLabel')}}</span>
        <el-row class="over_hide list">
          <div class="pull_left">{{$t('student.cardIdLabel')}}</div>
          <div class="pull_right"> {{formData4.cardDisplay}}</div>
        </el-row>
        <el-row class="over_hide list" v-if="formData4.cardDiscountDisplay">
          <div class="pull_left">{{$t('student.cardDiscountItemIdLabel')}}</div>
          <div class="pull_right">{{formData4.cardDiscountDisplay}}</div>
        </el-row>
         <el-row class="over_hide list">
          <div class="pull_left">{{$t('student.receivableAmountLabel')}}</div>
          <div class="pull_right"> {{formData4.receivableAmountDisplay}}</div>
        </el-row>
        <el-row class="over_hide list"  v-if="formData2.isArrears">
          <div class="pull_left">{{$t('student.isArrearsLabel')}}</div>
          <div class="pull_right" style="color:red">{{$t('student.isArrears')}}</div>
        </el-row>
        <el-row class="text_center">
          <el-button type="primary" @click="LastStep('formData4')" class="submit_button submit">{{$t('form.lastStep')}}</el-button>
          <el-button type="primary" @click="submitForm('formData4')" class="submit_button submit">{{$t('form.submit')}}</el-button>
        </el-row>
      </el-form>
    </div>
    <Dialog ref="dialog" :title="$t('student.unitAmountLabel')" @submit="submit">
			<template slot="content">
         <el-form size="medium" ref="formData5" :model="formData2" :rules="rules" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
            <el-form-item :label="$t('student.unitAmountLabel')" prop="unitAmount">
              <el-input v-model="formData2.unitAmount" :placeholder="$t('student.unitAmount')" :title="$t('student.unitAmount')"></el-input>
            </el-form-item>
         </el-form>
			</template>
		</Dialog>
  </div>
</template>
<script>
  import {
    clone,
    getCookie,
    debounce,
    deleteForArr,
    selectDefaultData,
    isEmpty,
    getCode,
    getCodeDisplay
  } from "assets/js/reused";
  import {
    validatePhone,
    validateCard,
    validateIdCard,
    validateAccount,
    validatePassword,
    validateHasDecimal,
    validateNumber
  } from "assets/js/vuelidate";
  import UploadImg from "common/UploadImg";
  import Day from "common/Day";
  import RadioOpt from "common/RadioOpt";
  import SearchBar from "common/SearchBar";
  import {campusFind1} from "assets/js/mixin";
  import ImageBar from "common/ImageBar"
  import studentImg from "assets/img/student.png"
  import SelectOpt from "common/SelectOpt";
  import accountMixin from "./mixin";
  import Dialog from "common/Dialog";
  import FormItem from "common/FormItem";
  export default {
    name: "addStudent",
    mixins:[campusFind1,accountMixin],
    components: {
      UploadImg,
      RadioOpt,
      SelectOpt,
      Day,
      Dialog,
      FormItem,
      ImageBar
    },
    data() {
      return {
        formData1: {
          areaId:null,
          campusId:null,
          birthDt:null,
          headImg:null,
          stuName:null,
          sex:1,
          tel:null,
          height:null,
          weight:null,
          stuType:1,
          address:null,
          school:null
        },
        formData3: {
          weight:null,
          height:null,
          address: null,
          iccardNum:null,
          idcardNum:null,
          policyNum:null
        },
        formData4:{
          ageDisplay:null,
          campusDisplay:null,
          trainLevelDisplay:null,
          receivableAmountDisplay:null,
          cardDiscountDisplay:null,
          cardDisplay:null,
          trainDisplay:null
        },
        key1:0,
        active:0,
        isEdit:false,
        codeData:{},
        studentImg:studentImg,
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        rules: {
          areaId:[{
            required: true,
            message:this.$t('form.required'),
            trigger: "change"
          }],
          weight:[{
            message:this.$t('form.required'),
            trigger: "blur"
          },{
            trigger: "blur",
            validator: validateNumber
          }],
          height:[{
            message:this.$t('form.required'),
            trigger: "blur"
          },{
            trigger: "blur",
            validator: validateNumber
          }],
          campusId:[{
             required: true,
            message:this.$t('form.required'),
            trigger: "change"
          }],
          stuName: [{
            required: true,
            message:this.$t('form.required'),
            trigger: "blur"
          }],
          sex: [{
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }],
          birthDt: [{
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }],
          tel: [{
              required: true,
              message: this.$t('form.required'),
              trigger: "blur"
            },
            {
              validator: validatePhone,
              trigger: "blur"
            }
          ],
          stuType:[{
              required: true,
              message: this.$t('form.required'),
              trigger: "change"
            }]
        }
      };
    },
    created() {
      Object.assign(this,{
        validateHasDecimal:validateHasDecimal,
        validateNumber:validateNumber
      })
      this.init();
    },
    methods: {
      async init() {
        this.codeData=await getCode("campus,_sex,card,_card_type,_stu_type");
        this.cardData=this.codeData.cardId;
        this.$nextTick(()=>{
            this.$refs.cardId.selectDefaultData();
        });
      },
      searchOptFn(v){
          return {"keyword":"member","insId":getCookie("insId"),"assVal":v}
      },
      pushCallbackFn(element){
          return {
              value:element.display ,//显示需要的
              id: element.value
          }
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
        if(formName==="formData2"){
          this.$nextTick(()=>{
              this.formData2.receivedAmount=null;
              this.$refs.cardId.selectDefaultData();
          })
        }
      },
      LastStep(){
        this.active--;
        if(this.active===0){
          //给上传图片赋值
          this.$nextTick(()=>{
            //  this.$refs.headImg.setImgUrl(this.formData1.headImg)
          })
        }
      },
      nextStep(formName){
        if(this.active===1){
          if(Number(this.formData2.receivedAmount)>Number(this.formData2.receivableAmount)){
            this.$confirm(this.$t("student.msg1"), this.$t("components.tips"), {
                  confirmButtonText: this.$t("components.confirm"),
                  cancelButtonText: this.$t("components.cancel"),
                  type: 'warning'
              }).then(() => {
                  this.formData2.receivedAmount=this.formData2.receivableAmount;
              })
             return
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.active++;
            if(this.active===2){
              if(Number(this.formData2.receivedAmount)===Number(this.formData2.receivableAmount)){
                this.formData2.isArrears=false;
              }
              this.computedForm4()
            }
            else if(this.active===3){
              this.computedForm4()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      computedForm4(){
        this.formData4.campusDisplay=getCodeDisplay(this.codeData.campusId,this.formData1.campusId)
        this.formData4.receivableAmountDisplay=this.formData2.receivableAmount;
        this.formData4.cardDisplay=this.curCardData.cardName;
        // this.calculateAge()
      },
      async calculateAge(){
      //  this.formData4.ageDisplay=await post("student/calculate_Age",{
      //    birthDt:this.formData1.birthDt
      //  })
       let year=(new Date()).getFullYear() -(new Date(Number(this.formData1.birthDt)*1000)).getFullYear();
       let mouth=((new Date()).getMonth()-new Date(Number(this.formData1.birthDt)*1000).getMonth()/12*10).toFixed(0);
       this.formData4.ageDisplay=year+'.'+mouth;
      },
      filterSex(v){
        if(this.codeData.sex){
          for(let item of this.codeData.sex){
            if(v==item.value){
              return item.display;
            }
          }
        }
      },      
      submitForm(formName) {
        let formData1 = clone(this.formData1);
        let formData3 = clone(this.formData3);
        let formData2=clone(this.formData2);
        // formData2.isArrears=formData2.isArrears?1:0;
        delete formData2['isArrears'];
        delete formData1['areaId'];
        delete formData2['discountAmount'];
        let data={
          stu:{
            ...formData1,
            ...formData3
          },
          stuCard:{
            ...formData2
          }
        }
        this.$axios.post({
          url:baseURL+"stu/add",
          data:data,
          success:(res)=>{
              this.$message({
                message:res.message,
                type: 'success'
              })
              this.$store.commit("deleteTabAndGo")
          }
        })
      }
    }
  };
</script>
<style lang="scss" scoped>
.reset{
  width: 100px;
}
.submit{
  width: 100px;
}
.form1{
  padding-top: 20px;
  width: 500px;
  margin: 0 auto;
  min-width: 500px;
}
.form2{
  padding-top: 20px;
  width: 700px;
  margin: 0 auto;
  min-width: 700px;
}
.card_info{
  width: 600px;
  background: #f8f8f8;
  padding: 10px;
}
.edit{
  color:#409eff;
  cursor: pointer;
  padding-left: 10px;
}
.title{
  font-size: 18px;
}
.headImg{
  padding: 20px 0;
}
.list{
  padding: 20px;
}
</style>
