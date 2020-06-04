<template lang='html'>
    <Dialog ref="dialog" title="编辑教练" width="600px" @submit="submit">
       <div slot="content">
          <el-form size="medium" ref="formData" :model="formData" :rules="rules" label-width="150px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
             <el-form-item :label="$t('class.headCoachLabel')"  prop="clasTchrs.0.memberId" :rules="[{
                    required:true,
                    message:$t('form.required'),
                    trigger: 'change'
                  }]">
                <SearchBar width="100%" link="system/associative" :placeholder="$t('class.headCoach')" v-if="formData.clasTchrs[0]&&formData.clasTchrs[0].memberName"
                    :title="$t('class.headCoach')" v-model="formData.clasTchrs[0].memberId" :nameLike="formData.clasTchrs[0].memberName"
                    :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                    :editSearchOpt="true"></SearchBar>
                </el-form-item>
                <el-form-item :label="$t('class.assistantLabel')">
                    <el-row style="margin-bottom:10px"><i  @click.prevent="addClasTch()" class="addIcon"></i></el-row>
                    <el-row v-for="(item,index) in formData.clasTchrs" :key="item.id" v-if="index!=0" class="tch mb_10">
                        <el-col :span="18">
                        <FormItem :label="$t('class.assistantLabel')" :isShowLabel="false">
                            <SearchBar width="100%" :nameLike="item.memberName" link="system/associative" :placeholder="$t('class.assistantLabel')"
                            :title="$t('class.assistant')" v-model="formData.clasTchrs[index].memberId"
                            :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                            :editSearchOpt="true"></SearchBar>
                        </FormItem>
                        </el-col>
                        <el-col :span="6">
                        <i style="margin-left: 77px;" @click.prevent="removeClasTch(formData.clasTchrs,index)" class="removeIcon"></i>  
                        </el-col>
                </el-row>
                </el-form-item>
          </el-form>
       </div>
    </Dialog>
</template>
<script>
    import {
    clone,
    getCookie,
    debounce,
    deleteForArr,
    selectDefaultData,
    isEmpty,
    getCode,
    validateForm,
    getCodeDisplay,
    getTableSectionData,
    resetObj
  } from "assets/js/reused";
    import studentImg from "assets/img/student.png"
    import Dialog from "common/Dialog";
    import ImageBar from "common/ImageBar";
    import SelectOpt from "common/SelectOpt";
    import SearchBar from "common/SearchBar";
    import FormItem from "common/FormItem";
     export default {
        name: 'classTeacher',
        components:{
            ImageBar,
            Dialog,
            SearchBar,
            SelectOpt,
            FormItem
        },
        data () {
            return{
                studentImg:studentImg,
                formData:{
                    clasTchrs: [
                    ]
                },
                codeData:{},
                rules:{
                    opType:[{
                        required: true,
                        message: this.$t('form.required'),
                        trigger: "blur"
                    }],
                    score:[{
                        required: true,
                        message: this.$t('form.required'),
                        trigger: "blur"
                    }],
                    remark:[{
                        required: true,
                        message: this.$t('form.required'),
                        trigger: "blur"
                    }]
                },
            }
        },
        methods:{
           async show(list){
                resetObj(this.formData3);
                this.codeData=await getCode("_week");
                this.formData.clasTchrs=[...clone(list)];
                 this.$refs.dialog.show();
            },
            clearable(item) {
                item.endTime = "";
            },
            close(){
                this.$refs.dialog.close();
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
            copy(index) {
                //复制
                let obj=clone(this.formData.clasTimes[index]);
                delete obj.clasTimeId;
                this.formData.clasTimes.splice(
                index,
                0,
                obj
                );
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
            pushCallbackFn(element){
                return {
                    value:element.display ,//显示需要的
                    id: element.value
                }
            },
            submit(){
                let formData = clone(this.formData);
                let clasTchrs=formData.clasTchrs.map((item)=>{
                    item.clasId=this.$route.query.clasId;
                    delete item["clasTchrId"];
                    delete item["logoImg"];
                    delete item["memberName"];
                    return item;
                })
                validateForm({
                    form: this.$refs["formData"],
                    formData: clasTchrs,
                    url: "clas/tchr_edit",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                       this.$refs.dialog.close()
                       this.$emit("isSubmit",true)
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
ul li{
    width: 10%;
    display: inline-block;
    img{
        width: 60px;
    }
}
.task_line {
  margin-bottom: 10px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  width: 734px;
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