<template>
    <div>
        <basic-container>
        <el-form  :model="formData" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
          <!--  -->
            <el-form-item v-for="(item,index) in formData.wxConfig" :prop="'wxConfig.'+index+'.configValue'" :rules="[{required:true,message:'必填',trigger:'blur'}]"  :label="item.configKey" :key="item.id">
              <el-input v-model="formData.wxConfig[index].configValue"></el-input>
            </el-form-item>
            <!-- <el-form-item label="微信名称" prop="wx_name">
            <el-input v-model="formData.wx_name"></el-input>
            </el-form-item>
            <el-form-item label="微信appid" prop="wx_appid">
            <el-input v-model="formData.wx_appid"></el-input>
            </el-form-item>
            <el-form-item label="微信appsecret" prop="wx_appsecret">
            <el-input v-model="formData.wx_appsecret"></el-input>
            </el-form-item>
            <el-form-item label="微信mp_verify" prop="wx_mp_verify">
            <el-input v-model="formData.wx_mp_verify"></el-input>
            </el-form-item>
            <el-form-item label="微信支付mchid" prop="wx_mp_verify">
            <el-input v-model="formData.wxx_appid"></el-input>
            </el-form-item>
            <el-form-item label="微信支付key" prop="wx_mp_verify">
            <el-input v-model="formData.wxx_appid"></el-input>
            </el-form-item>
            <el-form-item label="支付授权目录" prop="wx_mp_verify">
            <el-input v-model="formData.wxx_appid"></el-input>
            </el-form-item> -->
            <el-form-item>
            <el-button type="primary" class="submitButton" @click="submitForm('formData')">修改</el-button>
            </el-form-item>
        </el-form>
        </basic-container>
    </div>
</template>
<script>
import BasicContainer from '@vue-materials/basic-container';
import {getCookie,clone,getTableSectionData} from "assets/js/reused";
export default {
  components: { BasicContainer },
  name: 'WxConfig',

  data() {
    return {
      formData:{
        wxConfig:[]
      },
      url:location.host+"/weixin",
      rules: {
      },
    };
  },
  created(){
    this.getConfigInfo()
  },
  computed:{
    isMiniprogram(){
      if(this.$store.getters&&this.$store.getters.baseInfo){
        return this.$store.isMiniprogram===1?true:false;
      }
    }
  },
  methods: {
    submitForm(formName) {
      let tableData=clone(this.formData.wxConfig);
      let formData=getTableSectionData({tableData:tableData,itemName:["configKey","configValue","merchantConfigId"]});
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post({
            url:baseURL+"institution/config_edit",
            data:formData,
            success:(res)=>{
                this.$message({
                  message:res.message,
                  type: 'success'
                })
                this.getConfigInfo()
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
   async getConfigInfo(){
     let config=await post("institution/config");
     this.formData.wxConfig=config.filter((item)=>((item.configKey!=="wx_jsapi_ticket")&&(item.configKey!=="wx_api_access_token")&&(item.configKey!=="wx_template")));
    }
  },
};

</script>

<style lang="scss" scoped>
  .el-input {
        width: 300px;
    }
</style>

