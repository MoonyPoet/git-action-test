<template>
    <div class="edit_member">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form" :validate-on-rule-change="false">
        <el-form-item :label="$t('member.campusNameLabel')"  prop="campusId">
           <SelectOpt v-model="formData.campusId" :data="codeData.campusId" :placeholder="$t('member.campusId')"></SelectOpt>
        </el-form-item>
        <el-row>
           <el-col :span="8">
              <el-form-item v-if="formData.roleId!==0" :label="$t('member.roleIdLabel')" ref="roleId" prop="roleId">
                <SelectOpt v-model="formData.roleId" :data="codeData.roleId" :placeholder="$t('member.roleId')"></SelectOpt>
                <!-- <CheckBox  v-model="formData.roleIds" ref="roleIds" :bindOptions="{data:codeData.role,val:'display',key:'value',placeholder:$t('member.roleIds')}"></CheckBox> -->
              </el-form-item>
              <el-form-item :label="$t('member.memberNameLabel')" ref="memberName" prop="memberName">
                <el-input v-model="formData.memberName" :placeholder="$t('member.memberName')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('member.sexLabel')" ref="sex" prop="sex">
                <!-- <el-radio-group v-model="formData.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group> -->
                <RadioOpt v-model="formData.sex" :data="codeData.sex"></RadioOpt>
              </el-form-item>
           </el-col>
           <el-col :span="16">
             <el-form-item :label="$t('member.logoImgLabel')" ref="logoImg" prop="logoImg">
              <UploadImg v-model="formData.logoImg"></UploadImg>
              <div v-if="formData.isface=='1'" @click="shootingClick" v-loading="fullscreenLoading" class="shooting">
                <img :src="shooting" class="shootingIcon">
              </div>
            </el-form-item>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
             <el-form-item :label="$t('member.telLabel')" ref="tel" prop="tel">
              <el-input v-model="formData.tel" :placeholder="$t('member.tel')" :title="$t('member.tel')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="$t('member.passwordLabel')" ref="password" prop="password">
              <el-input v-model="formData.password" autocomplete="new-password" type="password" show-password :placeholder="$t('member.password')" :title="$t('member.password')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
             <el-form-item :label="$t('member.entryDtLabel')" ref="entryDt" prop="entryDt">
              <Day  v-model="formData.entryDt" :placeholder="$t('member.entryDt')" ></Day>
            </el-form-item>
          </el-col>
           <el-col :span="8">
              <el-form-item :label="$t('member.majorLabel')" ref="major" prop="major">
                <el-input v-model="formData.major" :placeholder="$t('member.major')" :title="$t('member.major')"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('member.nationLabel')" ref="nation" prop="nation">
              <el-input v-model="formData.nation" :placeholder="$t('member.nation')" :title="$t('member.nation')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('member.nativePlaceLabel')" ref="nativePlace" prop="nativePlace">
              <el-input v-model="formData.nativePlace" :placeholder="$t('member.nativePlace')" :title="$t('member.nativePlace')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('member.birthDtLabel')" ref="birthDt" prop="birthDt">
              <Day  v-model="formData.birthDt" :placeholder="$t('member.birthDt')" ></Day>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('member.idCardLabel')" ref="idCard" prop="idCard">
              <el-input v-model="formData.idCard" :placeholder="$t('member.idCard')" :title="$t('member.idCard')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('member.politicalOutlookLabel')" ref="politicalOutlook" prop="politicalOutlook">
              <SelectOpt v-model="formData.politicalOutlook" :required="false" :data="codeData.politicalOutlook" :placeholder="$t('member.politicalOutlook')"></SelectOpt>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('member.marriageStatusLabel')" ref="marriageStatus" prop="marriageStatus">
              <SelectOpt v-model="formData.marriageStatus" :required="false" :data="codeData.marriageStatus" :placeholder="$t('member.marriageStatus')"></SelectOpt>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('member.educationLabel')" ref="education" prop="education">
              <el-input v-model="formData.education" :placeholder="$t('member.education')" :title="$t('member.education')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('member.gradSchoolLabel')" ref="gradSchool" prop="gradSchool">
              <el-input v-model="formData.gradSchool" :placeholder="$t('member.gradSchool')" :title="$t('member.gradSchool')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('member.remarkLabel')" ref="remark" prop="remark">
              <el-input type="textarea" class="des" rows="4" v-model="formData.remark" :placeholder="$t('member.remark')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        </el-row>
        <el-form-item>
          <el-button type="primary" class="submit_button" @click="submitForm('formData')">{{$t('form.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
import {clone,getCookie,validateForm,getCode,bindData} from "assets/js/reused";
import UploadImg from "common/UploadImg";
import DatePickerStart from "common/DatePickerStart";
import DatePickerEnd from "common/DatePickerEnd";
import SelectOpt from "common/SelectOpt";
import CheckBox from "common/CheckBox";
import FormItem from "common/FormItem";
import {campusFind} from "assets/js/mixin";
import SelectMultiple from "common/SelectMultiple";
import Day from "common/Day";
import RadioOpt from "common/RadioOpt";
import {getAreaIds,getCampusVods} from "assets/js/common";
import {
  validatePhone,
  validateCard,
  validateIdCard,
  validateAccount,
  validatePassword
} from "assets/js/vuelidate";
export default {
  components: { UploadImg,DatePickerStart,DatePickerEnd,SelectOpt,CheckBox,SelectMultiple,Day,FormItem,RadioOpt},
  mixins:[campusFind],
  name: 'editMember',
  data() {
    return {
      formData: {
        memberName:null,
        logoImg:null,
        politicalOutlook:null,
        nation:null,
        nativePlace:null,
        education:null,
        major:null,
        gradSchool:null,
        marriageStatus:null,
        birthDt:null,
        idCard:null,
        tel:null,
        sex:1,
        password:null,
        account:null,
        positionId:null,
        campusId:null,
        remark:null,
        contractStartDt:null,
        contractEndDt:null,
        salaryBank:null,
        contractRelations:null,
        idCard:null,
        positionStatus:null,
        socialSecurityStatus:null,
        entryDt:null,
        nationPlaceLabel:null,
        contractNum:null,
        salaryName:null,
        salaryNum:null,
        contractStatus:null,
        roleId:null
      },
      showPlane:false,
      isManage:false,
      codeData:{},
      roleIds:[],
      rules: {
        areaIds:[
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          }
        ],
        memberName: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          }
        ],
        account: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          },
          {
            validator: validateAccount,
            trigger: "blur"
          }
        ],
        campusIds:[
          {
            message:this.$t('form.required'),
            required:true,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          },
          {
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        roleIds: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }
        ],
        salaryNum: [
          {
            validator: validateCard,
            trigger: "blur"
          }
        ],
        password:[
          {
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        leaveCntRadio: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }
        ],
        sex: [
          {
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }
        ]
      },
    };
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      this.codeData=await getCode("campus,role,position,_marriage_status,_social_security_status,_contract_relations,_contract_status,_political_outlook,_position_status,_sex");
      let memberData=await post("member/find",{
        memberId:this.$route.query.memberId
      }); 
      bindData({
        formData:this.formData,
        res:memberData
      })
      this.formData.password=null;
      this.$nextTick(()=>{
        this.formData.campusIds=memberData.campusIds;
      })
    },
    showMore(){
      this.showPlane=!this.showPlane;
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      formData.memberId=this.$route.query.memberId;
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "member/edit",
        success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
        }
      });
    },
    change(){
      this.$refs.logImg.clearValidate();
    },
    handleResult(v){
      this.$refs.map.search(v)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};

</script>
