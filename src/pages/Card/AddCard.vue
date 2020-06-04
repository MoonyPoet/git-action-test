<template>
    <div class="add_card">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form">
            <el-form-item :label="$t('addCard.cardNameLabel')" prop="cardName">
            <el-input v-model="formData.cardName" :placeholder="$t('addCard.cardName')" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCard.cardTypeDisplay')"  prop="cardType">
                <RadioOpt v-model="formData.cardType" @change="cardTypeChange" :data="codeData.cardType"></RadioOpt>
            </el-form-item>
            <el-form-item :label="$t('addCard.cardValLabel')" v-if="formData.cardType===1" prop="cardVal">
              <el-input v-model="formData.cardVal" @input="computedUnitAmount" :placeholder="$t('addCard.cardVal')" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCard.useDayLabel')" prop="useDay">
            <el-input v-model="formData.useDay" :placeholder="$t('addCard.useDay')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCard.salesAmountLabel')"  prop="salesAmount">
            <el-input v-model="formData.salesAmount" @input="computedUnitAmount" :placeholder="$t('addCard.salesAmount')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCard.unitPriceLabel')" prop="unitAmount">
            <el-input v-model="formData.unitAmount" :placeholder="$t('addCard.unitPrice')" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCard.desLabel')" prop="des">
            <el-input v-model="formData.des" class="textarea"  rows="4" type="textarea" :placeholder="$t('addCard.des')"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.submit')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {clone,getCookie,validateForm,getCode,reEmphasis,isEmpty} from "assets/js/reused";
import CheckBox from "common/CheckBox";
import SelectOpt from "common/SelectOpt";
import RadioOpt from "common/RadioOpt";
import SelectMultiple from "common/SelectMultiple";
import {campusFind} from "assets/js/mixin";
import couponMixin from "./mixin";
export default {
  components: {CheckBox,SelectOpt,RadioOpt,SelectMultiple},
  name: 'addCard',
  mixins:[campusFind,couponMixin],
  data() {
    return {
      formData: {
        cardName:null,
        cardType:null,
        cardVal:"",
        useDay:"",
        salesAmount:null,
        des:null,
        unitAmount:null
      },
      campusData:[],
      codeData:{},
    };
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      this.codeData=await getCode("train,_card_type,campus");
      this.$nextTick(()=>{
        // this.$refs.select.selectDefaultData()
        this.formData.cardType=1;
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      //判断对应城市下校区是否全选传给后端为0;
      //处理成后端需要的数据
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "card/add",
        success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
        }
      });
    },
  },
};

</script>
<style lang="scss" scoped>
/deep/.el-checkbox-group{
  width: 600px;
}
</style>
