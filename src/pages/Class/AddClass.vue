<template lang='html'>
  <div class="add_class">
    <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form" :validate-on-rule-change="false">
        <el-row>
          <el-col :span="12">
              <el-form-item :label="$t('class.campusIdLabel')" prop="clas.campusId">
                <SelectOpt  v-model="formData.clas.campusId" :data="codeData.campusId" @change="campusChange" val='display' id='value' :placeholder="$t('student.campusId')" ref="campusId"></SelectOpt>
              </el-form-item>
              <el-form-item :label="$t('class.clasNameLabel')" prop="clas.clasName">
                <el-input v-model="formData.clas.clasName" :placeholder="$t('class.clasName')" :title="$t('student.stuName')"></el-input>
              </el-form-item>
               <el-col :span="15">
                <el-form-item :label="$t('class.deductValLabel')" prop="clas.deductVal">
                  <el-input v-model="formData.clas.deductVal" :placeholder="$t('class.deductVal')" :title="$t('class.deductVal')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" style="line-height:36px">
                {{$t('unit.cardVal')}}/{{$t('unit.class')}}
              </el-col>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('class.logoImgLabel')">
              <UploadImg ref="headImg" v-model="formData.clas.logoImg"></UploadImg>
            </el-form-item>
          </el-col>
        </el-row>
         <!-- <el-form-item label="周期类型" ref="periodType" prop="clas.periodType" :show-message="false">
          <RadioOpt v-model="formData.clas.periodType" @change="periodTypeChange" :data="codeData.periodType"></RadioOpt>
          <div v-if="formData.clas.periodType===1" style="width: 1360px;">
            <el-col :span="6">
              <el-form-item prop="clas.startDt" :rules="[{ required: true, message: '必选', trigger: 'change' }]">
                <DatePickerStart v-model="formData.clas" keyName="startDt" otherKeyName="endDt"></DatePickerStart>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="clas.endDt" :rules="[{ required: true, message: '必选', trigger: 'change' }]">
                <DatePickerEnd v-model="formData.clas" keyName="endDt" otherKeyName="startDt"></DatePickerEnd>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item> -->
        <el-form-item :label="$t('class.campusFieldIdLabel')" prop="clas.campusFieldId">
          <SelectOpt v-model="formData.clas.campusFieldId" :data="campusData" :placeholder="$t('class.campusFieldId')" ></SelectOpt>
        </el-form-item>
        <el-form-item :label="$t('class.headCoachLabel')"  prop="clasTchrs.0.memberId" :rules="[{
                    required:true,
                    message:$t('form.required'),
                    trigger: 'change'
                  }]">
           <SearchBar width="100%" link="system/associative" :placeholder="$t('class.headCoach')"
            :title="$t('class.headCoach')" v-model="formData.clasTchrs[0].memberId"
            :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
            :editSearchOpt="true"></SearchBar>
        </el-form-item>
        <el-form-item :label="$t('class.assistantLabel')">
          <el-row style="margin-bottom:10px"><i  @click.prevent="addClasTch()" class="addIcon"></i></el-row>
          <el-row v-for="(item,index) in formData.clasTchrs" :key="item.id" v-if="index!=0" class="tch mb_10">
              <el-col :span="22">
              <FormItem :label="$t('class.assistantLabel')" :isShowLabel="false">
                  <SearchBar width="100%" link="system/associative" :placeholder="$t('class.assistantLabel')"
                  :title="$t('class.assistant')" v-model="formData.clasTchrs[index].memberId"
                  :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                  :editSearchOpt="true"></SearchBar>
              </FormItem>
              </el-col>
              <el-col :span="2">
              <i  @click.prevent="removeClasTch(formData.clasTchrs,index)" class="removeIcon"></i>  
              </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('class.classTime')" required>
          <div v-for="(item,index) in formData.clasTimes" class="task_line" :key="item.key">
            <div class="classes_btn">
              <el-button v-if="formData.clasTimes&&formData.clasTimes.length>=1&&index!=0" @click.prevent="removeType(index)" round size="small" class="removeButton">删除该上课时段</el-button>
              <el-button v-else @click.prevent="addType()" round size="small" class="add">增加上课时段</el-button>
              <el-button @click="copy(index)" round size="small" class="codyButton">复制该上课时段</el-button>
            </div>
            <SelectOpt v-model="item.week" :width="200" :data="codeData.week" placeholder="请选择" ></SelectOpt>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-time-picker v-model="item.startTime" format="HH:mm" @change="clearable(item)" value-format="HH:mm" placeholder="开始时间">
            </el-time-picker>
            &nbsp;&nbsp;&nbsp;
            <el-time-picker v-model="item.endTime" :disabled="item.startTime==''||item.startTime==null" :picker-options="{
                                              selectableRange: item.startTime!=null?`${item.startTime}+':00' - 23:59:59`:''
                                            }" format="HH:mm" value-format="HH:mm" placeholder="结束时间">
            </el-time-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="cancel" class="submit_button submit">{{$t('form.cancel')}}</el-button>
          <el-button type="primary" @click="submitForm" class="submit_button submit">{{$t('form.submit')}}</el-button>
        </el-form-item>
      </el-form>
    <Dialog ref="dialog" :title="$t('class.addTime')" @submit="submit">
			<template slot="content">
         <el-form size="medium" ref="formData1" :model="formData1" :rules="rules" label-width="200px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
            <el-form-item :label="$t('class.startTimeLabel')" prop="startTime">
              <TimeSelect v-model="formData1.startTime" :placeholder="$t('class.startTime')"></TimeSelect>
            </el-form-item>
             <el-form-item :label="$t('class.endTimeLabel')" prop="endTime">
              <TimeSelect v-model="formData1.endTime" :minTime="formData1.startTime" :placeholder="$t('class.endTime')"></TimeSelect>
            </el-form-item>
         </el-form>
			</template>
		</Dialog>
  </div>
