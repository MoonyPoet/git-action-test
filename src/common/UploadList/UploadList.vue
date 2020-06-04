<template lang='html'>
     <div class='upload_list'>
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
            <el-form-item label="班级风采图">
                <el-upload
                    class="upload-demo"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :action="uploadUrl()"
                    :http-request="uploadFile"
                    :show-file-list="true"
                    :on-error="handleError"
                    :before-upload="beforeUpload"
                    :on-change="handleChange"
                    :file-list="formData.fileList"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div> -->
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import * as qiniu from "qiniu-js";
import {getCookie} from "assets/js/reused";
import md5 from "md5";
export default {
  props:{
    imageList:Array
  },
  data() {
    return {
      formData: {
        fileList: [],
      },
      token:"",
      rules:{}
    };
  },
  watch:{
    imageList(newV,oldV){
      console.log(newV)
      if(newV&&newV.length>0){
        console.log(newV)
        this.formData.fileList=newV;
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadUrl() {
      return baseURL + "file/upload";
    },
    getToken() {
      return new Promise(async (resolve, reject) => {
        this.token=await post("system/findimguptoken",{},"common");
        resolve("")
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl);
    },
    async uploadFile(config) {
      await this.getToken();
      let upfileConfig = {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6,
        region: qiniu.region.z0
      };
      let fileName = config.file && config.file.name;
      fileName=getCookie("suffix")+"/"+md5(fileName.match(/^([\s\S]+)\.\b/)[1])+new Date().getTime().toString()+parseInt(Math.random()*10).toString()+'.'+fileName.match(/\.(\w+)$/)[1];
      let putExtra = {
        fname: fileName,
        params: {},
        mimeType: ["image/png", "image/jpeg", "image/gif"]
      };
      console.log(this.token);
      let token = this.token;
      let observable = qiniu.upload(
        config.file,
        fileName,
        token,
        putExtra,
        upfileConfig
      );
      observable.subscribe({
        next: res => {
          console.log(res);
        },
        error: res => {
          console.log(res);
        },
        complete: res => {
          this.key = res.key;
          this.formData.fileList.push(getCookie("imgOrVideo").vodIfrUrl+res.key);
          this.$emit("fileList",this.formData.fileList)
        }
      });
    },
    submit(callback){
      this.$refs["formData"].validate((valid,prop)=>{
        callback(valid,this.formData,prop)
      })
    },
    beforeUpload(file) {
      let fileType=["jpeg","png","gif","jpg"];
      let uploadFormat=false;
      if(!fileType.includes(file.name.split(".")[1])){
            this.$alert("上传格式只能是jpeg,png,gif格式!", "错误提示")
            return
      }else{
          uploadFormat=true;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return uploadFormat && isLt5M;
    },
    handleError(err) {
      this.$message.error("上传图片失败");
    },
    handleChange(v){
        console.log(v)
    }
  }
};
</script>
<style lang="scss">
.upload_list {
  .el-form-item__content {
    width: 300px;
  }
}
</style>
