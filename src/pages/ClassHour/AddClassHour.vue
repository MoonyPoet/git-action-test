<template lang='html'>
    <div class="add_class_hour">
        <basic-container>
            <el-form :model="formData" :rules="rules" size="medium" ref="formData"  label-width="200px"
                     label-position="left" class="demo-ruleForm" :validate-on-rule-change="false">
                <template v-if="showClassName">
                    <el-form-item label="校区" ref="campusId" prop="campusId">
                        <SelectOpt v-model="formData.campusId" :data="codeData.campusId" val='display' id='value' placeholder="请选择场地" ref="campusId"></SelectOpt>
                    </el-form-item>
                    <el-form-item label="班级名称" ref="clasId" prop="clasId">
                        <SearchBar style="width:300px;" link="system/associative" @change="clasChange" placeholder="请输入班级"
                            :title="$t('class.headCoach')" v-model="formData.clasId"
                            :pushCallback="pushCallbackFn" :searchOpt="searchOptFn1"
                            :editSearchOpt="true">
                        </SearchBar>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="班级名称">
                        {{classesName}}
                    </el-form-item>
                </template>
                <el-form-item label="场地"  prop="fieldName">
                    <!-- <el-input v-model="formData.field" placeholder="请输入场地"></el-input>
                     -->
                    <el-autocomplete style="width:264px;" v-model="formData.fieldName" :fetch-suggestions="querySearchAsyncField"
                                     placeholder="请输入场地" @input="(v)=>fieldInput(v)" @select="(v)=>handlefield(v)"
                                     :debounce="500"></el-autocomplete>
                    <i v-if="formData.campusFieldId&&formData.campusFieldId>0" class="el-icon-check"></i>
                </el-form-item>
                <el-form-item label="上课日期" ref="day" v-if="!dayShow" prop="day">
                    <el-date-picker
                            v-model="formData.day"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-else label="上课日期" ref="day">
                    {{formData.day |date}}
                </el-form-item>
                <el-form-item label="上课开始时间" required>
                    <el-row style="width:600px;">
                        <el-col :span="10">
                            <FormItem label="开始时间" prop="startTime" :isShowLabel="false">
                                <el-time-picker
                                :disabled="startTimeDisabled"
                                v-model="formData.startTime"
                                format="HH:mm"
                                @change="clearable(formData)"
                                value-format="HH:mm"
                                placeholder="开始时间">
                                </el-time-picker>
                            </FormItem>
                        </el-col>
                        <el-col :span="12">
                            <FormItem label="结束时间" prop="endTime" :isShowLabel="false">
                                <el-time-picker
                                :disabled="formData.startTime==''||formData.startTime==null"
                                v-model="formData.endTime"
                                :picker-options="{
                                selectableRange: formData.startTime!=null?`${formData.startTime}+':00' - 23:59:59`:''
                                }"
                                format="HH:mm"
                                value-format="HH:mm"
                                placeholder="结束时间">
                                </el-time-picker>
                            </FormItem>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="签到扣课" prop="deductVal">
                    <el-input style="width:300px;" v-model="formData.deductVal" placeholder="签到扣课"></el-input>
                </el-form-item>
                <!-- <el-form-item label="教练" required :show-message="false">
                    <el-row v-for="(item,index) in formData.clasHourTchrs" :key="item.id" class="teachType">
                         <el-col :span="22">
                             <FormItem label="教练" :isShowLabel="false">
                                <SearchBar style="width:340px;" @change="coachChange" link="system/associative" placeholder="请输入教练"
                                    :title="$t('class.headCoach')" v-model="item.memberId"
                                    :pushCallback="pushCallbackFn" :searchOpt="searchOptFn2"
                                    :editSearchOpt="true">
                                </SearchBar>
                            </FormItem>
                        </el-col>
                        <el-col :span="2">
                            <i v-if="index==0" @click="addCoach()" class="addIcon"></i>
                            <i v-else @click="removeCoach(index)" class="removeIcon"></i>
                        </el-col>
                    </el-row>
                </el-form-item> -->
                 <el-form-item :label="$t('class.headCoachLabel')"  prop="clasHourTchrs.0.memberId" :rules="[{
                            required:true,
                            message:$t('form.required'),
                            trigger: 'change'
                        }]">
                <SearchBar width="100%" link="system/associative" style="width:300px;" :placeholder="$t('class.headCoach')"
                    :title="$t('class.headCoach')" v-model="formData.clasHourTchrs[0].memberId"
                    :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                    :editSearchOpt="true"></SearchBar>
                </el-form-item>
                <el-form-item :label="$t('class.assistantLabel')">
                <el-row style="margin-bottom:10px"><i  @click.prevent="addCoach()" class="addIcon"></i></el-row>
                <el-row v-for="(item,index) in formData.clasHourTchrs" :key="item.id" v-if="index!=0" class="tch mb_10">
                    <el-col :span="22">
                    <FormItem :label="$t('class.assistantLabel')" :isShowLabel="false">
                        <SearchBar width="100%" link="system/associative" :placeholder="$t('class.assistantLabel')"
                        :title="$t('class.assistant')" v-model="formData.clasHourTchrs[index].memberId"
                        :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                        :editSearchOpt="true"></SearchBar>
                    </FormItem>
                    </el-col>
                    <el-col :span="2">
                    <i  @click.prevent="removeCoach(index)" class="removeIcon"></i>  
                    </el-col>
                </el-row>
                </el-form-item>
                <el-form-item label="学员">
                    <SearchBar style="width:300px;" ref="stu" link="system/associative" @change="stuChange" placeholder="请输入学员"
                         v-model="studentId"
                        :pushCallback="pushCallbackFn" :searchOpt="searchOptFn3"
                        :editSearchOpt="true">
                    </SearchBar>
                    <el-col :span="12" style="padding-top:20px;" class="scrollbar">
                        <el-col :span="4" v-for="(item,index) in students" :key="item.id">
                            {{item.display}}<span v-if="item.antsn">-</span>{{item.antsn}} <i @click="removeStu" class="removeIcon"></i>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item v-if="students&&students.length>0">
                    <el-button @click="chooseAntsn">选择手环</el-button>
                </el-form-item>
                
                    <Dialog ref="dialog" title="学员选择手环" width="800px" @submit="submit">
                    <div slot="content" class="scrollbar" style="max-height:600px;">
                        <el-form size="medium" ref="formData1" :model="formData1" :rules="rules" label-width="150px" label-position="left"  :validate-on-rule-change="false">
                            <el-row v-for="(item,index) in formData1.stus" :key="index" style="width:600px"  class="tch mb_10">
                            <el-col :span="4" style="line-height: 36px;text-align: center;">
                                {{item.display}}<span style="color:red">*</span> 
                            </el-col>
                            <el-col :span="8" style="margin-left:60px;">
                                <FormItem label="手环包" :show-message="false" :width="200" :prop="'stus.'+index+'.antboxsn'" :rules="[{required:true,message:'必填',trigger:'change'}]" :isShowLabel="false">
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
                              <el-col :span="8" style="margin-left:20px;">
                                <FormItem label="手环" :show-message="false" :width="200" :prop="'stus.'+index+'.antsn'" :rules="[{required:true,message:'必填',trigger:'change'}]" :isShowLabel="false">
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
                        </el-row>
                        </el-form>
                    </div>
                    </Dialog>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formData')" class="submitButton">提交</el-button>
                </el-form-item>
            </el-form>
        </basic-container>
    </div>
