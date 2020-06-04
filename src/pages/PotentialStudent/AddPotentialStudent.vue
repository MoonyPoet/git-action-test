<template lang='html'>
  <div class="add_crm_client">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form" :validate-on-rule-change="false">
        <el-form-item :label="$t('student.cityLabel')" prop="areaId">
          <SelectOpt v-model="formData.areaId" @change="(v)=>getAreaId(v,'campusIds')" ref="areaId" :data="codeData.area" :placeholder="$t('student.city')"></SelectOpt>
        </el-form-item>
        <el-form-item :label="$t('student.campusIdLabel')">
          <SelectOpt v-if="formData.areaId!==''" @change="getCampusId" v-model="formData.campusId" ref="campusIds" :data="campusData" :placeholder="$t('student.campusId')"></SelectOpt>
        </el-form-item>
        <el-row style="margin:10px 0px;">
          <el-col :span="1" style="height:1px;">
          </el-col>
          <el-col :span="2" class="linear">
            {{$t('student.personalInfoLabel')}}
          </el-col>
          <el-col :span="21"><span class="linear_span"></span></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('student.stuNameLabel')" ref="stuName" prop="stuName">
              <el-input v-model="formData.stuName" :placeholder="$t('student.stuName')" :title="$t('student.stuName')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('student.sexLabel')" ref="sex" prop="sex">
             <RadioOpt v-model="formData.sex" :data="codeData.sex"></RadioOpt>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('student.telLabel')" ref="tel" prop="tel">
              <el-input v-model="formData.tel" :placeholder="$t('student.tel')" :title="$t('student.tel')"></el-input>
            </el-form-item>
             <el-form-item :label="$t('student.birthDtLabel')" ref="birthDt" prop="birthDt">
              <Day v-model="formData.birthDt" :placeholder="$t('student.birthDt')" :title="$t('student.birthDt')"></Day>
            </el-form-item>
              <el-form-item :label="$t('student.idcardNumLabel')" ref="idcardNum" prop="idcardNum">
              <el-input v-model="formData.idcardNum" :placeholder="$t('student.idcardNum')" :title="$t('student.idcardNum')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('student.addressLabel')" ref="address" prop="address">
              <el-input v-model="formData.address" :placeholder="$t('student.address')" :title="$t('student.address')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
           <el-form-item :label="$t('student.headImgLabel')" ref="headImg" prop="headImg">
              <UploadImg @change="change" ref="headImg" v-model="formData.headImg"></UploadImg>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:10px 0px;">
          <el-col :span="1" style="height:1px;">
          </el-col>
          <el-col :span="2" class="linear">
            {{$t('student.customerTrackingLabel')}}
          </el-col>
          <el-col :span="21"><span class="linear_span"></span></el-col>
        </el-row>
        <el-row>
           <el-col :span="8">
              <el-form-item :label="$t('student.followMemberIdLabel')" ref="followMemberId" prop="followMemberId">
                <SearchBar link="system/associative" :placeholder="$t('student.followMemberId')" :title="$t('student.followMemberId')" v-model="formData.followMemberId" :nameLike="formData.parentPositionName" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"  :editSearchOpt="true" :isRequired="false"></SearchBar>
              </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item :label="$t('student.crmStageLabel')" prop="crmStage">
                <SelectOpt v-model="formData.crmStage" ref="crmStage" :title="$t('student.crmStage')" :data="codeData.crmStage" :placeholder="$t('student.crmStage')"></SelectOpt>
              </el-form-item>
          </el-col>
        </el-row>
         <el-form-item :label="$t('student.crmSourceLabel')" prop="crmSource">
          <SelectOpt v-model="formData.crmSource" ref="crmSource" :title="$t('student.crmSource')" :data="codeData.crmSource" :placeholder="$t('student.crmSource')"></SelectOpt>
        </el-form-item>
        <el-form-item :label="$t('student.desLabel')" ref="description" prop="description">
          <el-input type="textarea" class="des" rows="4" :title="$t('student.des')" :placeholder="$t('student.des')" v-model="formData.des"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.submit')}}</el-button>
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
    validateForm
  } from "assets/js/reused";
  import {
    validatePhone,
    validateCard,
    validateIdCard,
    validateAccount,
    validatePassword
  } from "assets/js/vuelidate";
  import UploadImg from "common/UploadImg";
  import Day from "common/Day";
  import RadioOpt from "common/RadioOpt";
  import SelectOpt from "common/SelectOpt";
  import SearchBar from "common/SearchBar";
  import {campusFind1} from "assets/js/mixin";
  export default {
    name: "addPotentialStudent",
    mixins:[campusFind1],
    components: {
      UploadImg,
      RadioOpt,
      SelectOpt,
      Day,
      SearchBar
    },
    data() {
      return {
        formData: {
          areaId:null,
          campusId:null,
          address: null,
          birthDt:null,
          headImg:null,
          stuName:null,
          sex:1,
          tel:null,
          school:null,
          des:null,
          iccardNum:null,
          idcardNum:null,
          crmStage:null,
          crmSource:null,
          followMemberId:null
        },
        codeData:{},
        rules: {
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
          crmSource:[{
            required:true,
            message:this.$t('form.required'),
            trigger:"change",
          }],
          crmStage:[{
            required:true,
            message:this.$t('form.required'),
            trigger:"change",
          }]
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        this.codeData=await getCode("campus,_sex,_crm_stage,_crm_source")
        this.$nextTick(()=>{
          this.$refs.areaId.selectDefaultData();
       })
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
      change(){
        this.$refs.headImg.clearValidate();
      },
      getCampusId(v){
      },
      submitForm(formName) {
        let formData = clone(this.formData);
        delete formData['campusIds'];
        delete formData['areaId'];
        delete formData['parentPositionName'];
        validateForm({
            form: this.$refs["formData"],
            formData: formData,
            url: "student/pot_stu_add",
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
  };
</script>