</template>
<script>
  import {
    clone,
    getCookie,
    debounce,
    deleteForArr,
    getCode,
    isEmpty,
    validateForm,
    getTableSectionData
  } from "assets/js/reused";
  import {
    validateHasDecimal,
    validateNumber
  } from "assets/js/vuelidate";
  import UploadImg from "common/UploadImg";
  import Day from "common/Day";
  import RadioOpt from "common/RadioOpt";
  import ImageBar from "common/ImageBar"
  import SelectOpt from "common/SelectOpt";
  import Dialog from "common/Dialog";
  import FormItem from "common/FormItem";
  import TimeSelect from "common/TimeSelect";
  import SearchBar from "common/SearchBar";
  import DatePickerStart from "common/DatePickerStart";
  import DatePickerEnd from "common/DatePickerEnd";
  export default {
    name: "addClass",
    components: {
      UploadImg,
      RadioOpt,
      SelectOpt,
      Day,
      Dialog,
      FormItem,
      ImageBar,
      TimeSelect,
      SearchBar,
      DatePickerEnd,
      DatePickerStart
    },
    data() {
      return {
        formData: {
          clas:{
            campusId:null,
            clasName:null,
            logoImg:null,
            periodType: null,
            startDt: null,
            endDt: null,
            des:null,
            deductVal: null,
            duration: null,
            campusFieldId:null
          },
          clasTchrs:[
            {
              tchrType:0,
              memberId:null
            }
          ],
          clasTimes: [
              {
                  week:null,
                  startTime: null,
                  endTime: null
              }
          ]
        },
        formData1:{
          index:null,
          startTime:null,
          endTime:null
        },
        campusData:[],
        campusField:[],
        trainLevel:[],
        course:[],
        active:0,
        isEdit:false,
        codeData:{},
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        rules: {
          "clas.campusId":[{
             required: true,
            message:this.$t('form.required'),
            trigger: "change"
          }],
          "clas.clasName": [{
            required: true,
            message:this.$t('form.required'),
            trigger: "blur"
          }],
          "clas.deductVal":[{
            required:true,
            message:this.$t('form.required'),
            trigger: "blur"
          },{
            validator:validateHasDecimal,
             trigger: "blur"
          }],
          "clas.startTime":[
            {
              required: true,
              message: this.$t('form.required'),
              trigger: "change"
            }
          ],
          "clas.endTime":[
            {
              required: true,
              message: this.$t('form.required'),
              trigger: "change"
            }
          ],
          "clas.periodType":[
            {
              required: true,
              message: this.$t('form.required'),
              trigger: "change"
            }
          ],
          "clas.campusFieldId":[
            {
              required: true,
              message: this.$t('form.required'),
              trigger: "change"
            }
          ]
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      submit(){
         this.$refs['formData1'].validate((valid) => {
          if (valid) {
            this.codeData.week.map((item,index)=>{
              if(index===this.formData1.index){
                item.clasTime.push(clone(this.formData1))
              }
            })
            this.$refs.dialog.close();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      periodTypeChange(){
        this.formData.clas.startDt=null;
        this.formData.clas.endDt=null;
      },
      campusChange(v){
        this.campusData=this.codeData.campusFieldId.filter((item)=>item.campusId===v);
      },
      clearable(item) {
        item.endTime = "";
      },
      addType() {
        //新增
        this.formData.clasTimes.push({
            week:null,
            startTime: null,
            endTime: null
        });
      },
      copy(index) {
        //复制
        this.formData.clasTimes.splice(
          index,
          0,
          clone(this.formData.clasTimes[index])
        );
      },
      removeType(index) {
        //删除时段
        this.formData.clasTimes.splice(index, 1);
      },
      async init() {
        this.codeData=await getCode("campus,_week,_period_type,campusField");
        // this.codeData.week.map((item)=>{
        //   // item.clasTime=[];
        //   this.$set(item,"clasTime",[])
        //   return item;
        // })
        this.$nextTick(()=>{
          // this.$refs.campusId.selectDefaultData();
        })
      },
      searchOptFn(v){
       let unMemberIds=getTableSectionData({
          tableData:this.formData.clasTchs,
          itemName:["memberId"],
          getArr:true
        })
        unMemberIds=unMemberIds.filter((item)=>item).toString();
          return {"category":"member","keyword":v,unMemberIds}
      },
      async courseFind(v){
       return await post("clas/tch_course_find",{
          trainLevelId:v
        })
      },
      getTrainId(id){
        this.trainLevel=this.codeData.trainLevel.filter((item)=>item.trainId===id);
        this.$nextTick(()=>{
          this.$refs.trainLevelId&&this.$refs.trainLevelId.selectDefaultData();
        })
      },
      getTrainLevelId(id){
        debounce(async()=>{
          this.course=await this.courseFind(id);
          this.$nextTick(()=>{
            this.$refs.tchCourseId.selectDefaultData();
          })
        },200)
      },
      removeClasTch(item,index){
        item.splice(index,1)
      },
      addClasTch(){
        this.formData.clasTchrs.push({
            memberId:null,
            tchrType:1
        })
      },
      addTime(index){
        this.$refs.dialog.show()
        this.formData1.startTime=null,
        this.formData1.endTime=null
        this.formData1.index=index;
      },
      removeTime(item,index){
        item.splice(index,1)
      },
      pushCallbackFn(element){
          return {
              value:element.display ,//显示需要的
              id: element.value
          }
      },
      cancel(){
        this.$store.commit("deleteTabAndGo")
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
        if(formName==="formData"){
          this.$nextTick(()=>{
              this.$refs.areaId.selectDefaultData();
          })
        }
        if(formName==="formData2"){
          this.$nextTick(()=>{
              this.formData2.amount=null;
              this.$refs.trainId.selectDefaultData();
          })
        }
      },
      submitForm(formName) {
        let formData = clone(this.formData);
        if(isEmpty(formData.clasTimes)){
          this.$alert(this.$t('class.msg2'))
          return
        }
        validateForm({
          form: this.$refs["formData"],
          formData: formData,
          url: "clas/add",
          success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
.reset{
  width: 100px;
}
.submit{
  width: 100px;
}
.form1{
  padding-top: 20px;
  width: 500px;
  margin: 0 auto;
  min-width: 500px;
}
.form2{
  padding-top: 20px;
  width: 700px;
  margin: 0 auto;
  min-width: 700px;
}
.card_info{
  width: 600px;
  background: #f8f8f8;
  padding: 10px;
}
.edit{
  color:#409eff;
  cursor: pointer;
  padding-left: 10px;
}
.title{
  font-size: 18px;
}
.headImg{
  padding: 20px 0;
}
.list{
  padding: 20px;
}
.classTime{
  width: 1130px;
}
.bg1{
  background: #ddd;
  margin: 0 10px;
  margin-bottom: 10px;
}
.tch{
  width: 330px;
}
.task_line {
  margin-bottom: 10px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  width: 713px;
  .el-input.el-input--medium {
    width: 228px;
    // margin-bottom: 10px;
  }
  .deductinglessons {
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
</style>
