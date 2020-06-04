<template lang='html'>
    <div>
       <el-upload
                :action="uploadUrl()"
                :http-request="uploadFile"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :file-list="formData.fileList"
                :before-upload="beforeImgUpload"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
       </el-dialog>
    </div>
</template>
<script>
import * as qiniu from "qiniu-js";
import {getCookie} from "assets/js/reused";
import md5 from "md5";
  export default {
    name:"UploadImgList",
    props:{
        value:{
            type:String,
            default:""
        },
        label:{
            type:String,
            default:"图片"
        },
        required:{
            type:Boolean,
            default:false
        },
        isForm:{
            type:Boolean,
            default:true
        }
    },
    data() {
      return {
        formData:{
            fileList:[]
        },
        dialogImageUrl: '',
        dialogVisible: false
      };
    },
    watch:{
        value(newV,oldV){
            this.formData.fileList=[];
            if(newV.length>0){
                newV.split(",").map((item)=>{
                    this.formData.fileList.push({
                        name:item,
                        url:getCookie("imgOrVideo").imgUrl+item
                    })
                })
            }
        }
    },
    methods: {
      handleRemove(file, fileList) {
         this.formData.fileList.map((item,index)=>{
            if(item.url==file.url){
                this.formData.fileList.splice(index,1);
            }
        })
        this.$emit("input",this.uploadFormat(this.formData.fileList))
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadUrl() {
        return baseURL + "file/upload";
      },
      getToken() {
        return new Promise(async (resolve, reject) => {
            this.imgToken=await post("system/findimguptoken",param,"common");
            resolve("")
        });
        },
       handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$emit("pic",this.key);
        },
       async uploadFile(config) {
        await this.getToken()
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
                this.formData.fileList.push({
                    name:res.key,
                    url:getCookie("imgOrVideo").imgUrl+res.key
                })
                this.$emit("input",this.uploadFormat(this.formData.fileList))
             })
            });
        },
        uploadFormat(data){
            let arr=[];
            data.map((item)=>{
                arr.push(item.name)
            })
            return arr.toString()
        },
       beforeImgUpload(file) {
        let fileType=["jpeg","png","gif","jpg"];
        let uploadFormat=false;
        if(!fileType.includes((file.name.split(".")[file.name.split(".").length-1]).toLowerCase())){
             this.$alert("上传格式只能是jpeg,png,gif格式!", "错误提示")
            uploadFormat=false;
        }else{
            uploadFormat=true;
        }
        // if (!isLt2M) {
        //     this.$message.error("上传图片大小不能超过 5MB!");
        // }
        return uploadFormat;
        },
    }
  }
</script>