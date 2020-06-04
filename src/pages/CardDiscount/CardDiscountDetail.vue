<template>
    <div class="cardDiscount_detail">
        <el-form   size="medium"  label-width="200px" label-position="left" class="base_form">
            <el-form-item :label="$t('cardDiscountDetail.cardDiscountName')" >
              {{cardDicountData.cardDiscountName}}
            </el-form-item>

            <el-form-item v-if="isLimite" :label="$t('cardDiscountDetail.startTime')" >
              {{cardDicountData.startDt}}
            </el-form-item>

             <el-form-item v-if="isLimite" :label="$t('cardDiscountDetail.endTime')" >
              {{cardDicountData.endDt}}
            </el-form-item>
            <el-form-item v-if="isLimite===0" :label="$t('cardDiscountDetail.time')" >
              {{$t('cardDiscountDetail.indefinite')}}
            </el-form-item>

            <el-form-item :label="$t('cardDiscountDetail.des')" >
              {{cardDicountData.des}}
            </el-form-item>

           <TableBar ref="table" :data="tableData" :colConfigs="colConfigs" >
        </TableBar>
        </el-form>
    </div>
</template>
<script>
import {clone,getCookie,validateForm,getCode,bindData,isEmpty,dateFormat} from "assets/js/reused";
import TableBar from "common/TableBar";

export default {
  components: {TableBar},
  name: 'cardDiscountDetail',
  data() {
      return {
        tableData:[],
        isLimite:1,
        cardDicountData:{},
        colConfigs:[
				{ prop: 'cardName', label: this.$t('cardDiscountDetail.cardName')},
				{ prop: 'discount', label: this.$t('cardDiscountDetail.discount') },
				{ prop: 'giveVal', label: this.$t('cardDiscountDetail.giveVal') },
        { prop:'giveOther',label: this.$t('cardDiscountDetail.giveOther')}
			],
       }
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      let cardDicount=await post("card_discount/find",{
        cardDiscountId:this.$route.query.cardDiscountId
      })
      this.cardDicountData=cardDicount;
      if(this.cardDicountData.startDt&&this.cardDicountData.endDt){
        this.cardDicountData.startDt=dateFormat("yyyy-MM-dd hh:mm",new Date(parseInt(this.cardDicountData.startDt) * 1000));
        this.cardDicountData.endDt=dateFormat("yyyy-MM-dd hh:mm",new Date(parseInt(this.cardDicountData.endDt) * 1000));
      }else{
         this.isLimite=0;
      }
      this.tableData=this.cardDicountData.cardDiscountItems;
    },

  },
};

</script>
<style lang="scss" scoped>
/deep/.el-checkbox-group{
  width: 600px;
}
</style>
