<template>
    <div class="add_version_task">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
            <el-form-item :label="$t('tchTask.trainIdLabel')" prop="trainId">
             {{formData.trainId}}
            </el-form-item>
            <el-form-item :label="$t('tchTask.taskNameLabel')" prop="taskName">
            {{formData.taskName}}
            </el-form-item>
            <el-form-item :label="$t('tchTask.taskVodsLabel')" prop="taskName">
              <ViewVideo v-model="formData.taskVods"></ViewVideo>
            </el-form-item>
            <el-form-item :label="$t('tchTask.taskContentLabel')" prop="taskContent">
                {{formData.taskContent}}
            </el-form-item>
            <el-form-item
              :label="$t('tchTask.taskRequirements')"
            >
            <template v-if="formData.trainId">
                  <el-row class="group" v-for="(item,index) in formData.tchTaskItems" :key="item.id">
                    <el-row style="margin-bottom:20px;">
                        <el-col :span="6">
                          <FormItem :label="$t('tchTask.sortLabel')" :width="200">
                            {{item.sort}}
                          </FormItem>
                        </el-col>
                    </el-row>
                    <el-row v-for="(note,nIndex) in item.tchTerms" style="padding-bottom:20px;" :key="note.id">
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchTask.group')"
                          >
                         {{note.termGroup}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                          <el-form-item
                            :label="$t('tchTask.trainTermIdLabel')"
                          >
                          {{note['trainTermId']}}
                          </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchTask.termVal')"
                          >
                        {{note.termVal}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                </el-row>
            </template>
             <span v-else>{{$t('tchTask.msg1')}}</span>
            
            </el-form-item>
            <el-form-item>
              <BackButton></BackButton>
            </el-form-item>  
        </el-form>
    </div>
</template>
<script>
import { clone,getCode,validateForm,bindData,getCodeDisplay,setTableItemVal} from "assets/js/reused";
import { validatePhone,validateNaturalNumber} from "assets/js/vuelidate";
import ViewVideo from 'common/ViewVideo';
import SelectOpt from 'common/SelectOpt';
import FormItem from "common/FormItem";
import BackButton from "common/BackButton";
export default {
  components: {ViewVideo,SelectOpt,FormItem,BackButton},
  name: "addTchTask",
  data() {
    return {
      formData: {
        taskName:null,
        taskVods:null,
        taskContent:null,
        num:null,
        trainId:null,
        tchTaskItems:[]
      },
      level:[],
      checkObj: "",
      teachModel:"",
      trainTerm:[],
      codeData:{},
      count:0,
      rules: {
        
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
      this.codeData=await getCode("train,trainTerm");
      bindData({formData:this.formData,res:await this.find()})
      this.formData.trainId=getCodeDisplay(this.codeData.train,this.formData.trainId);
      // setTableItemVal(this.formData.tchTaskItems,"trainTermId",getCodeDisplay(this.codeData.trainTerm))
      this.formData.tchTaskItems.map((item)=>{
        item.tchTerms.map((note)=>{
           if(note.trainTermId){
              note.trainTermId=getCodeDisplay(this.codeData.trainTerm,note.trainTermId)
            }
        })
      })
      // this.trainTermId
    },
    async find(){
      return await post("tch_task/find",{
        tchTaskId:this.$route.query.tchTaskId
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      formData.tchTaskId=this.$route.query.tchTaskId;
      validateForm({
          form: this.$refs["formData"],
          formData: formData,
          url: "tch_task/edit",
          success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
          }
      });
    },
    getLevelData(data={}){
      return new Promise((resolve,reject)=>{
        this.$axios.post({
          url:baseURL+"teachlevel/findenable",
          data:{
            ...data
          },
          success:(res)=>{
            resolve(res.data)
          }
        })
      })
    },
    getThProjectData(data={}){
      return new Promise((resolve,reject)=>{
        this.$axios.post({
          url:baseURL+"teachproj/findenable",
          data:{
            ...data
          },
          success:(res)=>{
            resolve(res.data)
          }
        })
      })
    },
    teachModelFind(){
      //版本
      return new Promise((resolve,reject)=>{
        this.$axios.post({
          url:baseURL+"teachmodel/findenable",
          data:{
            teachModelId:this.$route.query.teachModelId
          },
          success:(res)=>{
            resolve(res.data)
          }
        })
      })
    },
    addTerm(){
      this.formData.tchTaskItems.push({
        sort:null,
        tchTerms:[{
          trainTermId:this.getTrainTermId(),
          termGroup:1,
          termVal:1
        }]
      })
    },
    getTrainId(id){
      this.trainTerm=this.codeData.trainTerm.filter((item)=>item.trainId===id);
      //初始生成一个
      // if(this.count===0){
      //   this.addTerm()
      //   this.count++;
      // }
      //设置默认值
      this.formData.tchTaskItems.map((element)=>{
        element.tchTerms.map((item)=>{
          item.trainTermId=this.getTrainTermId()
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addTchTerms(item){
      item.tchTerms.push({
        trainTermId:this.getTrainTermId(),
        termGroup:1,
        termVal:1
      })
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
    getPosition(lng, lat) {
      this.formData.lng = lng;
      this.formData.lat = lat;
    },
    removeTerm(index){
      this.formData.tchTaskItems.splice(index,1)
    },
    handleChange(){

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
