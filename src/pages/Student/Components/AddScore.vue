<template lang='html'>
    <Dialog ref="dialog3" :title="$t('score.setScore')" @submit="submit3">
        <el-form ref="formData3" :rules="rules" slot="content" :model="formData3" label-width="200px">
            <el-form-item :label="$t('score.typeLabel')" prop="opType">
                <RadioOpt v-model="formData3.opType" ref="scoreType" :data="codeData.scoreType" :placeholder="$t('score.type')"></RadioOpt>
            </el-form-item>
            <el-form-item :label="$t('score.quotaLabel')" prop="score">
                <el-input v-model="formData3.score" :placeholder="$t('score.quota')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('score.remarkLabel')" prop="remark">
                <el-input type="textarea" v-model="formData3.remark" :placeholder="$t('score.remark')"></el-input>
            </el-form-item>
        </el-form>
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
    import RadioOpt from "common/RadioOpt";
    import Dialog from "common/Dialog";
     export default {
        name: 'addScore',
        components:{
            RadioOpt,
            Dialog
        },
        data () {
            return{
                formData3:{
                    opType:null,
                    score:null,
                    remark:null
                },
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
                codeData:{
                    scoreType:[]
                }
            }
        },
        created(){
            this.codeData.scoreType=[
                {value:0,display:this.$t("score.increase")},
                {value:1,display:this.$t("score.decrease")}
            ];
        },
        methods:{
            open(){
                resetObj(this.formData3)
                this.$refs.dialog3.show()
            },
            submit3(){
                let formData = clone(this.formData3);
                formData.stuId=this.$route.query.stuId;
                validateForm({
                    form: this.$refs["formData3"],
                    formData: formData,
                    url: "student/stu_score_edit",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                        this.$refs.dialog3.close()
                       this.$emit("isSubmit",true)
                    }
                });
            }
        }
    }
</script>
<style scoped>
    
</style>