<template>
    <el-upload
        class="avatar-uploader"
        :action="uploadUrl()"
        :http-request="uploadFile"
        :show-file-list="false"
        :on-error="handleAvatarError"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
     <!-- :on-success="handleAvatarSuccess" -->
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
import * as qiniu from "qiniu-js";
import {getCookie,isEmpty,getLocal} from 'assets/js/reused';
import md5 from "md5";
export default {
  props: {
    newPic: String,
    value:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      imageUrl: "",
      imgToken: "",
      key:"",
      isUpload:false
    };
  },
  watch: {
    value(newV,oldV){
      console.log(newV)
      if(isEmpty(newV)){
        this.imageUrl="";
        return
      }
      //上传成功的就显示blob图片,否则显示七牛云的图片
      if(!this.isUpload){
        if(newV.search(/(blob|http)/)>-1){
          this.imageUrl=newV;
        }else{
          this.imageUrl=getLocal("imgUrl")+newV;
        }
        if(newV.search("http")>-1){
          this.$emit("input",newV.split(/http[\s\S]*com\//)[1])
        }
        
      }
    }
  },
  methods: {
    uploadUrl() {
      return baseURL + "file/upload";
    },
    getToken() {
      return new Promise(async (resolve, reject) => {
         this.imgToken=await post("system/findimguptoken",{},"common");
         resolve("")
      });
    },
    setImgUrl(newV){
      if(newV&&newV.search(/^\/[\s\S]+.[\s\S]+/)>-1){
          this.imageUrl=getCookie("imgOrVideo").imgUrl+newV;
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit("pic",this.key);
    },
    async uploadFile(config) {
      await this.getToken();
      let upfileConfig = {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6,
        region: qiniu.region.z0
      };
      let fileName = config.file&&config.file.name;
      fileName=getCookie("suffix")+"/"+md5(fileName.match(/^([\s\S]+)\.\b/)[1])+new Date().getTime().toString()+parseInt(Math.random()*10).toString()+'.'+fileName.match(/\.(\w+)$/)[1];
      let putExtra = {
        fname: fileName,
        params: {},
        mimeType: ["image/png", "image/jpeg", "image/gif"]
      };
      let token=this.imgToken;
      let observable = qiniu.upload(
        config.file,
        fileName,
        token,
        putExtra,
        upfileConfig
      );
      observable.subscribe({
        next: ((res)=>{
          if(res.total){
            config.onProgress(res.total)
          }
        }),
        error: ((res)=>{
          this.$alert(res.message, "错误提示")
        }),
        complete: ((res)=>{
          this.key=res.key;
          this.isUpload=true;
          this.$emit("input",this.key);
          this.$emit("change",this.key);
          this.imageUrl = URL.createObjectURL(config.file);
        })
        });
    },
    beforeAvatarUpload(file) {
      let fileType=["jpeg","png","gif","jpg"];
      let uploadFormat=false;
      if(!fileType.includes((file.name.split(".")[file.name.split(".").length-1]).toLowerCase())){
            this.$alert("上传格式只能是jpeg,png,gif格式!", "错误提示")
          uploadFormat=false;
      }else{
          uploadFormat=true;
      }
      return uploadFormat;
    },
    handleAvatarError(err) {
      this.$message.error("上传头像图片失败");
    }
  }
};
</script>