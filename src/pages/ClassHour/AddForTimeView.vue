<template lang='html'>
    <div class='add_for_time_view'>
        <el-form ref="formData" :rules="rules" :model="formData" label-width="150px">
                        <el-form-item label="班级" prop="classesId">
                              <el-col :span="8">
                            <el-select v-model="formData.classesId"  @change="classChange"  placeholder="请选择班级">
                                <el-option
                                v-for="item in classData"
                                :key="item.classesId"
                                :label="item.classesCampus"
                                :value="item.classesId">
                                </el-option>
                            </el-select>
                            </el-col>
                        </el-form-item>
                         <el-form-item label="上课时间" required>
                              <el-col :span="8">
                                <el-form-item prop="startTime">
                                    <el-time-picker
                                        placeholder="开始时间"
                                        v-model="formData.startTime"
                                        @change="clearable(formData)"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                      >
                                    </el-time-picker>
                                </el-form-item>
                            </el-col>
                             <el-col :span="8"  :offset="1">
                                  <el-form-item prop="endTime">
                                    <el-time-picker
                                        :disabled="formData.startTime==''||formData.startTime==null"
                                        placeholder="结束时间"
                                        v-model="formData.endTime"
                                         format="HH:mm"
                                        value-format="HH:mm"
                                        :picker-options="{
                                            selectableRange: formData.startTime!=null?`${formData.startTime}+':00' - 23:59:59`:''
                                        }">
                                    </el-time-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="老师/教练" v-for="(a,b) in formData.classesHourTeachers" :key="a.id" required>
                            <el-col :span="8">
                                <el-form-item :prop="'classesHourTeachers.' + b + '.memberId'" :rules="[
                                    { required: true, message: '必填', trigger: 'change' }
                                    ]">
                                    <SearchTeacher :nameLike="a.coachNameLike" v-model="a.memberId" :editSearchOpt="true" :searchOpt="searchOptFn"></SearchTeacher>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8"  :offset="1">
                                <el-form-item>
                                    <el-input v-model="a.callName" placeholder="请输入称谓"></el-input>
                                </el-form-item>
                            </el-col>
                             <el-col :span="5">
                                <el-form-item>
                                     <!-- <el-button v-if="b!=0" @click="removeCoach(b)">删除老师</el-button><el-button v-if="b==0" @click="addCoach">添加老师</el-button> -->
                                  <i  v-if="b==0" @click="addCoach" class="addIcon"></i>
                                  <i v-if="b!=0" @click="removeCoach(b)" class="removeIcon"></i>
                                </el-form-item>
                            </el-col>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </el-form-item>
                        <el-form-item label="上课场地" prop="field">
                            <el-col :span="17">

                            <el-input v-model="formData.field" placeholder="上课场地"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="签到扣课">
                          <span v-for="(b,aindex) in chargeType" class="chargeType_div">
                              <el-form-item v-if="b.codeId==13" prop="hour">
                                <input class="input_s"  v-model="formData.hour" :placeholder="'请输入'+b.codeDisplay">
                              </el-form-item>
                              <el-form-item v-if="b.codeId==14" prop="num">
                                <input class="input_s"  v-model="formData.num" :placeholder="'请输入'+b.codeDisplay">
                              </el-form-item>
                              <el-form-item v-if="b.codeId==15" prop="price">
                                <input class="input_s"  v-model="formData.price" :placeholder="'请输入'+b.codeDisplay">
                              </el-form-item>
                          </span>
                        <!-- <input v-if="b.codeId==13" class="input_s"  v-model="formData.hour" :placeholder="'请输入'+b.codeDisplay">
                              <input v-else-if="b.codeId==14" class="input_s"  v-model="formData.num" :placeholder="'请输入'+b.codeDisplay">
                              <input v-else-if="b.codeId==15" class="input_s"  v-model="formData.price" :placeholder="'请输入'+b.codeDisplay"> -->
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {
  debounce,
  getCodeData,
  getCookie,
  deleteField,
  selectDefaultData
} from "assets/js/reused";
import SearchTeacher from "common/SearchTeacher";
import { setTimeout } from 'timers';
export default {
  name: "addForTimeView",
  components:{
    SearchTeacher
  },
  data() {
    return {
      formData: {
        day: "",
        date: "",
        startTime: "",
        endTime: "",
        hour: "",
        num: "",
        price: "",
        field: "",
        classesId: "",
        checkData: [false, false, false],
        classesHourTeachers: [
          {
            coachNameLike: "",
            memberId: "",
            teachType: "",
            callName: ""
          }
        ]
      },
      rules: {
        field: [{ required: true, message: "必填", trigger: "blur" }],
        classesId: [{ required: true, message: "必填", trigger: "change" }],
        time: [{ required: true, message: "必填", trigger: "change" }],
        startTime: [{ required: true, message: "必选", trigger: "change" }],
        endTime: [{ required: true, message: "必选", trigger: "change" }],
        hour:[{ required: true, message: "必填", trigger: "blur" }],
        num:[{ required: true, message: "必填", trigger: "blur" }],
        price:[{ required: true, message: "必填", trigger: "blur" }]
      },
      classData:[],
      checkObj: "",
      chargeType: [],
      memberType: [],
      trainCategoryId:'',
    };
  },
  created() {
    debounce(this.init);
  },
  methods: {
    init() {
      this.formData = {
        day: "",
        date: "",
        startTime: "",
        endTime: "",
        hour: "",
        num: "",
        price: "",
        field: "",
        classesId: "",
        checkData: [false, false, false],
        classesHourTeachers: [
          {
            coachNameLike: "",
            memberId: "",
            teachType: "",
            callName: ""
          }
        ]
      };
      this.$refs["formData"].resetFields();
      this.getCodeDataFn();
      this.getClassData().then(res => {
        this.classData = res;
        this.formData.classesId=selectDefaultData(this.classData,"classesId")
      });
    },
    getData(v) {
      console.log(v);
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
    clearable(item) {
      item.endTime = "";
    },
    getCodeDataFn() {
      getCodeData("charge_type,member_type").then(res => {
        //签到扣课
        this.chargeType = res.charge_type;
        this.chargeType.pop();
        this.memberType = res.member_type;
        //绑定老师类型的默认值
        this.formData.classesHourTeachers[0].teachType = this.memberType[0].codeValue;
      });
    },
    searchOptFn(v){
      return { 
        nameLike: v,
        trainCategoryIdsNotEqualNull:1,
        trainCategoryIdFind:this.trainCategoryId
      }
    },
    getSelectData(v) {
      //获取选择视图的值
      console.log(v);
    },
    getViewValue(v) {
      //点击添加或者修改的时候,获取修改的视图值
      this.viewStatus = v;
    },
    addCoach() {
      //添加教练
      this.formData.classesHourTeachers.push({
        memberId: 0,
        teachType: this.memberType[0].codeValue
      });
    },
    submitForm(day) {
      return new Promise((resolve, reject) => {
        let validArr = [],
          errArr = [];
        let formData = {};
        let propArr = ["field", "classesId", "startTime", "endTime","hour","num","price"];
        this.formData.classesHourTeachers.forEach((element, index) => {
          propArr.push("classesHourTeachers." + index + ".memberId");
        });
        propArr.forEach(key => {
           this.$refs["formData"].validateField(key, err => {
              console.log(key, err);
              errArr.push(err);
            });
        });
        //校验签到扣课
        if (
          this.formData.hour === "" ||
          this.formData.num === "" ||
          this.formData.price === ""
        ) {
          this.$alert("签到扣课必填", "错误提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        //全部验证成功后
        if (errArr.every(v => v == "")) {
          formData = Object.assign(formData, this.formData);
          validArr.push(true);
        } else {
          validArr.push(false);
          return;
        }

        //获取日期时间
        formData.day = day;
        //常规班
        formData.classType = "0";
        // deleteField({arrField:["date","checkData"],formData:formData});

        deleteField({
          arrField: ["date", "checkData", "coachNameLike"],
          formData: formData
        });
        if (validArr.every(v => v == true)) {
          this.$axios.post({
            url: baseURL + "classeshour/add",
            data: formData,
            isSubmit: true,
            isDebounce: true,
            success: res => {
              resolve(res);
            },
            error: res => {
              reject(res);
            }
          });
        }
      });
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
      getCodeData("charge_type,member_type").then(res => {
        //签到扣课
        this.chargeType = res.charge_type;
        this.chargeType.pop();
        this.memberType = res.member_type;
        //绑定老师类型的默认值
        this.formData.classesHourTeachers[0].teachType = this.memberType[0].codeValue;
      });
    },
    getSelectData(v) {
      //获取选择视图的值
      console.log(v);
    },
    getViewValue(v) {
      //点击添加或者修改的时候,获取修改的视图值
      this.viewStatus = v;
    },
    getClassData() {
      //获取班级数据
      return new Promise((resolve, reject) => {
        this.$axios.post({
          url: baseURL + "classes/findClassCampus",
          data: {
            classType: "0"
          },
          success: res => {
            resolve(res.data);
          }
        });
      });
    },
    handleSelectCoach(v, b) {
      //选择教练
      this.formData.classesHourTeachers[b].memberId = v.memberId;
    },
    removeCoach(b) {
      //删除教练
      this.formData.classesHourTeachers.splice(b, 1);
    },
    getMemberId(v) {
      return new Promise((resolve, reject) => {
        this.$axios.post({
          url: baseURL + "member/name_find",
          data: {
            nameLike: v,
            trainCategoryIdIsNull: 1,
            trainCategoryIdFind: this.trainCategoryId
          },
          success: res => {
            resolve(res);
          }
        });
      });
    },
    classChange() {
      this.classData.forEach(element => {
        if (element.classesId == this.formData.classesId) {
          this.trainCategoryId = element.trainCategoryId;
        }
      });
    },
    querySearchAsyncCoach(queryString, cb) {
      //模糊匹配选择教练
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
      console.log(v);
    },
    setStartTime(v) {
      setTimeout(()=>{
        this.formData.startTime = v;
      })
    },
    checkboxChange(aindex, index) {
      if (aindex == 0) {
        this.formData.hour = "";
      } else if (aindex == 1) {
        this.formData.num = "";
      } else {
        this.formData.price = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-autocomplete,.el-date-editor.el-input,.el-select{
  width: 100%;
}
.add_for_time_view {
  .chargeType_div {
    margin-right: 10px;
    display: inline-block;
  }
  .input_s {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
  }
}
</style>