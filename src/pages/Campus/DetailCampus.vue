<template lang='html'>
    <div>
         <div class='campus_header basic-container'>
            <el-row>
            <el-col :span="3">
                <div style="width: 200px;">
                    <ImageBar :load="campusData.logImg" :fail='campusIcon' width="100" class="campus_avatar"></ImageBar>
                    <div style="text-align:center;padding-top:6px;">{{$t('campus.campusNameLabel')}}:{{campusData.campusName}}</div>
                </div>
            </el-col>
            <el-col :span="19" :offset="1">
                 <el-row class="list_row">
                    <el-col :span="8">{{$t('campus.addressLabel')}}:{{campusData.address}}</el-col>
                    <el-col :span="8">{{$t('campus.contackNameLabel')}}:{{campusData.contackName}}</el-col>
                    <el-col :span="8">{{$t('campus.contackPhoneLabel')}}:{{campusData.contackPhone}}</el-col>
                 </el-row>
            </el-col>
            </el-row>
          </div>
          <el-tabs type="border-card" class="tab" @tab-click="changeTab">
              <el-tab-pane>
                  <span slot="label">{{$t('campus.contackFieldLabel')}}</span>
                  <CampusField v-if="index==='0'" class="basic-container"></CampusField>
              </el-tab-pane>
              <el-tab-pane>
                  <span slot="label">校区手环</span>
                  <CampusAnt v-if="index==='1'" class="basic-container"></CampusAnt>
              </el-tab-pane>
          </el-tabs>
      </div>
</template>
<script>

import {campus} from "./store"
import campusImg from "assets/img/student.png"
import ImageBar from 'common/ImageBar';
import CampusField from "./Components/CampusField";
import CampusAnt from "./Components/CampusAnt";

export default {
  name: "DetailCampus",
  components: {
   ImageBar,CampusField,CampusAnt
  },
  data() {
    return {
      index: "0",
      campusData:"",
      campusIcon:campusImg
    };
  },
  created(){
     this.init()
  },
  methods: {
    changeTab(v) {
      this.index = v.index;
    },
    init(){
        this.campusFind().then((res)=>{
            this.campusData=res ;
            campus.setCampusData(res);
        })
    },
    campusFind(){
        return new Promise((resolve,reject)=>{
            this.$axios.post({
                url:baseURL+"campus/find",
                data:{
                    campusId:this.$route.query.campusId
                },
                success:(res)=>{
                    resolve(res.data)
                }
            })
        })
    },
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
