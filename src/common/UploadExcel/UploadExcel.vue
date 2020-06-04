<template lang='html'>
    <div class="uploadExcel">
        <el-button class="add" round size="small" @click="dialogShow">{{$t('student.importStudent')}}</el-button>
        <el-dialog
            title="导入学员"
            :visible.sync="dialogVisible"
            center
            width="576px"
            :before-close="handleClose">
            <div class="dailog_content">
                <div class="dailog_top" v-if="show1">
                     <label for="file_input">
                        <img src='~assets/img/icon/uploadFile.png' alt="">
                        <span>上传文件</span>
                    </label>
                </div>
                <div class="dailog_top" v-if="show2">
                    <div class="over_hide uploadfile_content" >
                        <div class="pull_left uploadfile_parent">
                            <div class="pull_left">
                                 <img class="uploadfile" src='~assets/img/icon/uploadFile.png' alt="">
                            </div>
                            <div class="pull_left" style="width: 78%;">
                                <div style="margin-bottom:10px">
                                    文件名:&nbsp;&nbsp;&nbsp;&nbsp;{{fileName}}
                                </div>
                                <div>
                                    <slot></slot>
                                </div>
                            </div>
                        </div>
                        <div class="pull_right btn_group">
                            <el-button @click="uploadFile">上传</el-button>
                            <label for="file_input" class="over_hide" @click="reset"><el-button>重选</el-button></label>
                        </div>
                    </div>
                </div>
               <div class="text_center"> <a class="download" :href="downloadHref">点击下载导入模板</a></div>
               <div>
                   <div class="text_center" style="margin-bottom:10px;">导入须知:</div>
                   <div>1.第一次导入前请仔细阅读该导入须知，并下载导入模板。<br/>
                        2.下载的导入模板文档中<span style="color:red">红色</span>字体栏所填写项目为必填项。<br/>
                        3.很多数据具有一定的关联性,请确定后再添加。<br/>
                        4.可以在导入模板中继续添加，并上传，正式导入前，请删除前面的示例，所有的格式跟示例保持一致，否则会导入失败。<br/>
                        5.所有数据无需带<span style="color:red">单位</span><br/>
                        6.导入数据仅支持同一个校区，对应导入时请正确选择校区进行上传<br/>
                        7.一次性最多导入<span style="color:red">五百条</span>数据。<br/>
                        8.导出后的数据请填入的之前下载的导入模板,导出的excel不能上传
                    </div>
               </div>
               <input type="file" id="file_input"  ref="uploadExcel" @change="importData"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">关闭</el-button>
            </span>
        </el-dialog>
        <ExportTable ref="exportTable" style="display:none"></ExportTable>
    </div>
</template>
<script>
    import XLSX from "xlsx";
    import ExportTable from "common/ExportTable";
    import {debounce,dateFormat,isEmpty} from "assets/js/reused";
     export default {
        name: 'UploadExcel',
        props:{
            uploadFormat:{
                type:Object,
                required:true,
                default(){
                    return {}
                }
            },
            downloadHref:{
                type:String,
                default:"/manage/download/importStudent.xlsx"
            },
            uploadExcelUrl:{
                type:String,
                default:"student/importdata"
            }
        },
        components:{
            ExportTable
        },
        data () {
            return{
                sheetArrayData:[],
                fileName:"",
                dialogVisible:false,
                show1:true,
                show2:false
            }
        },
        methods:{
            importData(v){
                let excel=this.$refs.uploadExcel&&this.$refs.uploadExcel.value.match(/\.[^\.]+$/)[0].split(".")[1];
                if(!(excel==="xls"||excel==="xlsx")){
                    this.$message.warning('文件类型不正确！');
                    return
                }
                this.fileName=this.$refs.uploadExcel.value.match(/fakepath\\([\s\S]*)/)[1];
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                try {
                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                    type: 'binary'
                    });
                    let sheetArrayData=[];
                    for (let sheet in workbook.Sheets) {
                        const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                        let keys=Object.keys(this.uploadFormat).filter((item)=>item!=="错误信息");
                        let formatData=[];
                        sheetArray.map((element)=>{
                            let newObj={}
                            keys.map((item)=>{
                                let newKey=this.uploadFormat[item].key;
                                if(newKey.search(/Date/)>-1){
                                    newObj[newKey]=isEmpty(element[item])?"":Date.parse(dateFormat("yyyy-MM-dd",new Date(element[item]+" 00:00:00")))/1000;
                                }else{
                                    newObj[newKey]=isEmpty(element[item])?"":element[item];
                                }
                            })
                            let arr=[];
                            for(let key in newObj){
                                arr.push(newObj[key])
                            }
                            if(!(arr.every((item)=>isEmpty(item)))){
                                formatData.push(newObj);
                            }
                        })
                        sheetArrayData.push(...formatData);
                    }
                    this.sheetArrayData=sheetArrayData;
                    this.$nextTick(()=>{
                        this.show1=false;
                        this.show2=true;
                        document.querySelector("#file_input").value="";
                    })
                } catch (e) {
                    this.$message.warning('文件类型不正确！');
                    return false;
                }
                };
                fileReader.readAsBinaryString(v.target.files[0])
            },
            exportExcel(data){
                //导出excel
                this.$refs.exportTable.exportExcel(data);
            },
            reset(){
                document.querySelector("#file_input").value="";
            },
            uploadExcelData(data={}){
                this.$axios.post({
                    url:baseURL+this.uploadExcelUrl,
                    data:{
                        ...data
                    },
                    success:(res)=>{
                       this.$emit("callback",res)
                    }
                })
            },
            uploadFile(){
                this.$emit("upload",this.sheetArrayData)
            },
            handleClose(){
                this.dialogVisible=false;
                this.show1=true;
                this.show2=false
            },
            dialogShow(){
                this.dialogVisible=true;
                this.$emit("openDailog",1)
            },
            close(){
                this.dialogVisible = false;
                this.show1=true;
                this.show2=false;
                this.reset()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .uploadExcel{
        display: inline-block;
        position: relative;
        .dailog_content{
            height: 336px;
            &>input{
                display: none;
            }
            &>.dailog_top{
                border-bottom: 1px solid #ddd;
                position: relative;
                overflow: hidden;
                height: 160px;
                .uploadfile_content{
                   width: 100%;
                   border: 1px solid #ddd;
                    border-radius: 5px;
                    .uploadfile_parent{
                        border-right: 1px solid #ddd;
                        width: 80%;
                        padding: 10px;
                        height: 109px;
                        .uploadfile{
                            height: 86px;
                        }
                    }
                    .btn_group{
                        width: 90px;
                        button{
                            margin-top: 10px;
                        }
                        button:nth-of-type(2){
                            margin: 0;
                            margin-top:20px;
                        }
                        label{
                            cursor: pointer;
                            button{
                                pointer-events: none;
                            }
                        }
                    }
                }
                &>label{
                    width: 300px;
                    height: 160px;
                    position: absolute;
                    left: 50%;
                    top:0;
                    transform: translate(-50%,0%);
                    cursor: pointer;
                    span{
                      color: #d5eefc;
                      text-align: center;
                      display: block;
                    }
                    img{
                        width: 130px;
                        display: block;
                        margin: 0 auto;
                    }
                }
            }
            .download{
                margin-top: 10px;
                display: block;
                text-decoration: underline;
                color: #0827a6;
                margin-bottom: 10px;
            }
        }
    }
</style>