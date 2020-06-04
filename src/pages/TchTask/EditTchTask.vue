<template>
    <div class="edit_version_task">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
            <el-form-item :label="$t('tchTask.trainIdLabel')" prop="trainId">
             <SelectOpt v-model="formData.trainId" @change="getTrainId" :data="codeData.train" :placeholder="$t('tchTask.trainId')"></SelectOpt>
            </el-form-item>
             <el-form-item :label="$t('tchTask.taskNameLabel')" prop="taskName">
            <el-input v-model="formData.taskName" class="des" :placeholder="$t('tchTask.taskName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tchTask.taskVodsLabel')">
              <UploadVideoList v-model="formData.taskVods"></UploadVideoList>
            </el-form-item>
            <el-form-item :label="$t('tchTask.taskContentLabel')" prop="taskContent">
                <el-input type="textarea" rows="4" class="des" :placeholder="$t('tchTask.taskContent')" v-model="formData.taskContent"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('tchTask.taskRequirements')"
              required
            >
            <template v-if="formData.trainId">
                  <el-row class="group" v-for="(item,index) in formData.tchTaskItems" :key="item.id">
                    <el-row style="padding-left:20px;padding-bottom:20px;">
                      <el-button round v-if="formData.tchTaskItems.length>=1&&index!==0" class="remove" @click.prevent="removeTerm(index)">{{$t('tchTask.deleteTrainGroup')}}</el-button>
                      <el-button round class="add" v-else @click.prevent="addTerm()">{{$t('tchTask.addTrainingGroup')}}</el-button>
                      <el-button round class="copy" @click.prevent="copyItem(item,index)">{{$t('tchTask.copyTrainingGroup')}}</el-button>
                    </el-row>
                    <el-row style="margin-bottom:20px;">
                        <el-col :span="6">
                          <FormItem :label="$t('tchTask.sortLabel')" :width="200" :prop="'tchTaskItems.'+index+'.sort'" :rules="[{required:true,message:$t('form.required'), trigger: 'blur' },{
                           validator:validateNaturalNumber
                          }]">
                            <el-input v-model="item.sort" :placeholder="$t('tchTask.sort')"></el-input>
                          </FormItem>
                        </el-col>
                    </el-row>
                    <el-row v-for="(note,nIndex) in item.tchTerms" style="padding-bottom:20px;" :key="note.id">
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchTask.group')"
                            required
                          >
                          <el-input-number v-model="note.termGroup" :min="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                          <el-form-item
                            :label="$t('tchTask.trainTermIdLabel')"
                            :prop="'tchTaskItems.'+index+'.tchTerms.'+nIndex+'.trainTermId'"
                            :rules="[{required:true,message: $t('form.required'), trigger: 'change' }]"
                          >
                          <SelectOpt :width="200" v-model="note['trainTermId']" :data="trainTerm" :placeholder="$t('tchTask.trainTermId')"></SelectOpt>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item
                            :label="$t('tchTask.termVal')"
                            required
                          >
                        <el-input-number v-model="note.termVal"  :min="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <i  v-if="item.tchTerms&&item.tchTerms.length>=1&&nIndex!=0" @click.prevent="removeTchTerm(item.tchTerms,nIndex)" class="removeIcon"></i>
                        <i  v-else  @click.prevent="addTchTerms(item)" class="addIcon"></i>
                      </el-col>
                    </el-row>
                </el-row>
            </template>
             <span v-else>{{$t('tchTask.msg1')}}</span>
            
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
  name: "editTchTask",
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
        trainId:[{ required: true, message: this.$t("form.required"), trigger: "change" }],
        taskName:[{ required: true, message: this.$t("form.required"), trigger: "change" }],
        taskContent: [{ required: true, message: this.$t("form.required"), trigger: "blur" }],
        title: [{ required: true, message: this.$t("form.required"), trigger: "blur" }],
        teachLabelId: [{ required: true, message: this.$t("form.required"), trigger: "change" }]
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
    },
    async find(){
      return await post("tch_task/find",{
        tchTaskId:this.$route.query.tchTaskId
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      formData.tchTaskId=this.$route.query.tchTaskId;
      deleteField({formData:formData,arrField:["tchTaskItemId","tchTermId"]})
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
    async getTrainId(id){
      this.trainTerm=this.codeData.trainTerm.filter((item)=>item.trainId===id);
      //初始生成一个
      if(this.count===0){
        this.count++;
      }else{
        //设置默认值
       this.formData.tchTaskItems.map((element)=>{
        element.tchTerms.map((item)=>{
          item.trainTermId=this.getTrainTermId()
        })
       })
      }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.edit_version_task {
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