</template>
<script>
    import {
        getCode,
        clone,
        getCookie,
        dateFormat,
        debounce,
        deleteField,
        selectDefaultData,
        isEmpty,
        getTableSectionData,
        validateForm,
        getAsso
    } from "assets/js/reused";
    import BasicContainer from "@vue-materials/basic-container";
    import {validateNumber} from "assets/js/vuelidate";
    import CampusBranchBar from "common/CampusBranchBar";
    import UploadImg from "common/UploadImg";
    import ClassCategory from "common/ClassCategory";
    import UploadList from "common/UploadList";
    import SelectOpt from "common/SelectOpt";
    import SearchBar from "common/SearchBar";
    import FormItem from "common/FormItem";
    import Dialog from "common/Dialog";
    import * as R from "ramda";
    //  const cityOptions = ['上海', '北京', '广州', '深圳'];
    export default {
        name: "addClassHour",
        components: {
            BasicContainer,
            CampusBranchBar,
            UploadImg,
            ClassCategory,
            SelectOpt,
            SearchBar,
            FormItem,
            UploadList,
            Dialog
        },
        data() {
            return {
                isInit: false,
                classData: "",
                codeData:{},
                studentId:null,
                formData: {
                    campusId:null,
                    day:null,
                    fieldName:null,
                    clasId: null,
                    campusFieldId: 0,
                    deductVal:null,
                    startTime:null,
                    endTime:null,
                    clasHourTchrs: [
                        {
                            memberId:null,
                            tchrType:"0"
                        }
                    ],
                    clasHourStus:[
                        {
                            stuId:null,
                            cardType:null,
                            csmclsAmount:null
                        }
                    ]
                },
                formData1:{
                    stus:[{
                        stuId:null,
                        antboxsn:null,
                        antsn:null
                    }]
                },
                antboxsn:[],
                students:[],
                student:{},
                fieldList: [],
                coachList: [],
                teachCourse: "",
                term: 0,
                chargeType: [],
                checkData: [false, false, false],
                theWay: "",
                trainCategoryId: "",
                periodType: "",
                memberType: "",
                // week: "",
                memberList: "",
                isIndeterminate: false,
                checkAll: false,
                classesName: "",
                rules: {
                    campusId:[{required: true, message: "必填", trigger: "change"}],
                    clasId: [{required: true, message: "必填", trigger: "change"}],
                    address: [{required: true, message: "必填", trigger: "change"}],
                    day: [{required: true, message: "必填", trigger: "change"}],
                    fieldName: [{required: true, message: "必选", trigger: "change"}],
                    startTime:[{required: true, message: "必选", trigger: "change"}],
                    endTime:[{required: true, message: "必选", trigger: "change"}],
                    deductVal:[{required: true, message: "必选", trigger: "blur"}]
                },
                dayShow: false,
                startTimeDisabled: false,
                showClassName: true
            };
        },
        created() {
            this.init();
        },
        methods: {
            async init() {
                this.codeData=await getCode("campus,campusAnt");
                if (this.$route.query.startTime) {
                    this.startTimeDisabled = false;
                    this.formData.startTime = this.$route.query.startTime;
                }
                if (this.$route.query.day) {
                    this.dayShow = true;
                    this.formData.day = this.$route.query.day;
                }
                if (this.$route.query.classesId) {
                    this.showClassName = false;
                    this.formData.classesId = this.$route.query.classesId;
                    let oneClassData = await this.getOneClassData({classesId: this.$route.query.classesId});
                    this.trainCategoryId = oneClassData.trainCategoryId;
                    let studentData = await this.getStudentData({classesId: this.formData.classesId});
                    this.studentData = studentData;
                    this.checkAll = true;
                    this.handleCheckAllChange(studentData)
                    this.classesName = oneClassData.name;
                }
            },
            async chooseAntsn(){
                this.formData1.stus=clone(this.students).map((item)=>{
                    if(item.antsn===undefined){
                        this.$set(item,"antboxsn",null);
                        this.$set(item,"antsn",null);
                    }
                    return item;
                });
                // this.codeData=await getCode("campusAnt");
                this.$nextTick(()=>{
                    this.$refs.dialog.show();
                });
            },
            getAntBoxsn(antboxsn,index){
                if(index!=undefined){
                    this.formData1.stus[index].antsn=null;
                }
                this.antboxsn=this.codeData.antsn.filter((item)=>{
                    return item.antboxsn===antboxsn;
                })
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
            submit(){
                let formData=clone(this.formData1.stus);
                 this.$refs["formData1"].validate((valid) => {
                    if (valid) {
                        this.students=formData;
                        this.$refs.dialog.close()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            searchOptFn(v){
                // let unMemberIds=getTableSectionData({
                //     tableData:this.formData.clasTchs,
                //     itemName:["memberId"],
                //     getArr:true
                //     })
                //     unMemberIds=unMemberIds.filter((item)=>item).toString();
                    return {"category":"member","keyword":v,"campusId":this.formData.campusId}
            },
            removeStu(index){
                 this.$confirm("确认删除学员?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.students.splice(index,1)
                });
            },
            async clasChange(clasId){
               if(clasId){
                    this.students=await this.getAsso({
                        category:"stu",
                        clasId
                    });
               }
            },
            stuChange(id){
                if(this.$refs.stu.list&&id){
                   if(this.students.some((item)=>item.value===id)){
                       return
                   }
                   let stu=this.$refs.stu.list.filter((item)=>{
                        if(item.id===id){
                            return true;
                        }
                    });
                    this.students.unshift(stu[0].res);
                }
            },
            searchOptFn1(v){
                return {"category":"class","keyword":v,"campusId":this.formData.campusId};
            },
            // searchOptFn2(v){
            //     return {"category":"member","keyword":v,"campusId":this.formData.campusId};
            // },
            searchOptFn3(v){
                return {"category":"stu","keyword":v,"campusId":this.formData.campusId}
            },
            pushCallbackFn(element){
                return {
                    value:element.display ,//显示需要的
                    id: element.value,
                    res:element
                }
            },
            fieldInput(v) {
                this.formData.campusFieldId = 0;
            },
            async querySearchAsyncField(queryString, cb) {
                //模糊匹配选择场地
                this.fieldList = [];
                this.getAsso({
                    category:"campusField",
                    fieldLike: queryString,
                    campusId: this.formData.campusId
                }).then(res => {
                    res.forEach(element => {
                        this.fieldList.push({
                            value: element.display,
                            campusFieldId: element.value,
                            hubsn:element.hubsn
                        });
                    });
                    cb(this.fieldList);
                });
            },
            handlefield(v) {
                //选择场地
                this.formData.campusFieldId =
                    v.campusFieldId;
            },
            getAsso(data = {}) {
                return new Promise(async(resolve, reject) => {
                    resolve(await getAsso(data))
                });
            },
            //只查一个班的培训类别
            getOneClassData(data = {}) {
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                        url: baseURL + "classes/find_id",
                        data: {
                            ...data
                        },
                        success: (res) => {
                            resolve(res.data)
                        }
                    })
                })
            },
            getClassData(v) {
                let obj = Object.assign({classType: "0", status: "1"}, v);
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                        url: baseURL + "classes/find",
                        data: obj,
                        success: res => {
                            resolve(res.data);
                        }
                    });
                });
            },
            clearable(item) {
                item.endTime = "";
            },
            getWeekData() {
                //获取一周
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                        url: baseURL + "common/findweek",
                        data: {},
                        success: res => {
                            resolve(res.data);
                        }
                    });
                });
            },
            getStudentData(data = {}) {
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                        url: baseURL + "classstudent/find_cls_id",
                        data: {...data},
                        success: (res) => {
                            resolve(res.data)
                        }
                    })
                })

            },
            coachInput(v, index) {
                this.formData.classesHourTeachers[index].memberId = 0;
            },
            coachBlur(index) {
                if (
                    this.formData.classesHourTeachers[index].memberId === 0 ||
                    this.formData.classesHourTeachers[index].memberId === ""
                ) {
                    this.formData.classesHourTeachers[index].coachNameLike = "";
                }
            },
            handleSelect(v, index) {
                //选择数据
                this.formData.classesHourTeachers[index].memberId = v.memberId;
            },
            async getCampusId(v) {
                //获取校区id
                this.formData.campusId = v.campusId;
                // this.$refs.form2.getTraincategory(v)
                //班级名称
                let classData = await this.getClassData({campusId: v.campusId});
                this.classData = classData;
                this.formData.classesId = selectDefaultData(classData, "classesId")
                this.getTrainCategoryId(this.formData.classesId)
                let studentData = await this.getStudentData({classesId: this.formData.classesId})
                this.studentData = studentData;
                this.checkAll = true;
                this.handleCheckAllChange(studentData)
            },
            handleCheckedItemChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.studentData.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.studentData.length;
            },
            handleCheckAllChange(val) {
                let options = [];
                this.studentData.map((item) => {
                    options.push(item.studentId);
                })
                this.formData.studentIds = val ? options : [];
                this.isIndeterminate = false;
            },
            getMemberId(v) {
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                        url: baseURL + "member/name_find",
                        data: {
                            nameLike: v,
                            trainCategoryIdsNotEqualNull: 1,
                            trainCategoryIdFind: this.trainCategoryId
                        },
                        success: res => {
                            resolve(res);
                        }
                    });
                });
            },
            checkboxChange(aindex, index) {
                if (aindex == 0) {
                    this.formData.hour = "";
                } else if (aindex == 1) {
                    this.formData.num = "";
                } else {
                    this.formData.price = "";
                }
            },
            getCourseData(v) {
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                        url: baseURL + "teachcourse/find",
                        data: {
                            trainCategoryId: v
                        },
                        success: res => {
                            resolve(res.data);
                        }
                    });
                });
            },
            async classFind(v) {
                //班级切换获取培训类别
                this.getTrainCategoryId(v);
                let studentData = await this.getStudentData({classesId: this.formData.classesId});
                this.studentData = studentData;
                this.checkAll = true;
                this.handleCheckAllChange(studentData)
            },
            getTrainCategoryId(v) {
                //获取培训类别
                this.classData.forEach(element => {
                    if (element.classesId == v) {
                        this.trainCategoryId = element.trainCategoryId
                    }
                });
            },
            querySearchAsync(queryString, cb) {
                //模糊匹配
                this.memberList = [];
                this.getMemberId(queryString).then(res => {
                    res.data.forEach(element => {
                        this.memberList.push({
                            value: element.name + "　　" + element.tel,
                            memberId: element.memberId,
                            trainCategoryIdFind: this.trainCategoryId
                        });
                    });
                    cb(this.memberList);
                });
            },
            addCoach() {
                //添加教练
                this.formData.clasHourTchrs.push({
                    memberId: null,
                    tchrType:"1"
                });
            },
            removeCoach(index) {
                this.formData.clasHourTchrs.splice(index, 1);
            },
            copy(index) {
                //复制
                this.formData.classesTimeList.splice(
                    index,
                    0,
                    clone(this.formData.classesTimeList[index])
                );
            },
            getAntno(antsn){
                let antno;
                this.codeData.antsn.map((item=>{
                    if(item.value===antsn){
                        antno=item.display;
                    }
                }));
                return antno;
            },
            getHubsn(campusFieldId){
                let hubsn=null;
                this.fieldList.map((item)=>{
                    if(item.campusFieldId===campusFieldId){
                        hubsn=item.hubsn;
                    }
                })
                return hubsn;
            },
            submitForm(formName) {
                let formData=clone(this.formData); 
                if(this.students.some((item)=>{return isEmpty(item.antsn)})){
                   this.$alert("学员需选定手环", "错误提示");
                   return
                };
                formData.clasHourStus=clone(this.students);
                formData.clasHourStus.map((item)=>{
                    item.csmclsAmount=item.cardUnitAmount*formData.deductVal;
                    item.stuId=item.value;
                    item.antsn=item.antsn;
                    item.antno=this.getAntno(item.antsn);
                    delete item.cardUnitAmount;
                    delete item.value;
                    delete item.display;
                    delete item.cardVal;
                    delete item.antboxsn;
                });
                formData.hubsn=this.getHubsn(formData.campusFieldId);
                delete formData.campusFieldId;
                 validateForm({
                    form: this.$refs["formData"],
                    formData: formData,
                    url: "clashour/add",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                        this.$store.commit("deleteTabAndGo")
                    }
                    });
            },
            removeType(index) {
                //删除时段
                this.formData.classesTimeList.splice(index, 1);
            },
            getPic(pic) {
                //获得图片
                this.formData.logPic = pic;
                this.$refs["logPic"].clearValidate();
            }
        }
    };
</script>
<style lang="scss" scoped>
    .add_class_hour {
        .el-icon-check {
            color: green;
            margin-left: 10px;
        }
      

        .des {
            width: 400px;
        }

        .chargeType {
            margin: 10px 0px;
        }

        .input_s {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
        }

        .chargeType_div {
            .input_s {
                margin-right: 20px;
            }
        }

        .teachType {
            margin-bottom: 20px;
            width: 387px;
        }

        .teachType:nth-last-child(1) {
            margin: 0;
        }
        .tch{
            width: 330px;
        }
        .task_line {
            margin-bottom: 10px;
            border: 1px solid #ddd;
            padding: 25px;
            border-radius: 5px;
            width: 71%;

            .el-input.el-input--medium {
                width: 228px;
            }

            .deductinglessons {
                margin-right: 10px;
            }

            .chargeType_div {
                margin-right: 10px;
            }

            .coach {
                margin-bottom: 10px;
            }

            .classes_btn {
                margin-bottom: 10px;
            }

            .btn_line {
                margin-bottom: 10px;
            }
        }
    }
</style>