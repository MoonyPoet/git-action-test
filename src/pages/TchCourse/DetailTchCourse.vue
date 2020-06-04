<template>
    <div class="add_version_task">
        <el-form :model="formData" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
            <el-form-item :label="$t('tchCourse.trainIdLabel')" prop="trainId">
             {{formData.trainName}}
            </el-form-item>
            <el-form-item :label="$t('tchCourse.courseNameLabel')" prop="courseName">
             {{formData.courseName}}
            </el-form-item>
            <el-form-item :label="$t('tchCourse.courseVodsLabel')" prop="courseVods">
              <ViewVideo v-model="formData.courseVods" ></ViewVideo>
            </el-form-item>
            <el-form-item :label="$t('tchCourse.courseContentLabel')" prop="courseContent">
               {{formData.courseContent}}
            </el-form-item>
            <el-form-item :label="$t('tchCourse.trainLevelIdLabel')" prop="trainLevelId">
              {{formData.trainLevelName}}
            </el-form-item>
            <el-form-item :label="$t('tchCourse.tchTaskIdLabel')" prop="tchTaskId">
             {{formData.tchTaskName}}
            </el-form-item>
            <el-form-item
              :label="$t('tchCourse.teachingRequirements')"
            >
            <template v-if="formData.trainId">
                  <el-row class="group" v-for="(item,index) in formData.tchTerms" :key="item.id">
                    <el-row>
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchCourse.group')"
                          >
                          {{item.termGroup}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                          <el-form-item
                            :label="$t('tchCourse.trainTermId')"
                          >
                          {{item['trainTermName']}}
                          </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchCourse.termVal')"
                          >
                        {{item.termVal}}
                        </el-form-item>
                      </el-col>
                      
                    </el-row>
                </el-row>
            </template>
             <span v-else>{{$t('tchCourse.msg1')}}</span>
            </el-form-item>
            <el-form-item>
            <BackButton></BackButton>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { clone,getCode,validateForm,bindData,deleteField} from "assets/js/reused";
import { validatePhone,validateNaturalNumber} from "assets/js/vuelidate";
import ViewVideo from 'common/ViewVideo';
import SelectOpt from 'common/SelectOpt';
import FormItem from "common/FormItem";
import BackButton from "common/BackButton";
export default {
  components: {ViewVideo,SelectOpt,FormItem,BackButton},
  name: "editTchCourse",
  data() {
    return {
      formData: {
        trainName:null,
        trainLevelName:null,
        tchTaskName:null,
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
