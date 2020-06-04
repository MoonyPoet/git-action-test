<template lang='html'>
    <div>
         <div class='train_header basic-container'>
            <el-row>
                <el-col :span="3">
                    <div style="width: 200px;">
                        <ImageBar :load="trainData.logImg" :fail='trainIcon' width="100" class="train_avatar"></ImageBar>
                        <div style="text-align:center;padding-top:6px;">{{trainData.trainName}}</div>
                    </div>
                </el-col>
                <el-col :span="19" :offset="1">
                     <el-row class="list_row">
                     </el-row>
                </el-col>
            </el-row>
          </div>
          <el-tabs type="border-card" class="tab" @tab-click="changeTab">
              <el-tab-pane>
                  <span slot="label">{{$t('train.levelTitle')}}</span>
                  <TrainLevelCont v-if="index==='0'" class="basic-container"></TrainLevelCont>
              </el-tab-pane>
              <el-tab-pane>
                  <span slot="label">{{$t('train.termTitle')}}</span>
                  <TrainTermCont v-if="index==='1'" class="basic-container"></TrainTermCont>
              </el-tab-pane>
          </el-tabs>
      </div>
</template>
<script>

import trainImg from "assets/img/student.png"
import ImageBar from 'common/ImageBar';
import TrainLevelCont from "./Components/TrainLevel";
import TrainTermCont from "./Components/TrainTerm";

export default {
  name: "trainDetail",
  components: {
   ImageBar,TrainLevelCont,TrainTermCont
  },
  data() {
    return {
      index: "0",
      trainData:"",
      trainIcon:trainImg
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
      this.$axios.post({
          url:baseURL+"train_rel/find",
          data:{
              trainRelId:this.$route.query.trainRelId
          },
          success:(res)=>{
              this.trainData = res.data.rows[0]
          }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
    .train_header{
        .list_row{
            margin-bottom: 10px;
            line-height: 24px;
        }
        /deep/ .train_avatar{
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
