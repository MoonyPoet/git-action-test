<template lang='html'>
    <Dialog ref="dialog" :title="''" width="1176px" :isShowFooter="false">
       <div slot="content">
           <el-row class="pb_10">
                <el-col :span="10">{{$t('class.time')}}：{{hourStudentData.weekName}}&nbsp;&nbsp;&nbsp;&nbsp;{{hourStudentData.startTime}} - {{hourStudentData.endTime}}</el-col>
                <el-col :span="6">{{$t('class.campusFieldIdLabel')}}：{{hourStudentData.fieldName}}</el-col>
                <el-col :span="6">{{$t('class.deductValLabel')}}：{{hourStudentData.deductVal}}{{$t('unit.cardVal')}}/{{$t('unit.class')}}</el-col>
            </el-row>
            <el-row class="pb_10">
                {{$t('class.TimetableStudentList')}}
            </el-row>
            <hr>
            <ul>
                <li class="text_center mb_10 cur" v-for="item in hourStudentData.stus" :key="item.id" @click="studentClick(item.stuId)">
                    <div class="mb_10"><ImageBar :load="item.headImg" :fail='studentImg' width="45" class="coach_avatar"></ImageBar></div>
                    <div class="text_over">{{item.stuName}}</div>
                </li>
            </ul>
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
     export default {
        name: 'hourStudent',
        components:{
            ImageBar,
            Dialog
        },
        data () {
            return{
                studentImg:studentImg,
                hourStudentData:[],
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
           async show(v){
                resetObj(this.formData3)
                this.hourStudentData=await this.find(v)
                this.$refs.dialog.show();
            },
            async find(clasTimeId){
              return await post("clas/clas_time_stu_find",{
                    clasTimeId:clasTimeId
                })
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
</style>