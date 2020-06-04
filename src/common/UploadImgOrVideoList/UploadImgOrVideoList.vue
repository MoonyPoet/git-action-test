<template lang='html'>
    <div>
        <el-form ref="formData" :model="formData" label-width="200px" label-position="left">
            <el-form-item label="上传视频或图片">
                <el-upload
                    class="upload_demo"
                    :action="uploadUrl()"
                    :on-success="successUP"
                    :on-error="errorUP"
                    before-upload="beforeUp"
                    :http-request="uploadFile"
                    :on-remove="handleRemove"
                    :file-list="formData.fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png/mp4文件</div>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import * as qiniu from "qiniu-js";
import md5 from "md5";
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      formData: {
        fileList: []
      },
      imgOrVideoToken: ""
    };
  },
  watch: {
    value(newV, oldV) {
      this.formData.fileList = newV;
    }
  },
  methods: {
    uploadUrl() {
      return baseURL + "file/upload";
    },
    handleRemove(file, fileList) {
      this.formData.fileList.map((item, index) => {
        if (item.url == file.url) {
          this.formData.fileList.splice(index, 1);
        }
      });
      this.$emit("input", this.formData.fileList);
    },
    getToken() {
      return new Promise(async (resolve, reject) => {
         this.imgOrVideoToken=await post("system/findvoduptoken",{},"common");
      });
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
        mimeType: ["image/png", "image/jpeg", "image/gif", "video/mp4"]
      };
      let token = this.imgOrVideoToken;
      let observable = qiniu.upload(
        config.file,
        fileName,
        token,
        putExtra,
        upfileConfig
      );
      observable.subscribe({
        next: res => {
        },
        error: res => {
        },
        complete: res => {
          // this.key=res.key;
          // this.$emit("pic",this.key);
          this.formData.fileList.push({
            name: res.key,
            url: res.hash
          });
          this.$emit("input", this.formData.fileList);
        }
      });
    },
    beforeUp(file){
        console.log("进来");
        
        console.log(file);
        
    },
    successUP(response, file, fileList){
        console.log("成功");
        console.log(response);
        
    },
       errorUP(response, file, fileList){
        console.log("失败");
        console.log(response);
        
    },
  }
};
</script>
<style scoped>
.upload_demo {
  width: 300px;
}
</style>