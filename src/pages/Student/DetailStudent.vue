<template lang='html'>
    <div>
         <div class='student_header basic-container'>
            <el-row>
            <el-col :span="3">
                <div style="width: 200px;">
                    <ImageBar :load="studentData.headImg" :fail='studentImg' width="100" class="student_avatar"></ImageBar>
                    <div class="edit" @click="edit" v-if="getFourRoleArr('student/editStudent')">{{$t('form.edit')}}></div>
                </div>
            </el-col>
            <el-col :span="21">
                 <el-row class="list_row">
                    <el-col :span="4">{{studentData.stuName}} {{studentData.sexDisplay}}
                       <!-- {{studentData.age}}{{$t('student.ageLabel')}} -->
                       </el-col>
                    <el-col :span="4">{{$t('student.birthDtLabel')}}:{{studentData.birthDt}}</el-col>
                    <el-col :span="4">{{$t('student.telLabel')}}:{{studentData.tel}}</el-col>
                    <el-col :span="4">{{$t('student.campusIdLabel')}}:{{studentData.campusName}}</el-col>
                    <!-- <el-col :span="4">{{$t('student.followMemberLabel')}}:{{studentData.memberName}}  <span class="member_change" @click="setFollowBy">{{$t('student.change')}}></span></el-col> -->
                 </el-row>
                <el-row class="list_row">
                  <el-col :span="4">{{$t('student.clasStatusLabel')}}:{{studentData.clasStatusDisplay}}</el-col>
                  <el-col :span="4">{{$t('student.schoolLabel')}}:{{studentData.school}}</el-col>
                  <el-col :span="4">{{$t('student.stuTypeLabel')}}:{{studentData.stuTypeDisplay}}</el-col>
                </el-row>
                 <!-- <el-row class="list_row">
                    <el-col :span="24"><span class="title">{{$t('student.teachLevel')}}:</span>
                      <span class="col_pad" v-for="item in studentData.teachlevels" :key="item.id">{{item}}</span>
                    </el-col>
                 </el-row> -->
                 <el-row class="list_row">
                   <!-- <el-col :span="4"><span class="title">{{$t('student.score')}}:</span>{{studentData.score}}{{$t('student.score')}} <span class="score_detail" @click="viewSoreDetail">{{$t('student.detail')}}></span></el-col> -->
                 </el-row>
                  <el-row class="list_row" style="width:1060px;">
                    <el-col :span="12" v-for="item in studentData.stuClas" :key="item.id">
                      <el-col :span="6" class="text_over class_name">{{item.clasName}}</el-col>
                      <el-col :span="18">
                        <el-col :span="11" class="col_pad" v-for="note in item.classStuTimes" :key="note.id">
                          {{note.weekName}} {{note.startTime}}-{{note.endTime}}
                        </el-col>
                      </el-col>
                    </el-col>
                  </el-row>
            </el-col>
            </el-row>
            <el-row class="btn_t">
              <!-- <el-button @click="handleClick(0)" class="bg" v-if="getFourRoleArr('student/groupOfClass')"  round>{{$t('student.groupOfClass')}}</el-button> -->
              <!-- <el-button @click="handleClick(1)" class="bg" v-if="getFourRoleArr('student/trainees')" round>{{$t('student.trainees')}} </el-button> -->
              <!-- <el-button @click="handleClick(2)" class="bg" v-if="getFourRoleArr('student/newAccount')" round>{{$t('student.newAccountOpen')}}</el-button> -->
              <!-- <el-button @click="handleClick(3)" class="bg"  round>{{$t('student.setStudentLoseStatus')}}</el-button> -->
              <!-- <el-button @click="handleClick(4)" class="bg" round>{{$t('student.inCreaseStuScore')}} </el-button> -->
              <!-- <el-button @click="handleClick(5)" class="bg" v-if="getFourRoleArr('student/costBusiness')" round>{{$t('student.costBusiness')}}</el-button> -->
              <el-button @click="handleClick(0)" class="bg" round>{{$t('student.renew')}}</el-button>
            </el-row>
          </div>
          <el-tabs type="border-card" class="tab" @tab-click="changeTab">
              <el-tab-pane>
                  <span slot="label">{{$t('student.consume')}}</span>
                  <Consume v-if="index==='0'" class="basic-container"></Consume>
              </el-tab-pane>
               <el-tab-pane>
                  <span slot="label">{{$t('student.costRecord')}}</span>
                  <CostRecord v-if="index==='1'" class="basic-container"></CostRecord>
              </el-tab-pane>
               <el-tab-pane>
                  <span slot="label">{{$t('student.cardPurchaseRecord')}}</span>
                  <CardPurchaseRecord v-if="index==='2'" class="basic-container"></CardPurchaseRecord>
              </el-tab-pane>
          </el-tabs>
          <Dialog ref="dialog1" :title="$t('student.setAllFollowBy1')" @submit="submit1">
            <template slot="content">
              <el-row>
                <SearchBar width="100%" link="system/associative" :placeholder="$t('student.inputFollowBy')" :title="$t('student.inputFollowBy')" v-model="formData1.followMemberId" :nameLike="formData1.memberName" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"  :editSearchOpt="true"></SearchBar>
              </el-row>
              <hr style="margin-top:20px;margin-bottom: 0px;">
              <el-row style="padding-top:20px;">
                {{$t('student.updateRecord')}}
              </el-row>
              <el-row style="padding-top:20px;">
              <TimeLine>
                <TimeLineItem
                  v-for="(item, index) in followData"
                  :key="index"
                  >
                  {{item.followDt}}&nbsp;&nbsp;&nbsp;&nbsp;{{$t('student.changeMan')}}{{item.memberName}}
                </TimeLineItem>
              </TimeLine>
              </el-row>
            </template>
          </Dialog>
           <Dialog ref="dialog2" :title="$t('student.setAllFollowBy1')" @submit="submit2">
           <el-form ref="formData2" :rules="rules" slot="content" :model="formData2" label-width="200px">
              <el-form-item :label="$t('student.stuStatusLabel')" prop="stuStatus">
                 <SelectOpt v-model="formData2.stuStatus" ref="stuStatus" :data="codeData.loseStatus" :placeholder="$t('student.stuStatus')"></SelectOpt>
              </el-form-item>
            </el-form>
          </Dialog>
          <!-- <AddScore ref="addScore" @isSubmit="getSubmitStatus"></AddScore> -->
      </div>
