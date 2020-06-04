<template lang='html'>
   <div class='classSchedulingView'>
        <FullCalendar ref="fullCalendar" v-on:elementEvent="getElement" v-on:selectViewData="getSelectData" v-on:viewValue="getViewValue" v-on:weekTime="getWeekTime" v-on:submit="submitForm"
            v-on:edit="editForm"
            :fullCalendarNewData="fullCalendar"
            v-on:pageData="getPageData"
            v-on:startTime="getStartTime"
        >
            <div slot="add" >
                <div v-if="viewId=='1'">
                     <AddForTimeView ref="form1"></AddForTimeView>
                </div>
            </div>
            <div slot="edit" >
                <div v-if="viewId=='1'">
                     <EditForTimeView ref="form2"></EditForTimeView>
                </div>
            </div>
        </FullCalendar>
    </div> 
</template>
<script>
import {
  getCookie,
  deleteField,
  getRoleArr
} from "assets/js/reused";
import FullCalendar from "common/FullCalendar";
import AddForTimeView from "./AddForTimeView";
import EditForTimeView from "./EditForTimeView";

export default {
  name: "classSchedulingView",
  components: {
    FullCalendar,
    AddForTimeView,
    EditForTimeView,
  },
  data() {
    return {
      value: "选项1",
      viewId: "1",
      formData: {
        day: "",
        date: "",
        endDt: "",
        startDt: "",
        startTime: "",
        endTime: "",
        teachCourseId: "",
        hour: "",
        num: "",
        price: "",
        classesId: "",
        trainCategoryId: "",
        checkData: [false, false, false],
        classesTimeTeacherList: [
          {
            coachNameLike: "",
            memberId: "",
            teachType: ""
          }
        ]
      },
      fullCalendar: {},
      classData: "",
      checkObj: "",
      chargeType: [],
      memberType: [],
      weekTime: "",
      editStatus: ""
    };
  },
  created() {
   
    this.init();
  },
  mounted() {
  },
  methods: {
    getRoleArrs(roterStr) {
      return getRoleArr(roterStr);
    },
    init() {
    //   this.getCodeDataFn();
    //   this.getClassData().then(res => {
    //     this.classData = res;
    //   });
    },
    getElement(callback, obj) {
      let keyArr = ["title"];
      // console.log(obj)
      for (let key in obj) {
        if (keyArr.indexOf(key) > -1) {
          // console.log(obj[key])
          callback(obj[key]);
        }
      }
    },
    getCodeDataFn() {
    //   getCodeData("charge_type,member_type").then(res => {
    //     //签到扣课
    //     this.chargeType = res.charge_type;
    //     this.chargeType.pop();
    //     this.memberType = res.member_type;
    //     //绑定老师类型的默认值
    //     this.formData.classesTimeTeacherList[0].teachType = this.memberType[0].codeValue;
    //   });
    },
    getClassScheduing(obj) {
      return new Promise((resolve, reject) => {
        this.$axios.post({
          url: baseURL + "clashour/find_view",
          data: obj,
          success: res => {
            this.fullCalendar=this.setfullCalendar(res.data,obj.beginDt,obj.endDt);
          }
        });
      });
    },
    getSelectData(v) {
      //获取选择视图的值
      this.weekTime = v;
      let obj={
          beginDt:v.startDt,
          endDt:v.endDt
      }
      this.getClassScheduing(obj);
    },
    //点击添加或者修改的时候,初始化
    async getViewValue(v) {
      this.viewId = v.viewId;
      this.editStatus = v.editStatus;
      // if (this.editStatus == "1") {
      //     this.$refs["fullCalendar"].dialogHideOrShow(true);
      // } else if (this.editStatus == "2") {
      //     this.$refs["fullCalendar"].dialogHideOrShow(true);
      // }
      // if (this.viewId == "1") {
      //   if (this.editStatus == "1") {
      //     this.$refs["form1"] && this.$refs["form1"].init();
      //   } else if (this.editStatus == "2") {
      //     this.$refs["form2"] && this.$refs["form2"].init();
      //   }
      // } else if (this.viewId == "2") {
      //   if (this.editStatus == "1") {
      //     let form3=await this.domLoaed(this.$refs["form3"]);
      //       v.leftConfig.forEach(element => {
      //         if (element.title == v.title) {
      //         form3.getClassId(element.id);
      //         }
      //       });
      //     form3.init();
      //   } else if (this.editStatus == "2") {
      //     let form4=await this.domLoaed(this.$refs["form4"]);
      //       v.leftConfig.forEach(element => {
      //         if (element.title == v.title) {
      //         form4.getClassId(element.id);
      //         }
      //       });
      //     form4.init();
      //   }
      // } else if (this.viewId == "3") {
      //   if (this.editStatus == "1") {
      //     let form5=await this.domLoaed(this.$refs["form5"]);
      //       v.leftConfig.forEach(element => {
      //         if (element.title == v.title) {
      //         form5.getClassId(element.id);
      //         }
      //       });
      //     form5.init();
      //   } else if (this.editStatus == "2") {
      //     let form6=await this.domLoaed(this.$refs["form6"]);
      //       v.leftConfig.forEach(element => {
      //         if (element.title == v.title) {
      //         form6.getClassId(element.id);
      //         }
      //       });
      //     form6.init();
      //   }
      // }
      if(this.viewId==="1"&&this.editStatus===1){
        this.$store.commit("addTabAndActive", {
          url: "/classHour/addClassHour",
          data: {
            startTime:v.leftTitle,
            day:v.day
          }
        });
      }else if(this.viewId==="2"&&this.editStatus===1){
        let classesId;
        v.leftConfig.forEach((item)=>{
          if(v.leftTitle===item.title){
            classesId=item.id;
          }
        })
        this.$store.commit("addTabAndActive", {
          url: "/classScheduling/addClassScheduling",
          data: {
            classesId:classesId,
            day:v.day
          }
        });
      }else if(this.viewId==="1"&&this.editStatus===2){
        if(v.element.bg===1){
          this.$store.commit("addTabAndActive", {
            url: "/classHistorySchedule/classScheduDetail",
            data: {
            classesHourId:v.element.id,
            classesId:v.element.classesId,
            campusId:v.element.campusId,
            trainCategoryId:v.element.trainId
            }
          });
        }else{
          this.$store.commit("addTabAndActive", {
            url: "/classHour/editClassHour",
            data: {
            clasHourId:v.element.clasHourId
            }
          });
        }
      }else if(this.viewId==="2"&&this.editStatus===2){
        if(v.element.bg===1){
          this.$store.commit("addTabAndActive", {
            url: "/classHistorySchedule/classScheduDetail",
            data: {
            classesHourId:v.element.id,
            classesId:v.element.classesId,
            campusId:v.element.campusId,
            trainCategoryId:v.element.trainId
            }
          });
        }else{
          this.$store.commit("addTabAndActive", {
            url: "/classScheduling/classScheduDetail",
            data: {
            classesHourId:v.element.id,
            classesId:v.element.classesId,
            campusId:v.element.campusId,
            trainCategoryId:v.element.trainId
            }
          });
        }
      }
    },
    domLoaed(dom){
      return new Promise((resolve,reject)=>{
        let timeId=setInterval(()=>{
        if(dom!==undefined){
          clearInterval(timeId)
          resolve(dom)
        }
      })
      })
    },
    setfullCalendar(obj,startDt,endDt){
        let newObj={
            fullCalenDarData:{
                container: "monitor",
                eventDivWidth: "173",
                leftTitle:"时间",
                toDayDate:null,
                limit: 4,
                startDt:startDt,
                endDt:endDt,
                topList:[
                    {eventBg: "#00f", eventTitle: "未上课"},
                    {eventBg: "#709c70", eventTitle: "已经上课"},
                    {eventBg: "#008000", eventTitle: "已完成"}
                ]
            },
            viewOptions:[
            {
                viewId: "1",
                label: "时间视图"
            }]
        };
        newObj.fullCalenDarData.leftConfig=Object.keys(obj).map((item)=>{
            return {title:item}
        });
        newObj.fullCalenDarData.tableData=Object.values(obj).map((element)=>{
           return element.map((note)=>{
               return note.map((x)=>{
                    x.title=x.clasName;
                    x.bg=x.clasHourStatus;
                    return x;
                })
            })
        });
        return newObj;
    },
      //提交添加组件
    submitForm(obj) {
      if (this.viewId == "1") {
        this.$refs["form1"]
          .submitForm(obj)
          .then(res => {
            //控制fullCalendar的dialog显示或者隐藏
            this.$refs["fullCalendar"].dialogHideOrShow(false);
            this.$message({
              message: res.message || "修改成功",
              type: "success"
            });
            this.getClassScheduing(this.weekTime);
          })
          .catch(res => {
            this.$refs["fullCalendar"].dialogHideOrShow(true);
            this.$message({
              message: res.message || "修改失败",
              type: "error"
            });
          });
      } else if (this.viewId == "2") {
        this.$refs["form3"]
          .submitForm(obj)
          .then(res => {
            //控制fullCalendar的dialog显示或者隐藏
            this.$refs["fullCalendar"].dialogHideOrShow(false);
            this.$message({
              message: res.message || "修改成功",
              type: "success"
            });
            this.getClassScheduing(this.weekTime);
          })
          .catch(res => {
            this.$refs["fullCalendar"].dialogHideOrShow(true);
            this.$message({
              message: res.message || "修改失败",
              type: "error"
            });
          });
      } else if (this.viewId == "3") {
        this.$refs["form5"]
          .submitForm(obj)
          .then(res => {
            //控制fullCalendar的dialog显示或者隐藏
            this.$refs["fullCalendar"].dialogHideOrShow(false);
            this.$message({
              message: res.message || "修改成功",
              type: "success"
            });
            this.getClassScheduing(this.weekTime);
          })
          .catch(res => {
            this.$refs["fullCalendar"].dialogHideOrShow(true);
            this.$message({
              message: res.message || "修改失败",
              type: "error"
            });
          });
      }
    },
      //触发添加组件
    editForm(obj) {
      if (this.viewId === "1") {
        this.$refs["form2"]
          .submitForm(obj)
          .then(res => {
            //控制fullCalendar的dialog显示或者隐藏
            this.$refs["fullCalendar"].dialogHideOrShow(false);
            this.$message({
              message: res.message || "修改成功",
              type: "success"
            });
            this.getClassScheduing(this.weekTime);
          })
          .catch(res => {
            this.$refs["fullCalendar"].dialogHideOrShow(true);
            this.$message({
              message: res.message || "修改失败",
              type: "error"
            });
          });
      } else if (this.viewId === "2") {
        this.$refs["form4"]
          .submitForm(obj)
          .then(res => {
            //控制fullCalendar的dialog显示或者隐藏
            this.$refs["fullCalendar"].dialogHideOrShow(false);
            this.$message({
              message: res.message || "修改成功",
              type: "success"
            });
            this.getClassScheduing(this.weekTime);
          })
          .catch(res => {
            this.$refs["fullCalendar"].dialogHideOrShow(true);
            this.$message({
              message: res.message || "修改失败",
              type: "error"
            });
          });
      }else if(this.viewId === "3"){
         this.$refs["form6"]
          .submitForm(obj)
          .then(res => {
            //控制fullCalendar的dialog显示或者隐藏
            this.$refs["fullCalendar"].dialogHideOrShow(false);
            this.$message({
              message: res.message || "修改成功",
              type: "success"
            });
            this.getClassScheduing(this.weekTime);
          })
          .catch(res => {
            this.$refs["fullCalendar"].dialogHideOrShow(true);
            this.$message({
              message: res.message || "修改失败",
              type: "error"
            });
          });
      }
    },
    getClassData() {
      //获取班级数据
      return new Promise((resolve, reject) => {
        this.$axios.post({
          url: baseURL + "classes/find",
          data: {},
          success: res => {
            resolve(res.data);
          }
        });
      });
    },
    //选择教练
    handleSelectCoach(v, b) {
      this.formData.classesTimeTeacherList[b].memberId = v.memberId;
    },
    //删除教练
    removeCoach(b) {
      this.formData.classesTimeTeacherList.splice(b, 1);
    },
    getMemberId(v) {
      return new Promise((resolve, reject) => {
        this.$axios.post({
          url: baseURL + "member/name_find",
          data: {
            nameLike: v
          },
          success: res => {
            resolve(res);
          }
        });
      });
    },
    //模糊匹配选择教练
    querySearchAsyncCoach(queryString, cb) {
      this.coachList = [];
      this.getMemberId(queryString).then(res => {
        res.data.forEach(element => {
          this.coachList.push({
            value: element.name,
            memberId: element.memberId
          });
        });
        cb(this.coachList);
      });
    },
    getWeekTime(v) {
      this.weekTime = v;
       let obj={
          beginDt:v.startDt,
          endDt:v.endDt
      }
      this.getClassScheduing(obj);
    },
    getStartTime(v) {
      setTimeout(() => {
        this.$refs["form1"] && this.$refs["form1"].setStartTime(v);
      });
    },
      //获得修改当前页数据
    getPageData(v) {
      // if (this.viewId == "1") {
      //   setTimeout(() => {
      //     this.$refs["form2"] && this.$refs["form2"].getPageData(v);
      //   });
      // } else if (this.viewId == "2") {
      //   setTimeout(() => {
      //     this.$refs["form4"] && this.$refs["form4"].getPageData(v);
      //   });
      // } else if (this.viewId == "3") {
      //   setTimeout(() => {
      //     this.$refs["form6"] && this.$refs["form6"].getPageData(v);
      //   });
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
.classSchedulingView {
    padding-bottom: 15px;
    margin-top: 15px;
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 20px;
    }
    /*滚动条里面小方块*/
    &::-webkit-scrollbar-thumb {
      background: #d7e0e7;
    }
    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: #f8f8f8;
    }
  }
</style>