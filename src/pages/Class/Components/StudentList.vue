<template lang='html'>
    <el-row class="student_list">
        <el-row class="blue">
            <el-col :span="2">
                <img src="~assets/img/user.png" style="width: 20px;" alt="">
            </el-col>
            <el-col :span="16">{{$t("class.studentList")}} {{students&&students.length}}{{$t('unit.people')}}</el-col>
            <el-col :span="6">
               <span @click="addStudent" style="cursor: pointer;">添加学员</span>
            </el-col>
        </el-row>
        <el-row>
            <el-checkbox-group class="box_group" v-model="checkList">
                <div v-for="element in students" :key="element.id">
                    <el-checkbox :label="element">
                        <el-col :span="18" @click.native="editStudent(element)">
                            <el-col :span="5">
                            <!-- <img src="~assets/img/user.png" style="width: 50px;" alt=""> -->
                                <ImageBar :load="element.headImg" :fail='studentImg' width="45" class="coach_avatar"></ImageBar>
                            </el-col>
                            <el-col :span="9">
                                {{element.stuName}}
                            </el-col>
                            <el-col :span="10">
                                {{element.tel}}
                            </el-col>
                        </el-col>
                        <el-col :span="6">
                            <div style="width:98px;height:50px;" class="pull_left">
                                <div v-for="item in filterClasTimeIds(element.clasTimeIds)" v-if="weekBg[item]" :style="{background:weekBg[item],height:'10px',width:'10px',borderRadius: '50%',display:'inline-block',marginRight:'2px'}"></div>
                            </div>
                            <i class="el-icon-delete" @click="removeStudent(element)"></i>
                        </el-col>
                    </el-checkbox>
                </div>
            </el-checkbox-group>
        </el-row>
        <Dialog ref="dialog1" title="添加学员" width="1024px" @submit="submit1">
            <div slot="content" class="scrollbar" style="max-height:600px;">
                <el-form size="medium" ref="formData1" :model="formData1" :rules="rules" style="width:962px" label-width="150px" label-position="left" :validate-on-rule-change="false">
                    <el-form-item :label="$t('class.classTime')" prop="clasTimeIds">
                        <CheckBox v-model="formData1.clasTimeIds" :data="clasTimeVos" class="week"></CheckBox>
                    </el-form-item>
                    <el-form-item label="学员" required >
                       <el-row v-for="(item,index) in formData1.stus" :key="index" style="width:800px"  class="tch mb_10">
                            <el-col :span="6">
                            <FormItem :width="250" :show-message="false" :label="$t('class.assistantLabel')" :prop="'stus.'+index+'.stuId'" :rules="[{required:true,message:'必填',trigger:'change'}]" :isShowLabel="false">
                                <SearchBar width="80" link="system/associative" placeholder="学员"
                                :title="$t('class.assistant')" v-model="formData1.stus[index].stuId"
                                :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                                :editSearchOpt="true"></SearchBar>
                            </FormItem>
                            </el-col>
                            <el-col :span="6" style="margin-left:60px;">
                                <FormItem label="手环包"  :show-message="false" :width="200":prop="'stus.'+index+'.antboxsn'" :rules="[{required:true,message:'必填',trigger:'change'}]" :isShowLabel="false">
                                    <el-select style="width:200px;" v-model="formData1.stus[index].antboxsn" placeholder="请选择手环包" @change="(antboxsn)=>getAntBoxsn(antboxsn,index)">
                                        <el-option
                                        v-for="item in codeData.antboxsn"
                                        :key="item.value"
                                        :label="item.display"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </FormItem>
                            </el-col>
                              <el-col :span="6" style="margin-left:20px;">
                                <FormItem label="手环" :width="200" :show-message="false" :prop="'stus.'+index+'.antsn'" :rules="[{required:true,message:'必填',trigger:'change'}]" :isShowLabel="false">
                                 <el-select style="width:200px;" v-model="formData1.stus[index].antsn" placeholder="请选择手环" >
                                        <el-option
                                        v-for="item in antboxsn"
                                        :key="item.value"
                                        :label="item.display"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                 </FormItem>
                            </el-col>
                            <el-col :span="2" style="margin-left:10px;">
                            <i v-if="formData1.stus.length>0&&index===0"  @click.prevent="addClasStu(index)" class="addIcon"></i>  
                            <i v-else @click.prevent="removeClasStu(index)" class="removeIcon"></i>  
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </Dialog>
         <Dialog ref="dialog2" title="编辑学员时段" width="800px" @submit="submit2">
            <div slot="content">
                <el-form size="medium" ref="formData2" :model="formData2" :rules="rules" label-width="150px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
                    <el-form-item label="学员">
                        {{student.stuName}}
                    </el-form-item>
                     <el-form-item label="手环包" prop="antboxsn">
                         <el-select  v-model="formData2.antboxsn" placeholder="请选择手环包" @change="getAntBoxsn">
                            <el-option
                            v-for="item in codeData.antboxsn"
                            :key="item.value"
                            :label="item.display"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手环" prop="antsn">
                         <el-select  v-model="formData2.antsn" placeholder="请选择手环" >
                            <el-option
                            v-for="item in antboxsn"
                            :key="item.value"
                            :label="item.display"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('class.classTime')" prop="clasTimeIds">
                        <CheckBox v-model="formData2.clasTimeIds" :data="clasTimeVos" class="week"></CheckBox>
                    </el-form-item>
                </el-form>
            </div>
        </Dialog>
    </el-row>