</template>
<script>

import studentImg from "assets/img/student.png"
import ImageBar from 'common/ImageBar';
import AccountInfo from './Components/AccountInfo';
import Consume from "./Components/Consume";
import CostRecord from "./Components/CostRecord";
import CardPurchaseRecord from "./Components/CardPurchaseRecord";
import Dialog from "common/Dialog";
import SearchBar from "common/SearchBar";
import SelectOpt from "common/SelectOpt";
import TableBar from "common/TableBar";
import {getCookie,getCode,clone,isEmpty,getTableSectionData,validateForm,bindData } from "assets/js/reused";
import TimeLine from "common/TimeLine/Timeline";
import TimeLineItem from "common/TimeLine/TimeLineItem";
export default {
  name: "detailStudent",
  components: {
   AccountInfo,
   ImageBar,
   Dialog,
   SearchBar,
   TableBar,
   SelectOpt,
   Consume,
   TimeLine,
   TimeLineItem,
   CostRecord,
   CardPurchaseRecord
  },
  data() {
    return {
      index: "0",
      studentData:{},
      studentData1:[],//根据人选择里面的
      codeData:{},
      rules:{
        stuStatus:[{
          required: true,
          message: this.$t('form.required'),
          trigger: "blur"
        }]
      },
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      formData1:{
        followMemberId:null,
        memberName:null
      },
      formData2:{
        stuStatus:null
      },
      followData:[],
      colConfigs1:[
				{ prop: 'stuName', label:this.$t('student.stuNameLabel')},
				{ prop: 'clasNames',label:this.$t('student.clasNamesLabel')},
				{ prop: 'followMemberName',label:this.$t('student.followMemberNameLabel')},
			],
      studentImg:studentImg
    };
  },
  created(){
     this.init()
  },
  methods: {
    changeTab(v) {
      this.index = v.index;
    },
    pushCallbackFn(element){
			return {
				value:element.display ,//显示需要的
				id: element.value
			}
    },
    edit(){
      this.$store.commit("addTabAndActive", {
          url: "/student/editStudent",
          data:{
            stuId:this.$route.query.stuId
          }
      });
    },
		searchOptFn(v){
        return {"keyword":"member","insId":getCookie("insId"),"assVal":v}
    },
    handleClick(status){
			let obj={
				0:()=>{
					this.$store.commit("addTabAndActive", {
						url: "/student/renew",
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
          this.$refs.addScore.show()
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
    async init(){
      await this.default()
      this.codeData=await getCode("_lose_status");
    },
    async default(){
       this.studentData=await post("stu/detail",{
           stuId:this.$route.query.stuId
       })
      this.studentData1=[this.studentData];
    },
    async getFollowLog(){
      this.followData=await post("studentfollow/stu_follow_log_find",{
        stuId:this.$route.query.stuId
      });
    },
    viewSoreDetail(){
       this.$store.commit("addTabAndActive", {
          url: "/student/score",
          data:{
            stuId:this.$route.query.stuId,
          }
        });
    },
    setFollowBy(){
      	//设置跟进人
			this.formData1.memberName=this.studentData.memberName+" "+this.studentData.tel;
      this.formData1.followMemberId=this.studentData.followMemberId;
      this.getFollowLog();
			this.$refs.dialog1.show()
    },
    async getSubmitStatus(){
       await this.default()
    },
    submit1(){
      let formData = clone(this.formData1);
      if (formData.followMemberId === 0 || isEmpty(formData.followMemberId)) {
          this.$alert(this.$t('student.msg4'))
          return
      }
      formData.stuIds =this.$route.query.stuId;
      delete formData["memberName"]
      this.$axios.post({
          url: baseURL + "student/charge_member",
          data: formData,
          success: (res) => {
              this.$message({
                  message: res.message,
                  type: 'success'
              })
              this.$refs.dialog1.close()
              this.init()
          }
      })
    },
    submit2(){
       let formData = clone(this.formData2);
       formData.stuId=this.$route.query.stuId;
        validateForm({
            form: this.$refs["formData2"],
            formData: formData,
            url: "student/stu_status_edit",
            success:(res)=>{
                this.$message({
                message:res.message,
                type: 'success'
                })
                this.$refs.dialog2.close()
            }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
    .student_header{
        .list_row{
            margin-bottom: 10px;
            line-height: 24px;
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
    .tab {
     border-top: 1px solid #ddd;
    }
</style>
