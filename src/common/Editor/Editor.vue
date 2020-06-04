<template lang='html'>
    <div class='editor'>
       <quillEditor class="quillEditor" v-model="formData.content"
                        ref="quillEditor"
                        :options="editorOption"
                        :placeholder="placeholder"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
        </quillEditor>
        <textarea class="code_edit" readonly :value="formData.content" @input="codeInput"></textarea>
        <input style="display:none" type="file" id="uploadImg">
        <input style="display:none" type="file" id="uploadVideo">
        <div class="editor_dailog" v-show="showEditorSize">
            <div class="width"><span>宽</span><input type="text" v-model="uploadOption.width">px</div>
            <div class="height"><span>高</span><input type="text" v-model="uploadOption.height">px</div>
            <div><button id="setOption" @click.prevent="saveOption">设置</button></div>
        </div>
    </div>
</template>
<script>
    // 为解决现阶段资源优化问题,暂时隐掉
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import * as qiniu from "qiniu-js";
    import {clone,getCookie} from 'assets/js/reused';
    import { quillEditor,Quill  } from 'vue-quill-editor';
    import md5 from "md5";
     export default {
        name: 'editor',
        props:{
            value: { // 必须要使用value
    　　　　　default: '',
    　　　　 },
            placeholder:{
                type:String,
                default:"请输入",
            },
            editContent:String,
            isCheck:{
                type:Boolean,
                default:true
            }, //是否需要验证,
            imgHidden:{
                type:Boolean,
                default:false
            },
            videoHidden:{
                type:Boolean,
                default:false
            },
            width:{
                type:String,
                default:"200px"
            }
        },
        components: {
            quillEditor
        },
        data () {
            return {
                formData:{
                    content: ''
                },
                uploadOption:{
                    width:"",
                    height:""
                },
                label:"",
                rules: {},
                showEditorSize:false,
                imgToken:"",
                videoToken:"",
                curElement:null,
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['clean']
                            ['html']
                            // ['xxx']
                            ],
                        // imageResize: {
						// 	displaySize: true
						// }
                    },
                   placeholder: '请输入...'
                },
                openHtml:false
            }
        },
        watch:{
            editContent(newV,oldV){
                this.formData.content=newV;
            },
            value(newV,oldV){
                // this.formData.content=newV;
                if (this.$refs.quillEditor.quill) {
                    if (newV && newV !==this.formData.content) {
                    this.formData.content = newV;
                    this.$refs.quillEditor.quill
                        .setContents(this.$refs.quillEditor.quill.clipboard.convert(newV));
                    } else if (!newV) {
                        this.$refs.quillEditor.quill.setText('');
                    }
                }
            },
            formData:{
                handler(newV,oldV){
                    this.$emit("input",this.formData.content)
                },
                immediate: true,
                deep: true
            }
        },
        created(){
            this.$nextTick(()=>{
            let htmlBar=document.querySelector(".ql-html");
               htmlBar.innerHTML="HTML";
               htmlBar.addEventListener("click",this.codeHander)
            })
            this.editorOption.modules.toolbar[6]=[];
            this.editorOption.modules.toolbar[6].push("html");
            this.editorOption.modules.toolbar[7]=[];
            if(this.imgHidden==false){
                this.editorOption.modules.toolbar[7].push("image");
            }
            if(this.videoHidden==false){
                this.editorOption.modules.toolbar[7].push("video");
            }
            this.getImgToken()
            this.getVideoToken()
            //是否需要验证
            if(this.isCheck==false){
                this.rules={};
            }
        },
        mounted(){
            this.$refs.quillEditor.quill.getModule("toolbar").addHandler("image", this.imgHandler)
            this.$refs.quillEditor.quill.getModule("toolbar").addHandler("video", this.videoHandler)
            let editor=document.querySelector(".ql-editor");
            let dialog=document.querySelector(".editor_dailog");
            editor.onclick=(e)=>{
                 e.stopPropagation();
                if(e.target.toString()==="[object HTMLImageElement]"){
                    // dialog.style.top=(e.pageY-this.getOffset(editor).top)+"px";
                    // dialog.style.left=(e.pageX-this.getOffset(editor).left)+"px";
                    this.showEditorSize=true;
                    this.curElement=e.target;
                    this.uploadOption.width=this.curElement.offsetWidth;
                    this.uploadOption.height=this.curElement.offsetHeight;
                }else{
                    this.showEditorSize=false;
                }
            }
            document.body.onclick=(e)=>{
                e.stopPropagation();
                this.showEditorSize=false;
                 if(this.hasParent(e.target,dialog)){
                    this.showEditorSize=true;
                }else{
                    this.showEditorSize=false;
                }
            }
        },
        methods:{
            onEditorBlur(quill) {
                // this.$refs["formData"].validate((valid,prop)=>{
                //     callback(valid,formData,prop)
                // })
            },
            onEditorFocus(quill) {
             
            },
            onEditorReady(quill) {
              
            },
            submit(callback){
                let formData=clone(this.formData);
                this.$refs["formData"].validate((valid,prop)=>{
                    callback(valid,formData,prop)
                })
            },
            getImgToken() {
                return new Promise(async(resolve, reject) => {
                    // this.$axios.post({
                    // url: baseURL + "system/findimguptoken",
                    // data: {},
                    // success: res => {
                    //     this.imgToken = res.data;
                    // }
                    // });
                    this.imgToken=await post("system/findimguptoken",{},"common");
                });
            },
            getVideoToken() {
                return new Promise(async (resolve, reject) => {
                    this.videoToken=await post("system/findvoduptoken",{},"common");
                });
            },
            hasParent(obj1,parent){
                let isHas=false;
                function hasParentElement(obj,parent){
                    if((obj.className&&obj.className)===(parent.className&&parent.className)){
                        isHas=true;
                    }else{
                        if(obj.parentElement===null){
                            isHas=false;
                        }else{
                            hasParentElement(obj.parentElement,parent)
                        }
                    }
                }
                hasParentElement(obj1,parent)
                return isHas;
            },
            saveOption(){
                if(/^\d*$/.test(this.uploadOption.width)&&/^\d*$/.test(this.uploadOption.height)){
                    this.curElement.setAttribute("width",this.uploadOption.width);
                    this.curElement.setAttribute("height",this.uploadOption.height);
                }else{
                    this.$alert("宽高只能是正整数", "错误提示")
                    return
                } 
            },
            imgHandler(image){
                // this.$refs.quillEditor.quill.getSelection()
                if (image) {
                    var fileInput = document.getElementById("uploadImg") //隐藏的file文本ID
                    let quill=this.$refs.quillEditor.quill;
                    fileInput.click() //加一个触发事件
                    fileInput.onchange = async () => {
                        const file = fileInput.files[0];
                        let fileType=["jpeg","png","gif","jpg"];
                        if(!fileType.includes((file.name.split(".")[file.name.split(".").length-1]).toLowerCase())){
                            this.$alert("上传格式只能是jpeg,png,gif格式!", "错误提示")
                            return
                        }
                        const res = await this.uploadImg(file); 
                        let length = quill.getSelection().index;
                        quill.insertEmbed(length, 'image',res )
                        quill.setSelection(length + 1)
                          //置空
                        fileInput.value="";
                    }
                }
            },
            getOffset(obj){
                let left=0,top=0;
                function computeOffset(obj){
                     if(obj.offsetParent!==null){
                        left+=obj.offsetLeft;
                        top+=obj.offsetTop;
                        computeOffset(obj.offsetParent)
                    }else{
                        return
                    }
                }
                computeOffset(obj);
                return {
                    left:left,
                    top:top
                }
            },
            videoHandler(video){
                if (video) {
                    var fileInput = document.getElementById("uploadVideo") //隐藏的file文本ID
                    let quill=this.$refs.quillEditor.quill;
                    fileInput.click() //加一个触发事件
                    fileInput.onchange = async () => {
                        const file = fileInput.files[0];
                        let fileType = ["mp4", "mov", "rmvb", "avi"];
                        if (
                            !fileType.includes(
                            file.name.split(".")[file.name.split(".").length - 1].toLowerCase()
                            )
                        ) {
                            this.$alert("上传格式只能是mp4,mov,rmvb,avi格式!", "错误提示");
                            return
                        }
                        const res = await this.uploadVideo(file); 
                        let length = quill.getSelection().index;
                        quill.insertEmbed(length, 'video', res);
                        quill.setSelection(length + 1);
                        //置空
                        fileInput.value="";
                    }
                    
                }
            },
            codeHander(){
                if(this.openHtml===false){
                    document.querySelector(".code_edit").style.display="block";
                    document.querySelector(".ql-editor").style.display="none";
                    this.openHtml=true;
                }else{
                    document.querySelector(".code_edit").style.display="none";
                    document.querySelector(".ql-editor").style.display="block";
                    this.$refs.quillEditor.quill.update();
                    this.openHtml=false;
                }
               
            },
            codeInput(v){
                document.querySelector(".code_edit").focus();
                this.formData.content=v.srcElement.value;
            },
            uploadImg(config){
                return new Promise((resolve,reject)=>{
                    let upfileConfig = {
                        useCdnDomain: true,
                        disableStatisticsReport: false,
                        retryCount: 6,
                        region: qiniu.region.z0
                    };
                    let fileName = config&&config.name;
                    fileName=getCookie("suffix")+"/"+md5(fileName.match(/^([\s\S]+)\.\b/)[1])+new Date().getTime().toString()+parseInt(Math.random()*10).toString()+'.'+fileName.match(/\.(\w+)$/)[1];
                    let putExtra = {
                        fname: fileName,
                        params: {},
                        mimeType: ["image/png", "image/jpeg", "image/gif"]
                    };
                    let token=this.imgToken;
                    let observable = qiniu.upload(
                        config,
                        fileName,
                        token,
                        putExtra,
                        upfileConfig
                    );
                    observable.subscribe({
                        next: ((res)=>{
                            this.$message({
                                message: '上传中'
                            });
                        }),
                        error: ((res)=>{
                            this.$alert(res.message, "错误提示")
                        }),
                        complete: ((res)=>{
                            this.key=res.key;
                            this.$message({
                                    message: '上传图片成功',
                                    type: 'success'
                                });
                            resolve(getCookie("imgOrVideo").imgUrl+res.key)
                        })
                    });
                })
                
            },
            uploadVideo(config){
                if(config.name)
                return new Promise((resolve,reject)=>{
                let upfileConfig = {
                    useCdnDomain: true,
                    disableStatisticsReport: false,
                    retryCount: 6,
                    region: qiniu.region.z0
                };
                let obj;
                let fileName = config&&config.name;
                    fileName=getCookie("suffix")+"/"+md5(fileName.match(/^([\s\S]+)\.\b/)[1])+new Date().getTime().toString()+parseInt(Math.random()*10).toString()+'.'+fileName.match(/\.(\w+)$/)[1];
                let putExtra = {
                    fname: fileName,
                    params: {},
                   mimeType: ["video/mp4", "video/quicktime", "video/rmvb", "video/avi"]
                };
                let token=this.videoToken;
                let observable = qiniu.upload(
                    config,
                    fileName,
                    token,
                    putExtra,
                    upfileConfig
                );
                observable.subscribe({
                        next: ((res)=>{
                            if(res.total.percent.toFixed(2)!=="100.00"){
                                if(obj===undefined){
                                    obj=this.$message({
                                        showClose: true,
                                        message:'上传视频完成'+res.total.percent.toFixed(2)+"%",
                                        duration:0
                                    });
                                }else{
                                    obj.message='上传视频完成'+res.total.percent.toFixed(2)+"%";
                                }
                            }else{
                                this.$nextTick(()=>{
                                    obj.onClose()
                                    obj.closed=true;
                                })
                            }
                        }),
                        error: ((res)=>{
                            this.$message.error('上传视频失败');
                        }),
                        complete: ((res)=>{
                            this.$message({
                                message: '上传视频成功',
                                type: 'success'
                            });
                            resolve(getCookie("imgOrVideo").vodIfrUrl+res.key)
                        })
                    });
                })
            },
        }
    }
