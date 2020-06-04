<template lang='html'>
    <div>
         <div class='campus_header basic-container'>
            <el-row>
            <el-col :span="3">
                <div style="width: 200px;">
                    <ImageBar :load="studentData.headImg" :fail='studentImg' width="100" class="campus_avatar"></ImageBar>
                    <div style="text-align:center;padding-top:6px;">{{$t('student.stuNameLabel')}}:{{studentData.stuName}}</div>
                </div>
            </el-col>
            <el-col :span="19" :offset="1">
                 <el-row class="list_row">
                    <el-col :span="8">{{$t('student.sexLabel')}}:{{studentData.sexDisplay}}</el-col>
                    <el-col :span="8">{{$t('student.addressLabel')}}:{{studentData.address}}</el-col>
                    <el-col :span="8">{{$t('student.campusIdLabel')}}:{{studentData.campusName}}</el-col>
                    <el-col :span="8">{{$t('student.followMemberLabel')}}:{{studentData.followMemberName}}</el-col>
                    <el-col :span="8">{{$t('student.birthDtLabel')}}:{{studentData.birthDt}}</el-col>
                    <el-col :span="8">{{$t('student.telLabel')}}:{{studentData.tel}}</el-col>
                 </el-row>
            </el-col>
            </el-row>
          </div>
          <el-tabs type="border-card" class="tab" @tab-click="changeTab">
              <el-tab-pane>
                  <span slot="label">{{$t('student.followLogLabel')}}</span>
                  <FollowLog v-if="index==='0'" class="basic-container"></FollowLog>
              </el-tab-pane>
          </el-tabs>
      </div>
</template>
<script>

import studentImg from "assets/img/student.png"
import ImageBar from 'common/ImageBar';
import FollowLog from './Components/FollowLog';

export default {
  name: "detailPotentialStudent",
  components: {
   FollowLog,
   ImageBar
  },
  data() {
    return {
      index: "0",
      studentData:{},
      studentImg:studentImg
    };
  },
  created(){
     this.init()
  },
  methods: {
    changeTab(v) {
      this.index = v.index;
    },
    async init(){
       this.studentData=await post("student/pot_stu_detail",{
           stuId:this.$route.query.stuId
       })
    }
  }
};
</script>

<style lang="scss" scoped>
    .campus_header{
        .list_row{
            margin-bottom: 10px;
            line-height: 24px;
        }
        /deep/ .campus_avatar{
            &>div{
                max-height: 100px;
                max-width: 100px;
                overflow: hidden;
                text-align: center;
                margin: 0 auto;
                // height: 100px;
                // border-radius: 50%;
            }
        }
    }
    .tab {
     border-top: 1px solid #ddd;
    }
</style>
