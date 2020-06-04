<template lang='html'>
  <div class="edit_student">
    <el-form :model="formData1" :rules="rules" size="medium" ref="formData1" label-width="200px" label-position="left" class="base_form" :validate-on-rule-change="false">
        <el-form-item :label="$t('student.campusIdLabel')" prop="campusId">
           <SelectOpt v-model="formData1.campusId" :data="codeData.campusId" val='display' id='value' :placeholder="$t('student.campusId')" ref="campusId"></SelectOpt>
        </el-form-item>
        <el-row>
           <el-col :span="6">
            <el-form-item :label="$t('student.stuNameLabel')" ref="stuName" prop="stuName">
                <el-input v-model="formData1.stuName" :placeholder="$t('student.stuName')" :title="$t('student.stuName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('student.sexLabel')" ref="sex">
             <RadioOpt v-model="formData1.sex" :data="codeData.sex"></RadioOpt>
          </el-form-item>
          <el-form-item :label="$t('student.birthDtLabel')" ref="birthDt" prop="birthDt">
            <Day v-model="formData1.birthDt" :placeholder="$t('student.birthDt')" :title="$t('student.birthDt')" :pickerOptions="pickerOptions"></Day>
          </el-form-item>
          </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('student.headImgLabel')" prop="headImg">
                <UploadImg ref="headImg" v-model="formData1.headImg"></UploadImg>   
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('student.telLabel')" ref="tel" prop="tel">
                <el-input v-model="formData1.tel" :placeholder="$t('student.tel')" :title="$t('student.tel')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('student.addressLabel')" ref="address" prop="address">
                <el-input v-model="formData1.address" :placeholder="$t('student.address')" :title="$t('student.address')"></el-input>
            </el-form-item>
         </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
             <el-form-item :label="$t('student.heightLabel')" ref="height" prop="height">
                <el-input v-model="formData1.height" :placeholder="$t('student.height')" :title="$t('student.height')"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('student.weightLabel')" ref="weight" prop="weight">
                <el-input v-model="formData1.weight" :placeholder="$t('student.weight')" :title="$t('student.weight')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="6">
           <el-form-item :label="$t('student.schoolLabel')" prop="school">
            <el-input :placeholder="$t('student.school')" v-model="formData1.school"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
     
        <el-form-item>
          <el-button type="primary" @click="resetForm('formData1')" class="submit_button reset">{{$t('form.reset')}}</el-button>
          <el-button type="primary" @click="submitForm('formData1')" class="submit_button submit">{{$t('form.submit')}}</el-button>
        </el-form-item>
      </el-form>
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
    validateForm,
    getCodeDisplay,
    bindData
  } from "assets/js/reused";
  import {
    validatePhone,
    validateCard,
    validateIdCard,
    validateAccount,
    validatePassword,
    validateHasDecimal
  } from "assets/js/vuelidate";
  import UploadImg from "common/UploadImg";
  import SearchBar from "common/SearchBar";
  import {campusFind1} from "assets/js/mixin";
  import studentImg from "assets/img/student.png";
  import accountMixin from "./mixin";
  import FormItem from "common/FormItem";
  import SelectOpt from "common/SelectOpt";
  import Day from "common/Day";
  import RadioOpt from "common/RadioOpt";
  export default {
    name: "addStudent",
    mixins:[campusFind1,accountMixin],
    components: {
      RadioOpt,
      SelectOpt,
      Day,
      UploadImg,
      FormItem
    },
    data() {
      return {
        formData1: {
          areaId:null,
          campusId:null,
          birthDt:null,
          headImg:null,
          stuName:null,
          height:null,
          weight:null,
          sex:1,
          tel:null,
          address: null,
          iccardNum:null,
          idcardNum:null,
          policyNum:null,
          school:null
        },
        studentData:{},
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
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        this.codeData=await getCode("campus,_sex");
        this.find();
      },
      reset(){
        bindData({formData:this.formData1,res:this.studentData});
      },
      async find(){
        this.studentData=await post("stu/find",{
          stuId:this.$route.query.stuId
        });
        this.reset()
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
        // if(formName==="formData1"){
        //  this.reset()
        // }
      },
      LastStep(){
        this.active--;
        if(this.active===0){
          //给上传图片赋值
          this.$nextTick(()=>{
             this.$refs.headImg.setImgUrl(this.formData1.headImg)
          })
        }
      },
      nextStep(formName){
        if(this.active===1){
          if(Number(this.formData2.amount)>Number(this.receivableAmount)){
            this.$confirm(this.$t("student.msg1"), this.$t("components.tips"), {
                  confirmButtonText: this.$t("components.confirm"),
                  cancelButtonText: this.$t("components.cancel"),
                  type: 'warning'
              }).then(() => {
                  this.formData2.amount=this.receivableAmount;
              })
             return
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.active++;
            if(this.active===2){
              this.formData2.receivableAmount=this.receivableAmount;
              if(Number(this.formData2.amount)===Number(this.formData2.receivableAmount)){
                this.formData2.isArrears=false;
              }
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
        this.formData4.campusDisplay=getCodeDisplay(this.codeData.campus,this.formData1.campusId)
        this.formData4.trainLevelDisplay=getCodeDisplay(this.trainLevels,this.formData2.trainLevelId,"trainLevelId","trainLevelName")
        this.formData4.receivableAmountDisplay=this.formData2.receivableAmount;
        this.formData4.cardDiscountDisplay=getCodeDisplay(this.cardDiscounts,Number(this.formData2.cardDiscountId),"cardDiscountId","cardDiscountName")
        this.formData4.trainDisplay=getCodeDisplay(this.trainData,this.formData2.trainId,"trainId","trainName");
        this.formData4.cardDisplay=this.curCardData.cardName;
        this.calculateAge()
      },
      async calculateAge(){
       this.formData4.ageDisplay=await post("student/calculate_Age",{
         birthDt:this.formData1.birthDt
       })
      },
      submitForm(formName) {
        let formData1 = clone(this.formData1);
        let formData3 = clone(this.formData3);
        formData1.stuId=this.$route.query.stuId;
        delete formData1['areaId'];
        delete formData1["birthDt"];
        delete formData1["campusId"];
        let data={
            ...formData1,
            ...formData3
        }
        this.$axios.post({
          url:baseURL+"stu/edit",
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
