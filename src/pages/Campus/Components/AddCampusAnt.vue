<template>
    <div >
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form" :validate-on-rule-change="false">
            <el-form-item label="校区" prop="campusId">
             <SelectOpt v-model="formData.campusId" ref="campusId" :data="codeData.campusId"></SelectOpt>
            </el-form-item>
            <el-form-item label="手环包" prop="antboxsn">
              <el-input v-model="formData.antboxsn" placeholder="请输入手环包"></el-input>
            </el-form-item>
            <el-row v-for="(item,index) in formData.antItems" :key="item.id">
              <el-col :span="6">
                <el-form-item label="手环ID"  :prop="'antItems.'+index+'.antsn'" :rules="[{
                  required:true,message:'必填',trggier:'blur'
                }]">
                <el-input v-model="formData.antItems[index].antsn" placeholder="请输入手环ID"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手环编号" :prop="'antItems.'+index+'.antno'" :rules="[{
                  required:true,message:'必填',trggier:'blur'
                }]">
                <el-input v-model="formData.antItems[index].antno" placeholder="请输入手环编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <i class="addIcon" @click="addAntsn" v-if="index===0"></i>
                <i class="removeIcon" @click="removeAntsn(index)" v-else></i>
              </el-col>
            </el-row>
            <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" class="submitButton">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import SelectOpt from "common/SelectOpt";
import {clone,getCookie,isEmpty,getCode,validateForm} from "assets/js/reused";
export default {
  components: {SelectOpt},
  name: 'addCampusAnt',
  data() {
    return {
      formData: {
        campusId:null,
        antItems:[{antno:null,antsn:null}],
        antboxsn:null
      },
      codeData:{},
      rules:{
        campusId:[{
          required:true,message:this.$t('form.required'),trigger:'change'
        }],
        antboxsn:[{
          required:true,message:this.$t('form.required'),trigger:'blur'
        }]
      }
    };
  },
  created(){
      this.init();
  },
  methods: {
    async init(){
        this.codeData=await getCode("campus");
        this.$nextTick(()=>{
          this.$refs.campusId.selectDefaultData();
        })
    },
    addAntsn(){
      this.formData.antItems.push({antno:"",antsn:""});
    },
    removeAntsn(index){
      this.formData.antItems.splice(index,1)
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "campus_ant/add",
        success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
        }
      });
    }
  },
};

</script>
<style lang="scss" scoped>
.addcampusbracelet{
  .el-input{
    width: 300px;
  }
  /deep/.el-select .el-input input{
    width: 300px;
  }
}
</style>