</template>
<script>
    import ImageBar from "common/ImageBar";
    import studentImg from "assets/img/student.png";
    import SelectOpt from "common/SelectOpt";
    import CheckBox from "common/CheckBox";
    import {clone,isEmpty,validateForm,getTableSectionData,getCode} from "assets/js/reused";
    import Dialog from "common/Dialog";
    import FormItem from "common/FormItem";
    import SearchBar from "common/SearchBar";
     export default {
        name: 'classStudentList',
        components:{
            ImageBar,
            SelectOpt,
            FormItem,
            Dialog,
            CheckBox,
            SearchBar
        },
        props:{
            campusId:{
                type:Number,
                default:null
            }
        },
        data () {
            return{
                weekBg:[],
                students:[],
                studentImg:studentImg,
                formData1:{
                    clasTimeIds:[],
                    stus:[{
                        stuId:null,
                        antboxsn:null,
                        antsn:null
                    }]
                },
                antboxsn:[],
                formData2:{
                    stuIds:[],
                    antsn:null,
                    antboxsn:null,
                    clasTimeIds:[]
                },
                codeData:{},
                student:{},
                clasTimeVos:[],
                oldClasTimeVos:[],
                checkList:[],
                isChecked:false,
                rules:{
                    classId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    clasTimeIds:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    antsn:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    antboxsn:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }]
                }
            }
        },
        created(){
            // this.init()
        },
        methods:{
            async init(){
               this.students=await this.find();
            },
            filterClasTimeIds(ids){
                let weekArr=[];
                let arr=ids.split(",");
                this.oldClasTimeVos.map((item)=>{
                    if(arr.some((note)=>parseInt(note)===item.clasTimeId)){
                        weekArr.push(item.week);
                    }
                });
                return [...new Set(weekArr)];
            },
            removeClasStu(index){
                this.formData1.stus.splice(index,1);
            },
            addClasStu(){
                this.formData1.stus.push({
                        stuId:null,
                        antboxsn:null,
                        antsn:null
                });
            },
            getAntBoxsn(antboxsn,index){
                if(index!=undefined){
                    this.formData1.stus[index].antsn=null;
                }else{
                    this.formData2.antsn=null;
                }
                this.antboxsn=this.codeData.antsn.filter((item)=>{
                    return item.antboxsn===antboxsn;
                })
            },
            searchOptFn(v){
                // let unMemberIds=getTableSectionData({
                //     tableData:this.formData1.clasTchs,
                //     itemName:["stuId"],
                //     getArr:true
                //     })
                //     unMemberIds=unMemberIds.filter((item)=>item).toString();
                    return {"category":"stu","keyword":v,"campusId":this.campusId}
            },
            pushCallbackFn(element){
                return {
                    value:element.display ,//显示需要的
                    id: element.value
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
                if(formName==="formData2"){
                    this.$nextTick(()=>{
                        this.formData2.amount=null;
                        this.$refs.trainId.selectDefaultData();
                    })
                }
            },
            async addStudent(){
                // this.formData1.clasTimeIds=[];
                this.codeData=await getCode("campusAnt");
                this.formData1.stus=[
                    {
                        stuId:null,
                        antboxsn:null,
                        antsn:null
                    }
                ];
                this.$refs.dialog1.show();
                this.$nextTick(()=>{
                    this.$refs["formData1"].resetFields();
                })
            },
            async editStudent(student){
                this.codeData=await getCode("campusAnt");
                this.student=student;
                this.formData2.antboxsn=null;
                this.formData2.antsn=null;
                this.formData2.stuIds=[student.stuId];
                
                let antsnItem=this.codeData.antsn.filter((item)=>{
                    return item.value===student.antsn;
                })
                if(student.antsn&&antsnItem[0]&&antsnItem[0].antboxsn){
                  this.formData2.antboxsn=antsnItem[0].antboxsn;
                  this.getAntBoxsn(antsnItem[0].antboxsn);
                  this.formData2.antsn=student.antsn;
                };
                this.formData2.clasTimeIds=student.clasTimeIds.split(",").map((item)=>parseInt(item));
                this.$refs.dialog2.show()
            },
            setClasTimeVos(clasTimeVos){
                this.oldClasTimeVos=clasTimeVos;
                this.clasTimeVos=clasTimeVos.map((item)=>{
                    let obj={};
                    obj.value=item.clasTimeId;
                    obj.display=item.weekDisplay+"    "+item.startTime+"    "+item.endTime;
                    return obj;
                });
            },
            setWeekBg(weekBg){
                this.weekBg=weekBg;
            },
            setStudents(students){
                this.students=students;
            },
            removeStudent(element){
                let formData={};
                formData.clasId=this.$route.query.clasId;
                formData.stuIds=element.stuId;
                this.$confirm("确认删除", this.$t("components.tips"), {
                    confirmButtonText: this.$t("components.confirm"),
                    cancelButtonText: this.$t("components.cancel"),
                    type: 'warning'
                }).then(() => {
                    this.$axios.post({
                        url:baseURL+"clas/stu_delete",
                        data:formData,
                        success:(res)=>{
                            this.$message({
                                message:res.message,
                                type: 'success'
                            })
                            this.$emit("isSubmit",true)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('components.cancel')
                    });
                });
            },
            submit1(){
                let formData=[];
                this.formData1.stus.map((item)=>{
                    let obj={};
                    obj.clasId=this.$route.query.clasId;
                    obj.stuId=item.stuId;
                    obj.clasTimeIds=this.formData1.clasTimeIds.toString();
                    obj.antsn=item.antsn;
                    formData.push(obj);
                })
                validateForm({
                    form: this.$refs["formData1"],
                    formData: formData,
                    url: "clas/stu_add",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                       this.$refs.dialog1.close()
                       this.$emit("isSubmit",true)
                    }
                });
            },
            submit2(){
                let formData=[];
                this.formData2.stuIds.map((item)=>{
                    let obj={};
                    obj.clasId=this.$route.query.clasId;
                    obj.stuId=item;
                    obj.antsn=this.formData2.antsn;
                    obj.clasStuId=this.student.clasStuId;
                    obj.clasTimeIds=this.formData2.clasTimeIds.toString();
                    formData.push(obj);
                })
                validateForm({
                    form: this.$refs["formData2"],
                    formData: formData,
                    url: "clas/stu_edit",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                       this.$refs.dialog2.close()
                       this.$emit("isSubmit",true)
                    }
                });
            },
            confirmDelete(){
                if(this.checkList.length===0){
                    this.$alert(this.$t("class.msg1"))
                    return
                }
                let stuIds=getTableSectionData({tableData:this.checkList,itemName:["stuId"]});
                let clasStuIds=getTableSectionData({tableData:this.checkList,itemName:["clasStuId"]});
                this.$axios.post({
                    url:baseURL+"clas/clas_stu_delete",
                    data:{
                        clasId:this.$route.query.clasId,
                        stuIds,
                        clasStuIds
                    },
                    success:(res)=>{
                        this.$message({
                            message: res.message,
                            type:"success"
                        })
                        this.init()
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.student_list{
    .blue{
        background: #148af2;
        color:#fff;
        font-size: 16px;
        padding: 10px;
        line-height: 20px;
        .cur{
            cursor: pointer;
        }
        .cancel{
            padding-left: 10px;
        }
    }
    .week{
        /deep/ .el-checkbox-group{
            width: 600px;
            .el-checkbox{
                float: left;
            }
        }
    }
    .btn_bottom{
        width: 400px;
    }
    .box_group{
        /deep/.el-checkbox__input{
            display: none;
        }
        /deep/.el-checkbox{
            width: 100%;
        }
        /deep/.el-checkbox__label{
            width: 90%;
            vertical-align: middle;
            line-height: 50px;
        }
        /deep/.is-disabled+.el-checkbox__label{
            color: #606266;
        }
        /deep/.el-checkbox__input.is-checked+.el-checkbox__label{
            color: #606266;
        }
        img{
            vertical-align: middle;
        }
    }
    .content_edit{
        font-size: 18px;
        padding-left: 106px;
        padding-bottom: 20px;
        display: block;
    }
    .student_avatar{
        display: block;
        margin: 0 auto;
        width: 100px;
    }
    .title{
        text-align: center;
        padding: 20px 0;
    }
    .col_pad{
        padding: 2px 20px;
        background: #3D78D4;
        color: #fff;
        border-radius: 5px;
        margin-right: 10px;
    }
    .border{
        border-right: 1px solid #ddd;
    }
    .edit{
        color:#409eff;
        cursor: pointer;
        padding-left: 10px;
    }
    .class_hour_div{
        width: 1200px;
    }
    .cur{
        cursor: pointer;
    }
    .btn_bottom{
        width: 350px;
    }
    .bg_gray{
        background: rgb(242,242,242);
        margin: 0 auto;
        margin-bottom: 10px;
        width: 120px;
        display: inline-block;
    }
    .submit_button{
        width: 156px;
    }
    .isChecked{
        background: #3D78D4;
        color: #fff;
    }
    .week{
        margin-bottom:15px;
        text-align: center;
    }
    .card_info{
        width: 600px;
        background: #f8f8f8;
        padding: 10px;
    }
    .content{
        width: 600px;
        background: #F2F2F2;
        color: #7F7F7F;
        padding: 20px;
        .discount_border{
            border-bottom: 1px dashed #ddd;
            height: 18px;
        }
    }
}

</style>