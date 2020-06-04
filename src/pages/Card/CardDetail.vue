<template>
    <div class="card_detail">
        <el-form :model="formData"  size="medium" ref="formData" label-width="200px" label-position="left" class="base_form">
            <el-form-item :label="$t('cardDetail.cityName')" prop="areaIds">
              {{areaName}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.campusName')" prop="campusIds">
              {{campusName}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.cardName')">
            {{formData.cardName}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.traninType')" >
              {{trainType}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.cardTypeDisplay')" >
              {{formData.cardType==1?"课时卡":"有效期卡"}}
            </el-form-item>
            <el-form-item label="课时:" v-if="formData.cardType===1" >
             {{ formData.cardVal}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.useDay')"  v-if="formData.cardType===2" prop="useDay">
            {{formData.useDay}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.salesAmount')" >
            {{formData.salesAmount}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.unitPrice')">
            {{formData.unitAmount}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.guaranteeAmount')">
            {{formData.guaranteeAmount}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.isLeaveDeduct')">
              {{formData.isLeaveDeduct==1?"是":"否"}}
            </el-form-item>
            <el-form-item :label="$t('cardDetail.des')" prop="des">
              {{formData.des}}
            </el-form-item>
            <el-form-item>
              <BackButton></BackButton>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {clone,getCookie,validateForm,getCode,bindData,isEmpty,reEmphasis,getTableSectionData} from "assets/js/reused";
import {getAreaIds} from "assets/js/common";
import SelectBar from "common/SelectBar";
import Radio from "common/Radio";
import {campusFind} from "assets/js/mixin";
import couponMixin from "./mixin";
import BackButton from "common/BackButton";
export default {
  components: {SelectBar,Radio,BackButton},
  name: 'cardDetail',
  mixins:[campusFind,couponMixin],
  data() {
    return {
      formData: {
        cardName:"",
        trainId:"",
        campusIds:[],
        cardType:null,
        cardVal:"",
        useDay:"",
        salesAmount:"",
        guaranteeAmount:"",
        isLeaveDeduct:"",
        unitAmount:"",
        des:"",
        areaIds:[]
      },
      areaName:"",
      campusName:"",
      cardType:"",
      codeData:{},
      campus:[],
      trainType:"",
      provinceArr:[],
      campusData:[],
      isLeaveDeductData:[{value:1,display:"是"},{value:0,display:"否"}]
    };
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      this.codeData=await getCode("train,_card_type,campus");
      let codeData=this.codeData;
      let couponData=await post("card/find",{
        cardId:this.$route.query.cardId
      })
      
      let campusArr=[];
      this.codeData.campus.map((item)=>{
        if(couponData.campusIds.includes(item.value.toString())){
          campusArr.push(item.display);
        }
      });
      this.campusName=campusArr.toString()
      this.trainType=getTableSectionData({tableData:this.codeData.train,itemName:["display"],getArr:true}).toString();
      //根据校区倒推城市
      couponData.campusIds=couponData.campusIds.split(',');
      this.formData.areaIds=getAreaIds(couponData.campusIds,this.codeData);
      let areaArr=[]
      this.codeData.area.map((item)=>{
        if(this.formData.areaIds.some((note)=>note===Number(item.value))){
          areaArr.push(item.display)
        }
      })
      this.areaName=areaArr.toString();
      // this.codeData
      let trainTypeArr=[];
      this.codeData.train.map((item)=>{
        if(couponData.trainId===item.value){
          trainTypeArr.push(item.display);
        }
      });
      this.trainType=trainTypeArr.toString()
      this.$set(this.codeData,'trainType',codeData.trainType);
      this.$set(this.codeData,'cardType',codeData.cardType);
      bindData({formData:this.formData,res:couponData});
    },

  },
};

</script>