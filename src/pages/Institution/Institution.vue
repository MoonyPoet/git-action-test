<template>
    <div class="institution">
        <el-form :model="formData" refs="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('institution.institutionNameLabel')" prop="institutionName">
                <el-input v-model="formData.institutionName" :placeholder="$t('institution.institutionName')" :title="$t('institution.institutionName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('institution.addressLabel')" ref="address" prop="address">
                <el-input v-model="formData.address" :placeholder="$t('institution.address')" :title="$t('institution.address')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('institution.contackNameLabel')" prop="contackName">
                  <el-input v-model="formData.contackName" :placeholder="$t('institution.contackName')" :title="$t('institution.contackName')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('institution.logoImgLabel')" ref="logoImg" prop="logoImg">
                  <UploadImg @change="change" v-model="formData.logoImg"></UploadImg>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('institution.contackPhoneLabel')" prop="contackPhone">
              <el-input v-model="formData.contackPhone" :placeholder="$t('institution.contackPhone')" :title="$t('institution.contackPhone')"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('institution.trainIdsLabel')" prop="trainIds">
              <template v-for="(element,index) in trainData" >
                <CheckBox v-model="formData.trainIds[index]" :key="element.id" :bindOptions='{
                    data:element,
                    key:"trainId",
                    val:"trainName",
                    isShowCheckAll:false,
                  }'></CheckBox>
              </template>
            </el-form-item> -->
            </el-form-item>
            <el-form-item :label="$t('institution.desLabel')" prop="des">
              <Editor v-model="formData.des" class="textarea"  rows="4" type="textarea" :placeholder="$t('institution.des')" :title="$t('institution.des')"></Editor>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.edit')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Address from 'common/Address';
import {clone,getCookie,bindData,validateForm,isEmpty} from "assets/js/reused";
import {validatePhone,maxMsg} from "assets/js/vuelidate";
import UploadImg from "common/UploadImg";
import CheckBox from "common/CheckBox";
import Editor from "common/Editor";
import * as R from "ramda";
export default {
  components: {Address,CheckBox,UploadImg,Editor},
  name: 'institution',
  data() {
    return {
      formData: {
        institutionName:"",
        logoImg:"",
        contackName:"",
        des:"",
        address:"",
        contackPhone:"",
        // trainIds:[]
      },
      trainData:[],
      newArea:[],
      rules: {
        logoImg:[
          { required: true, message: this.$t("form.required"), trigger: 'change' },
        ],
        institutionName:[
          { required: true, message: this.$t("form.required"), trigger: 'blur' },
        ],
        contackName: [
          { required: true, message: this.$t("form.required"), trigger: 'blur' },
          {max:10,message:maxMsg(10)}
        ],
        contackPhone:[
          { required:true,message:this.$t("form.required"),trigger:'blur'},
          { validator:validatePhone, trigger: 'blur'}
        ],
        address:[
          { required:true,message:this.$t('form.required'),trigger:'change'}
        ],
        trains:[
          {required:true,message:this.$t('form.required'),trigger:"change"}
        ]
      },
    };
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      this.find()
    },
    dataLoaded(){
      this.init()
    },
    async find(){
      let institutionData=await post("institution/detail",{
        insId:getCookie("insId")
      })
      bindData({
        formData:this.formData,
        res:institutionData
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      formData.institutionId=getCookie("insId");
      // formData.trainIds=R.unnest(formData.trainIds).toString();
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "institution/edit",
        success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
        }
      });
    },
    change(){
      this.$refs.logoImg.clearValidate();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};

</script>
<style lang="scss" scoped>
/deep/.el-checkbox-group{
  width: 900px;
}
</style>