</script>
<style lang="scss">
    .editor{
        .ql-editor {
            white-space: normal!important;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label::before, .ql-snow .ql-picker.ql-size .ql-picker-item::before {
            height: 24px;
            line-height: 24px;
            vertical-align: top;
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before, .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
            height: 24px;
            line-height: 24px;
            vertical-align: top;
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label::before, .ql-snow .ql-picker.ql-header .ql-picker-item::before{
             height: 24px;
            line-height: 24px;
            vertical-align: top;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label::before, .ql-snow .ql-picker.ql-font .ql-picker-item::before{
            height: 24px;
            line-height: 24px;
            vertical-align: top;
        }
        .ql-snow .ql-color-picker .ql-picker-label svg, .ql-snow .ql-icon-picker .ql-picker-label svg{
            vertical-align: top;
        }
        :focus{
            outline-width: 0px;
        }
        .code_edit{
            border: 1px solid #ddd;
            width: 803px;
            position: relative;
            top: -2px;
            display: none;
            min-height: 300px;
            padding: 10px;
        }
        img{
            cursor: pointer;
        }
        .quillEditor{
            max-width: 825px;
        }
        .editor_dailog{
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 262px;
            margin-top: 10px;
            background: #fff;
            position: absolute;
            top: -2px;
            left: 550px;
            z-index: 200;
            &>div{
                display: inline-block;
                margin: 0 10px;
            }
            input{
                width: 42px;
                border-bottom: 1px solid #ddd;
            }
            #setOption{
                width: 40px;
                background: #409eff;
                border-radius: 3px;
                border: none;
                color: #fff;
                cursor: pointer;
                line-height: 24px;
                text-align: center;
            }
        }
    }
</style>