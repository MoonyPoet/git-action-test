<template>
    <div class="edit_position">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form">
            <el-form-item :label="$t('position.parentPositionIdLabel')" prop="parentPositionId">
                 <!-- <SearchBar link="system/associative" :placeholder="$t('position.parentPositionId')" :title="$t('position.parentPositionId')" v-model="formData.parentPositionId" :nameLike="formData.parentPositionName"  :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"  :editSearchOpt="true" :isRequired="false"></SearchBar> -->
                 <SelectOpt ref="parentPositionId"  :required="false" :title="$t('position.parentPositionId')" v-model="formData.parentPositionId" :data="codeData.position" :placeholder="$t('position.parentPositionId')"></SelectOpt>
            </el-form-item>
             <el-form-item :label="$t('position.positionNameLabel')" prop="positionName">
                <el-input v-model="formData.positionName" :placeholder="$t('position.positionName')" :title="$t('position.positionName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('position.positionLevelLabel')" prop="positionLevel">
                <el-input v-model="formData.positionLevel" :placeholder="$t('position.positionLevel')" :title="$t('position.positionLevel')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('position.remarkLabel')" prop="remark">
                <el-input v-model="formData.remark" class="textarea" rows="4" type="textarea"
                            :placeholder="$t('position.remark')" :title="$t('position.remarkLabel')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.submit')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {clone,getCookie,bindData,validateForm,getCode } from "assets/js/reused";
import SelectOpt from "common/SelectOpt";
export default {
  components: {SelectOpt},
  name: 'editPosition',
  data() {
    return {
      formData: {
        positionLevel:"",
        parentPositionId:null,
        parentPositionName:"",
        positionName:"",
        remark:""
      },
      codeData:{
        position:[]
      },
      rules: {
          positionName: [
              {required: true, message: this.$t("form.required"), trigger: 'blur'},
          ],
          remark: [
              {required: true, message: this.$t("form.required"), trigger: 'blur'},
          ],
          positionLevel: [
              {required: true, message: this.$t("form.required"), trigger: 'blur'},
          ]
      },
    };
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      let codeData=await getCode("position");
      this.codeData.position=codeData.position.filter((item)=>{
        return item.value!==Number(this.$route.query.positionId);
      })
      this.codeData.position.splice(0,0,{value:0,display:this.$t("position.noSelect")});
      this.find()
    },
    async find(){
      let positionData=await post("pos/pos_find",{
          positionId:this.$route.query.positionId
      })
      bindData({
        formData:this.formData,
        res:positionData
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      delete formData.parentPositionName;
      formData.positionId=this.$route.query.positionId;
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "pos/edit",
        success:(res)=>{
            this.$message({
              message:res.message||"",
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
        }
      });
    },
    searchOptFn(v){
      return {"keyword":"pos","insId":getCookie("insId"),"positionNameLike":v,unPositionId:this.$route.query.positionId}
    },
    pushCallbackFn(element){
        return {
            value:element.display ,//显示需要的
            id: element.value
        }
    },
  },
};

</script>
