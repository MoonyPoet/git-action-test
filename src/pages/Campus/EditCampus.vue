<template>
    <div class="edit_campus">
        <basic-container>
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('campus.campusNameLabel')" prop="campusName">
                <el-input v-model="formData.campusName" :placeholder="$t('campus.campusName')" :title="$t('campus.campusName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('campus.contackNameLabel')" prop="contackName">
                  <el-input v-model="formData.contackName" :placeholder="$t('campus.contackName')" :title="$t('campus.contackName')"></el-input>
                </el-form-item>
                 <el-form-item :label="$t('campus.contackPhoneLabel')" prop="contackPhone">
                  <el-input v-model="formData.contackPhone" :placeholder="$t('campus.contackPhone')" :title="$t('campus.contackPhone')"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('campus.logoImgLabel')" ref="logoImg" prop="logoImg">
                  <UploadImg @change="change" v-model="formData.logoImg"></UploadImg>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('campus.addressLabel')" prop="address" >
            <el-input v-model="formData.address" :placeholder="$t('campus.address')" :title="$t('campus.address')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('campus.desLabel')" prop="des">
            <el-input v-model="formData.des" class="textarea"  rows="4" type="textarea" :placeholder="$t('campus.des')"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.submit')}}</el-button>
            </el-form-item>
        </el-form>
        </basic-container>
    </div>
</template>
<script>
import BasicContainer from '@vue-materials/basic-container';
import {clone,getCookie,validateForm,bindData} from "assets/js/reused";
import {validatePhone,maxMsg} from "assets/js/vuelidate";
import UploadImg from "common/UploadImg";
export default {
  components: { BasicContainer,UploadImg},
  name: 'editCampus',
  data() {
    return {
      formData: {
        logoImg:"",
        campusName:"",
        contackName:"",
        des:"",
        address:"",
        contackPhone:""
      },
      newArea:[],
      rules: {
        logoImg:[
          { required: true, message: this.$t("form.required"), trigger: 'change' },
        ],
        campusName:[
          { required: true, message:this.$t("form.required"), trigger: 'blur' },
        ],
        contackName: [
          { required: true, message: this.$t("form.required"), trigger: 'blur' },
          {max:10,message:maxMsg(10)}
        ],
        contackPhone:[
          { required:true,message:this.$t("form.required"),trigger:'blur'},
          { validator:validatePhone, trigger: 'blur'}
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
    async find(){
      let campusData=await post("campus/find",{
        campusId:this.$route.query.campusId
      })
      campusData.areaNum=Number(campusData.areaNum)
      this.newArea=[campusData.provinceNum,campusData.cityNum,campusData.areaNum];
      bindData({
        formData:this.formData,
        res:campusData
      })
    },
    dataLoaded(){
      this.init()
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      formData.campusId=this.$route.query.campusId;
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "campus/edit",
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
      this.$refs.logoImg.clearValidate();
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
<style lang="scss" scoped>
.editCampus{
}
</style>
