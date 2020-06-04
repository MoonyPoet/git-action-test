<template>
    <div class="add_version_task">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
            <el-form-item :label="$t('tchCourse.trainIdLabel')" prop="trainId">
             <SelectOpt v-model="formData.trainId" @change="getTrainId" ref="trainId" :data="codeData.train" :placeholder="$t('tchCourse.trainId')"></SelectOpt>
            </el-form-item>
            <el-form-item :label="$t('tchCourse.courseNameLabel')" prop="courseName">
            <el-input v-model="formData.courseName" class="des" :placeholder="$t('tchCourse.courseName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tchCourse.courseVodsLabel')" prop="courseVods">
              <UploadVideoList v-model="formData.courseVods" ></UploadVideoList>
            </el-form-item>
            <el-form-item :label="$t('tchCourse.courseContentLabel')" prop="courseContent">
                <el-input type="textarea" rows="4" class="des" v-model="formData.courseContent" :placeholder="$t('tchCourse.courseContent')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tchCourse.trainLevelIdLabel')" prop="trainLevelId">
             <SelectOpt  v-if="formData.trainId" v-model="formData.trainLevelId" ref="trainLevelId" :data="trainLevel" :placeholder="$t('tchCourse.trainLevelId')"></SelectOpt>
             <span v-else>{{$t('tchCourse.msg1')}}</span>
            </el-form-item>
            <el-form-item :label="$t('tchCourse.tchTaskIdLabel')" prop="tchTaskId">
             <SelectOpt v-if="formData.trainId" v-model="formData.tchTaskId" ref="tchTaskId" :data="taskData" id="tchTaskId" val="taskName" :placeholder="$t('tchCourse.tchTaskId')"></SelectOpt>
             <span v-else>{{$t('tchCourse.msg1')}}</span>
            </el-form-item>
            <el-form-item
              :label="$t('tchCourse.teachingRequirements')"
              required
            >
            <template v-if="formData.trainId">
                  <el-row class="group" v-for="(item,index) in formData.tchTerms" :key="item.id">
                    <el-row>
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchCourse.group')"
                            required
                          >
                          <el-input-number v-model="item.termGroup" :min="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                          <el-form-item
                            :label="$t('tchCourse.trainTermIdLabel')"
                            :prop="'tchTerms.'+index+'.trainTermId'"
                            :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]"
                          >
                          <SelectOpt :width="200" v-model="item['trainTermId']" :data="trainTerm" :placeholder="$t('tchCourse.trainTermId')"></SelectOpt>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchCourse.termVal')"
                            required
                          >
                        <el-input-number v-model="item.termVal" :min="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <i  v-if="formData.tchTerms.length>=1&&index!=0" @click.prevent="removeTchTerm(formData.tchTerms,index)" class="removeIcon"></i>
                        <i  v-else  @click.prevent="addTerm()" class="addIcon"></i>
                      </el-col>
                    </el-row>
                </el-row>
            </template>
             <span v-else>{{$t('tchCourse.msg1')}}</span>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" class="submitButton" @click="submitForm('formData')">{{$t("form.submit")}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { clone,getCode,validateForm,bindData,deleteField} from "assets/js/reused";
import { validatePhone,validateNaturalNumber} from "assets/js/vuelidate";
import UploadVideoList from 'common/UploadVideoList';
import SelectOpt from 'common/SelectOpt';
import FormItem from "common/FormItem";
export default {
  components: {UploadVideoList,SelectOpt,FormItem},
  name: "editTchCourse",
  data() {
    return {
      formData: {
        trainId:null,
        trainLevelId:null,
        tchTaskId:null,
        courseName:null,
        courseContent:null,
        courseVods:"",
        tchTerms:[]
      },
      trainTerm:[],
      codeData:{},
      taskData:[],
      trainLevel:[],
      count:0,
      rules: {
        trainId:[{ required: true, message: this.$t('form.required'), trigger: "change" }],
        courseName:[{ required: true, message: this.$t('form.required'), trigger: "blur" }],
        courseContent:[{ required: true, message: this.$t('form.required'), trigger: "blur" }],
        trainLevelId:[{ required: true, message: this.$t('form.required'), trigger: "change" }],
        tchTaskId:[{ required: true, message: this.$t('form.required'), trigger: "change" }]
      }
    };
  },
  created(){
    Object.assign(this,{
      validateNaturalNumber:validateNaturalNumber
    })
   this.init()
  },
  methods: {
    async init(){
      this.codeData=await getCode("train,trainTerm,trainLevel");
      bindData({formData:this.formData,res:await this.find()})
    },
    async find(){
      return await post("tch_course/find",{
        tchCourseId:this.$route.query.tchCourseId
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      formData.tchCourseId=this.$route.query.tchCourseId;
      deleteField({formData:formData,arrField:["tchTermId"]})
      validateForm({
          form: this.$refs["formData"],
          formData: formData,
          url: "tch_course/edit",
          success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
          }
      });
    },
    addTerm(){
      this.formData.tchTerms.push({
          trainTermId:this.getTrainTermId(),
          termGroup:1,
          termVal:1
      })
    },
   async getTrainId(id){
      this.trainTerm=this.codeData.trainTerm.filter((item)=>item.trainId===id);
      //初始生成一个
      //设置默认值,切换时作用
      
      //获取等级
      this.trainLevel=this.codeData.trainLevel.filter((item)=>item.trainId===id)
      //获取作业
      this.taskData=await this.findTask(this.formData.trainId);
      if(this.count!==0){
        this.formData.tchTerms.map((element)=>{
         element.trainTermId=this.getTrainTermId()
        })
         this.$nextTick(()=>{
          this.$refs.trainLevelId.selectDefaultData();
          this.$refs.tchTaskId.selectDefaultData();
        })
      }else{
        this.count++;
      }
      
    },
    async findTask(trainId){
      return await post("tch_task/find_task_list",{
        trainId:trainId
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeTchTerm(item,index){
      item.splice(index,1)
    },
    copyItem(item,index){
      this.formData.tchTaskItems.splice(index,0,clone(item))
    },
    getTrainTermId(){
      if(this.trainTerm&&this.trainTerm.length>0){
        return this.trainTerm[0].value;
      }else{
        return null
      }
    },
    removeTerm(index){
      this.formData.tchTaskItems.splice(index,1)
    }
  }
};
</script>
<style lang="scss" scoped>
.add_version_task {
  .add{
    background: #c384ec;
    color: #fff;
  }
  .copy{
    background: #60c0dc;
    color: #fff;
  }
  .group{
    width: 1090px;
    border:1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
    /deep/ .el-form-item__label{
      width:100px !important;
    }
    /deep/ .el-form-item__content{
      margin-left: 100px !important;
    }
  }
  .map {
    width: 500px;
    margin-top: 20px;
  }
  .remove{
    background: #f47564;
    color: #fff;
  }
  .input_small {
    width: 150px;
    margin-right: 20px;
  }
  .el-checkbox + .el-checkbox {
    margin: 0;
    margin-right: 50px;
  }
  .el-checkbox {
    margin-right: 50px;
  }
  .el-input-number .el-input{
    width: 200px;
  }
  .task_line{
    margin-bottom: 20px;
  }
  .textarea{
    width: 400px;
  }
}
</style>
