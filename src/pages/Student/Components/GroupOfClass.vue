<template lang='html'>
    <el-row class="group_of_class">
        <el-col :span="4" class="border">
            <ImageBar :load="studentData.headImg" :fail='studentImg' width="100" class="student_avatar"></ImageBar>
            <el-row class="group">
                <el-col class="title">{{studentData.stuName}} {{studentData.sexDisplay}} {{studentData.age}}{{$t('student.ageLabel')}}</el-col>
                <el-col class="text_center"><span class="col_pad" style="margin-bottom:10px;" v-for="item in studentData.trainNameLevels" :key="item.id">{{item.trainName}} · {{item.trainLevelName}}</span></el-col>
            </el-row>
             <el-row class="group" v-for="item in studentData.stuClass" :key="item.id">
                <el-col class="title">{{item.clasName}}</el-col>
                <el-col class="week" v-for="note in item.classStuTimes" :key="note.id"><span class="col_pad">{{note.weekName}}  {{note.startTime}} - {{note.endTime}}</span></el-col>
            </el-row>
        </el-col>
        <el-col :span="20">
            <span class="content_edit">{{$t('student.contentEdit')}}</span>
            <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
                <el-form-item :label="$t('student.campusIdLabel')" prop="campusId">
                    <SelectOpt  v-model="formData.campusId" :data="campusData" @change="getCampusId" id="campusId" val="campusName" :placeholder="$t('student.campusId')" ref="campusId"></SelectOpt>
                </el-form-item>
                <el-form-item :label="$t('student.trainIdLabel')" prop="trainId">
                   <SelectOpt v-if="formData.campusId" v-model="formData.trainId" :data="trainClass" id="trainId" val="trainName" :placeholder="$t('student.trainId')" ref="trainId"></SelectOpt>
                </el-form-item>
                <el-form-item :label="$t('student.classesIdLabel')" prop="classesId">
                    <SearchBar @change="getClassId" link="system/associative" :placeholder="$t('student.classesId')" :title="$t('student.classesId')" v-model="formData.classesId" :nameLike="formData.className" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn" :editSearchOpt="true"></SearchBar>
                </el-form-item>
                <!-- <el-form-item :label="$t('student.classIdLabel')" ref="classId" prop="classId">
                   <SelectOpt v-model="formData.classId" :data="campusData" :placeholder="$t('student.classId')" ref="classId"></SelectOpt>
                </el-form-item> -->
                <el-form-item :label="$t('student.classHourLabel')" required>
                    <el-row class="class_hour_div" v-if="classHour.length>0">
                         <template v-for="item in classHour">
                            <el-col :span="3"   :key="item.id" class="text_center">
                                <span class="bg_gray">{{item.weekName}}</span>
                                <el-row v-for="note in item.time" :key="note.id">
                                    <el-col @click.native="chooseTime(note)"><span class="bg_gray cur" :class="{isChecked:note.isChecked}">{{note.startTime}}-{{note.endTime}}</span></el-col>
                                </el-row>
                            </el-col>
                        </template>
                    </el-row>
                    <el-row class="class_hour_div" v-else>{{$t("components.msg1")}}</el-row>
                </el-form-item>
                <el-form-item>
                    <el-row class="btn_bottom">
                        <el-button type="primary" @click="cancel('formData')" class="submit_button">{{$t('form.cancel')}}</el-button>
                        <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.submit')}}</el-button>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
    import ImageBar from "common/ImageBar";
    import studentImg from "assets/img/student.png";
    import SelectOpt from "common/SelectOpt";
    import SearchBar from "common/SearchBar";
    import {clone,isEmpty,validateForm,getCookie} from "assets/js/reused";
     export default {
        name: 'groupOfClass',
        components:{
            ImageBar,
            SearchBar,
            SelectOpt
        },
        data () {
            return{
                studentData:{},
                campusData:[],
                trainClass:[],
                formData:{
                    trainId:null,
                    campusId:null,
                    classesId:null,
                    className:null,
                    classesTimeIds:[]
                },
                studentImg:studentImg,
                classHour:[],
                rules:{
                    campusId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    trainId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }],
                    classesId:[{
                        required: true,
                        message:this.$t('form.required'),
                        trigger: "change"
                    }]
                }
            }
        },
        created(){
            this.init()
        },
        methods:{
             async init(){
                let data=await post("student/campu_train_find",{
                    stuId:this.$route.query.stuId
                })
                this.campusData=data.right;
                this.studentData=data.left[0];
                this.$nextTick(()=>{
                    this.$refs.campusId.selectDefaultData();
                })
            },
            searchOptFn(v){
                return {campusId:this.formData.campusId,trainId:this.formData.trainId,keyword:"clas",assVal:v,unClasIds:this.campusData.clasIds}
            },
            pushCallbackFn(element){
                return {
                    value:element.display ,//显示需要的
                    id: element.value
                }
            },
            chooseTime(item){
                item.isChecked=!item.isChecked;
            },
            getCampusId(v){
                if(this.campusData){
                    this.campusData.map((element)=>{
                        if(element.campusId===v){
                             this.trainClass=element.trainClass;
                        }
                    })
                }
                if(this.$refs.trainId){
                    this.$refs.trainId.selectDefaultData()
                }
            },
            async getClassId(v){
              this.classHour=await post("student/class_time_find",{
                  clasId:v
              })
            },
            submitForm(){
                 let formData = clone(this.formData);
                 this.classHour.map((item)=>{
                     if(item.time&&item.time.length>0){
                        item.time.map((note)=>{
                            if(note.isChecked===true){
                                formData.classesTimeIds.push(note.clasTimeId)
                            }
                        })
                     }
                 })
                 if(isEmpty(formData.classesTimeIds)){
                    this.$alert(this.$t("student.msg5"))
                    return
                 }
                 formData.stuId=this.$route.query.stuId;
                 delete formData["campusId"];
                 delete formData["className"];
                formData.classesTimeIds=formData.classesTimeIds.toString()
                validateForm({
                    form: this.$refs["formData"],
                    formData: formData,
                    url: "student/stu_to_class_add",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                        this.$store.commit("deleteTabAndGo")
                    }
                });
            },
            cancel(){
                this.$store.commit("deleteTabAndGo")
            }
        }
    }
</script>
<style lang="scss" scoped>
.group_of_class{
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
    .group{
        // margin-bottom:20px;
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
}

</style>