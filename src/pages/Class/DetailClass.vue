<template lang='html'>
    <div class="class_detail">
      <el-col :span="18" class='class_header'>
         <div  class="class_top mb_10">
            <el-row>
            <el-col :span="3">
                <div style="width: 200px;">
                    <ImageBar :load="classData.logoImg" :fail='classImg' width="100" class="student_avatar"></ImageBar>
                    <div class="edit" @click="edit">{{$t('form.edit')}}></div>
                </div>
            </el-col>
            <el-col :span="21">
                 <el-row class="list_row">
                    {{classData.clasName}}
                 </el-row>
                 <el-row class="list_row">
                    <el-col :span="4">
                      <span class="title">{{$t('class.campusIdLabel')}}:</span>
                      <span>{{classData.campusName}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span class="title">{{$t('class.clasStatusLabel')}}:</span>
                      <span>{{classData.clasStatusDisplay}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span class="title">{{$t('class.campusFieldIdLabel')}}:</span>
                      <span>{{classData.fieldName}}</span>
                    </el-col>
                    <el-col :span="8">
                       <span class="title">{{$t('class.deductValLabel')}}:</span>
                      <span>{{classData.deductVal}} {{$t('unit.cardVal')}}/{{$t('unit.class')}}</span>
                    </el-col>
                 </el-row>
                  <el-row class="list_row" style="width:1060px;">
                      <el-col :span="5" v-for="(item,index) in classData.clasTimeVos" :key="item.id" :style="{background:weekBg[item.week]}" class="col_pad cur" @click.native="classTimeClick()">
                         {{item.weekDisplay}} {{item.startTime}}-{{item.endTime}}
                      </el-col>
                  </el-row>
            </el-col>
            </el-row>
          </div>
          <el-row class="coach_row">
            <el-col :span="12">
              <el-col :span="6" class="coach_line">
                {{$t("class.headCoachLabel")}}
              </el-col>
              <el-col :span="18">
                 <el-col :span="4" class="coach"  v-for="element in headCoachVos" @click.native="classTeacherClick()" :key="element.id">
                    <div class="rel"><ImageBar :load="element.headImg" :fail='classImg' width="45" class="coach_avatar"></ImageBar></div>
                    <div class="coach_name">{{element.memberName}}</div>
                 </el-col>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-col :span="6" class="coach_line">
                {{$t("class.assistantLabel")}}
              </el-col>
              <el-col :span="18">
                 <el-col :span="4" class="coach"  v-for="element in otherCoachVos" @click.native="classTeacherClick()" :key="element.id">
                    <div class="rel"><ImageBar :load="element.headImg" :fail='classImg' width="45" class="coach_avatar"></ImageBar>
                    <!-- <i class="el-icon-error del" @click="delTchr(element.clasTchrId)"></i> -->
                    </div>
                    <div class="coach_name">{{element.memberName}}</div>
                 </el-col>
              </el-col>
            </el-col>
          </el-row>
          <el-tabs type="border-card" class="tab" @tab-click="changeTab">
              <el-tab-pane>
                  <span slot="label">{{$t('class.classRecord')}}</span>
                  <ClassRecord v-if="index==='0'" class="basic-container"></ClassRecord>
              </el-tab-pane>
          </el-tabs>
          <HourStudent ref="hourStudent"></HourStudent>
          <ClassTime ref="classTime" @isSubmit="getSubmitStatus"></ClassTime>
          <ClassTeacher ref="classTeacher" @isSubmit="getSubmitStatus"></ClassTeacher>
      </el-col>
       <el-col :span="6" class="student"><StudentList ref="studentList" :campusId="classData.campusId" @isSubmit="getSubmitStatus"></StudentList></StudentList></el-col>
    </div>
</template>
<script>

import classImg from "assets/img/student.png"
import ImageBar from 'common/ImageBar';
import Dialog from "common/Dialog";
import SearchBar from "common/SearchBar";
import SelectOpt from "common/SelectOpt";
import TableBar from "common/TableBar";
import {getCookie,getCode,clone,isEmpty,getTableSectionData,validateForm,bindData } from "assets/js/reused";
import HourStudent from "./Components/HourStudent";
import StudentList from "./Components/StudentList";
import ClassRecord from "./Components/ClassRecord";
import ClassTime from "./Components/ClassTime";
import ClassTeacher from "./Components/ClassTeacher";
export default {
  name: "detailStudent",
  components: {
   ImageBar,
   Dialog,
   SearchBar,
   TableBar,
   SelectOpt,
   HourStudent,
   StudentList,
   ClassRecord,
   ClassTime,
   ClassTeacher
  },
  data() {
    return {
      index:"0",
      classData:{},
      codeData:{},
      rules:{
        stuStatus:[{
          required: true,
          message: this.$t('form.required'),
          trigger: "blur"
        }]
      },
      formData1:{
        followMemberId:null,
        memberName:null
      },
      formData2:{
        stuStatus:null
      },
      weekBg:[
        "#3D78D4",
        "#dcc88e",
        "#5ea32a",
        "#2a8da3",
        "#c02666",
        "#cc4d11"
      ],
      headCoachVos:[],
      otherCoachVos:[],
      followData:[],
      colConfigs1:[
				{ prop: 'stuName', label:this.$t('student.stuNameLabel')},
				{ prop: 'clasNames',label:this.$t('student.clasNamesLabel')},
				{ prop: 'followMemberName',label:this.$t('student.followMemberNameLabel')},
			],
      classImg:classImg
    };
  },
  created(){
     this.init()
  },
  methods: {
    async init(){
      await this.default()
    },
    async default(){
     let data=await post("clas/detail",{
        clasId:this.$route.query.clasId
      });
     this.classData=data;
     this.headCoachVos=data.clasTchrVos.filter((item)=>item.tchrType==='0');
     this.otherCoachVos=data.clasTchrVos.filter((item)=>item.tchrType==='1');
     this.$nextTick(()=>{
      this.$refs.studentList.setStudents(data.clasStuVos);
      this.$refs.studentList.setClasTimeVos(data.clasTimeVos);
      this.$refs.studentList.setWeekBg(this.weekBg);
     })
    },
    changeTab(v) {
      this.index = v.index;
    },
    pushCallbackFn(element){
			return {
				value:element.display ,//显示需要的
				id: element.value
			}
    },
    delTchr(clasTchrId){
      this.$axios.post({
        url:baseURL+"clas/clas_time_tchr_delete",
        data:{
          clasTchrId
        },
        success:(res)=>{
          this.$message({
              message: res.message,
              type: 'success'
          });
          this.default()
        }
      })
    },
    edit(){
      this.$store.commit("addTabAndActive", {
          url: "/class/editClass",
          data:{
            clasId:this.$route.query.clasId
          }
      });
    },
    addCoach(tchrType){
      //tchrType 老师类型(0主教，1助教)
      let memberIds=[];
      for(let element of Object.values(this.clasTchrVos)){
        element.map((item)=>{
          memberIds.push(item.memberId)
        })
      }
      this.$refs.addCoach.open(tchrType,this.classData.campusId,memberIds)
    },
		searchOptFn(v){
        return {"keyword":"member","insId":getCookie("insId"),"assVal":v}
    },
    classTimeClick(){
      this.$nextTick(()=>{
        this.$refs.classTime.show(this.classData.clasTimeVos);
      });
    },
    classTeacherClick(){
      this.$nextTick(()=>{
        this.$refs.classTeacher.show(this.classData.clasTchrVos);
      });
    },
    handleClick(status){
			let obj={
				0:()=>{
					this.$store.commit("addTabAndActive", {
						url: "/student/groupOfClass",
						data:{
							stuId:this.$route.query.stuId
						}
					});
				},
				1:()=>{
					this.$store.commit("addTabAndActive", {
						url: "/student/groupOfClass",
						data:{
							stuId:this.$route.query.stuId
						}
					});
				},
				2:()=>{
					this.$store.commit("addTabAndActive", {
						url: "/student/newAccount",
						data:{
              stuId:this.$route.query.stuId,
              campusId:this.studentData.campusId,
              trainIds:this.studentData.trainIds
						}
					});
				},
				3:()=>{
          this.$refs.dialog2.show()
          this.$nextTick(()=>{
            bindData({formData:this.formData2,res:this.studentData})
            // this.$refs.stuStatus.selectDefaultData();
          })
        },
        4:()=>{
          this.$refs.hourStudent.show()
        },
        5:()=>{
          this.$store.commit("addTabAndActive", {
						url: "/student/costBusiness",
						data:{
              stuId:this.$route.query.stuId,
              campusId:this.studentData.campusId
						}
					});
        }
			}
			obj[status]();
		},
    async getSubmitStatus(){
       await this.default()
    }
  }
};
</script>

<style lang="scss" scoped>
.class_detail{
  display: table;
  .class_header{
    width: 1250px;
    margin-right: 15px;
    float: none;
        .list_row{
            margin-bottom: 10px;
            line-height: 24px;
        }
        .coach_row{
          background: #fff;
          border:1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
           .coach_line{
            line-height: 45px;
            text-indent: 20px;
            
          }
          .coach{
            cursor: pointer;
             .coach_avatar{
                text-align: center;
            }
            .del{
              position: absolute;
              top: 0;
              right: 12px;
              color: #148af2;
              cursor: pointer;
               display: none;
            }
            .coach_name{
              text-align: center;
              padding-top: 10px;
            }
          }
          .coach:hover{
            .del{
              display: block
            }
          }
         
        }
        .class_name{
          line-height: 28px;
        }
        /deep/ .student_avatar{
            &>div{
                max-height: 100px;
                max-width: 100px;
                overflow: hidden;
                text-align: center;
                margin: 0 auto;
                // height: 100px;
                // border-radius: 50%;
            }
        }
        .edit{
          margin-top: 10px;
          text-align:center;padding-top:6px; color:#3D78D4;
          cursor: pointer;
        }
        .member_change{
          color:#3D78D4;
          cursor: pointer;
        }
        .score_detail{
          color:#3D78D4;
          cursor: pointer;
        }
        .title{
          margin-right: 10px;
        }
        .col_pad{
          padding: 2px 20px;
          background: #3D78D4;
          color: #fff;
          border-radius: 5px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
        .btn_t{
          padding:20px 0px;
        }
        .bg{
          background: #3D78D4;
          color: #fff;
          border: none;
          width: 160px;
        }
    }
    .student{
      width: 402px;
      border:1px solid #ddd;
      display: table-cell;
      float: none;
      vertical-align: top;
      // border: 1px solid #ddd;
      overflow: hidden;
      background: #fff;
      border-radius: 5px;
    }
    .class_top{
      background: #fff;
      padding: 10px;
      border-radius: 5px;
      border:1px solid #ddd;
    }
}
    .tab {
     border: 1px solid #ddd;
     border-radius: 5px;
     overflow: hidden;
    }
</style>
