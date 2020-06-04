<template lang='html'>
    <Dialog ref="dialog" title="编辑时段" width="1000px" @submit="submit">
       <div slot="content">
          <el-form size="medium" ref="formData" :model="formData" :rules="rules" label-width="150px" label-position="left" class="base_form form1" :validate-on-rule-change="false">
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
    resetObj
  } from "assets/js/reused";
    import studentImg from "assets/img/student.png"
    import Dialog from "common/Dialog";
    import ImageBar from "common/ImageBar";
    import SelectOpt from "common/SelectOpt";
     export default {
        name: 'classTime',
        components:{
            ImageBar,
            Dialog,
            SelectOpt
        },
        data () {
            return{
                studentImg:studentImg,
                formData:{
                    clasTimes: [
                        {
                            week:null,
                            startTime: null,
                            endTime: null
                        }
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
                this.formData.clasTimes=list;
                 this.$refs.dialog.show();
            },
            addType() {
                //新增
                this.formData.clasTimes.push({
                    week:null,
                    startTime: null,
                    endTime: null
                });
            },
            clearable(item) {
                item.endTime = "";
            },
            close(){
                this.$refs.dialog.close();
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
            submit(){
                let formData = clone(this.formData);
                let clasTimes=formData.clasTimes.map((item)=>{
                    item.clasId=this.$route.query.clasId;
                    delete item["weekDisplay"];
                    return item;
                })
                validateForm({
                    form: this.$refs["formData"],
                    formData: clasTimes,
                    url: "clas/time_edit",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                       this.$refs.dialog.close()
                       this.$emit("isSubmit",true)
                    }
                });
            },
            removeType(index) {
                //删除时段
                this.formData.clasTimes.splice(index, 1);
            },
            studentClick(id){
                 this.$store.commit("addTabAndActive", {
                    url: "/student/detailStudent",
                    data: {
                        stuId: id
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