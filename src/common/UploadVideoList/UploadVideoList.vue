<template lang='html'>
    <div>
         <el-upload
                ref="upload"
                :action="uploadUrl()"
                :http-request="uploadFile"
                list-type="picture-card"
                :disabled="disabledBool"
                :on-success="successUP"
                :on-error="errorUP"
                :on-preview="handlePictureCardPreview"
                :file-list="formData.fileList"
                :before-upload="beforeVideoUpload"
                :on-change="changeFile"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible"
                   :before-close="handleClose" 
                >
                <!-- <iframe width="100%" class="dialogFrame" :src="dialogVideoUrl" alt="">
                    </iframe> -->
                     <video class="video" controls="controls" style="max-width:100%;margin: 0 auto;display: block;" name="media">
                        您的浏览器不支持 video 标签。
                        <source :src="dialogVideoUrl" type="video/ogg" />
                        <source :src="dialogVideoUrl" type="video/mp4" />
                    </video>
                </el-dialog>
    </div>
</template>
<script>
import * as qiniu from "qiniu-js";
import { getCookie } from "assets/js/reused";
import md5 from "md5";
export default {
  name: "UploadVideoList",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      disabledBool: false,
      formData: {
        fileList: []
      },
      fileList:[],
      videoToken: "",
      dialogVideoUrl: "",
      dialogVisible: false,
    };
  },
  watch: {
    value(newV, oldV) {
      this.formData.fileList = [];
      if (newV.length > 0) {
        newV.split(",").map(item => {
          this.formData.fileList.push({
            name: item,
            url:
              getCookie("imgOrVideo").vodIfrUrl +
              item +
              "?vframe/png/offset/1/w/920/h/920"
          });
        });
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.formData.fileList.map((item, index) => {
        if (item.url == file.url) {
          this.formData.fileList.splice(index, 1);
        }
      });
      this.$emit("input", this.uploadFormat(this.formData.fileList));
    },
    changeFile(v){
      console.log(v)
    },
    handlePictureCardPreview(file) {
      this.dialogVideoUrl = getCookie("imgOrVideo").vodIfrUrl + file.name;
      this.dialogVisible = true;
    },
    uploadUrl() {
      return baseURL + "file/upload";
    },
    getToken() {
      return new Promise(async (resolve, reject) => {
        this.videoToken=await post("system/findvoduptoken",{},"common");
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit("pic", this.key);
    },
    uploadFormat(data) {
      let arr = [];
      data.map(item => {
        arr.push(item.name);
      });
      return arr.toString();
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
      fileName =getCookie("suffix")+"/"+md5(fileName.match(/^([\s\S]+)\.\b/)[1])+new Date().getTime().toString()+parseInt(Math.random()*10).toString()+'.'+fileName.match(/\.(\w+)$/)[1];
      let putExtra = {
        fname: fileName,
        params: {},
        mimeType: ["video/mp4", "video/quicktime", "video/rmvb", "video/avi"]
      };
      let token = this.videoToken;
      let observable = qiniu.upload(
        config.file,
        fileName,
        token,
        putExtra,
        upfileConfig
      );
      this.fileList.push({
        name:fileName
      })
      observable.subscribe({
        next: res => {
          if(res.total){
            config.onProgress(res.total);
          }
        },
        error: res => {
          this.$alert(res.message, "错误提示");
        },
        complete: res => {
          console.log(res)
          this.key = res.key;
          this.fileList.map((element,index)=>{
            if(element.name===res.key){
              this.fileList.splice(index,1,{
                name: res.key,
                url:
                  getCookie("imgOrVideo").vodIfrUrl +
                  res.key +
                  "?vframe/png/offset/1/w/920/h/920"
              })
            }
          })
          this.formData.fileList=this.fileList;
          this.$emit("input", this.uploadFormat(this.formData.fileList));
          this.$emit("change", this.uploadFormat(this.formData.fileList))
        }
      });
    },
    beforeVideoUpload(file) {
      let fileType = ["mp4", "mov", "rmvb", "avi"];
      let uploadFormat = false;
      if (
        !fileType.includes(
          file.name.split(".")[file.name.split(".").length - 1].toLowerCase()
        )
      ) {
        this.$alert("上传格式只能是mp4,mov,rmvb,avi格式!", "错误提示");
        uploadFormat = false;
      } else {
        uploadFormat = true;
      }
      return uploadFormat;
    },
    handleClose() {
      this.dialogVisible = false;
      document.querySelector(".video").pause();
    },
    successUP(response, file, fileList) {
      console.log("成功");
      console.log(response);
    },
    errorUP(response, file, fileList) {
      console.log("失败");
      console.log(response);
    }
  }
};
</script>
<style scoped>
.dialogFrame {
  width: 100%;
  min-height: 500px;
}
</style>